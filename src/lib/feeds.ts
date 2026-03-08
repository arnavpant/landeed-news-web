import { createHash } from "crypto";
import Parser from "rss-parser";
import sanitize from "sanitize-html";
import { Article, FeedSource } from "./types";
import { feedSources } from "./feed-sources";
import { generateLandeedId, assignTags, generateViewCount, classifyCategory } from "./metadata";
import { extractLocations } from "./locations";

type CustomItem = Parser.Item & {
  mediaContent?: Array<{ $?: { url?: string } }>;
  mediaThumbnail?: { $?: { url?: string } };
};

const parser = new Parser<Record<string, unknown>, CustomItem>({
  timeout: 20000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; LandeedBot/1.0)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail"],
    ],
  },
});

function generateId(url: string): string {
  return createHash("sha256").update(url).digest("hex").slice(0, 16);
}

/** Relevance filter — keeps only articles related to real estate / property / land */
const RELEVANT_KEYWORDS =
  /\b(real\s*estate|property|propert|housing|home\s*loan|mortgage|flat|apartment|villa|plot|land|acre|hectare|sq\s*ft|sqft|carpet\s*area|built.?up|rera|stamp\s*duty|registration|encumbrance|title\s*deed|sale\s*deed|mutation|khata|patta|ec\s*certificate|ror|7\/12|satbara|adangal|bhoomi|bhulekh|dharani|igrs|sub.?registrar|residential|commercial|warehouse|office\s*space|co.?working|rental|tenant|landlord|lease|rent|realty|realtor|builder|developer|dlf|godrej\s*properties|prestige|brigade|sobha|lodha|oberoi|hiranandani|puravankara|shriram|mahindra\s*lifespace|tata\s*housing|affordable\s*hous|pradhan\s*mantri|pmay|smart\s*cit|infrastructure|metro\s*line|metro\s*rail|highway|expressway|corridor|township|redevelop|construc|cement|steel\s*price|rbi\s*rate|interest\s*rate|repo\s*rate|home\s*buyer|invest|nri|fdi|reit|fractional|proptech|valuat|capital\s*value|circle\s*rate|ready\s*reckoner|guideline\s*value|floor\s*space|fsi|far|tfar|zoning|master\s*plan|urban|municipal|city\s*plan|occupation\s*certificate|completion\s*certificate|commencement|carpet|super\s*built|price|crore|lakh|sq\s*yard|gaj|marla|kanal|bigha|cent|guntha|ground)\b/i;

function isRelevantArticle(headline: string, summary: string): boolean {
  return RELEVANT_KEYWORDS.test(headline) || RELEVANT_KEYWORDS.test(summary);
}

function extractImageUrl(item: CustomItem): string | null {
  // 1. enclosure (TOI, etc.)
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  // 2. media:content (ET Realty, Livemint, NDTV)
  if (item.mediaContent?.length) {
    const url = item.mediaContent[0]?.$?.url || (item.mediaContent[0] as unknown as { url?: string })?.url;
    if (url) return url;
  }

  // 3. media:thumbnail
  if (item.mediaThumbnail?.$?.url) {
    return item.mediaThumbnail.$.url;
  }

  // 4. <img> in content or content:encoded (News18, IndiaToday)
  const content =
    item.content ||
    ((item as Record<string, unknown>)["content:encoded"] as string) ||
    "";
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch?.[1]) {
    return imgMatch[1];
  }

  return null;
}

async function fetchOgImage(articleUrl: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(articleUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LandeedBot/1.0)" },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    const html = await res.text();
    const patterns = [
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
      /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m?.[1]) {
        return m[1];
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchSingleFeed(source: FeedSource): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);

    const articles = (feed.items || []).map((item) => {
      const url = item.link || "";
      const rawSummary = item.contentSnippet || item.content || "";
      const cleanSummary = sanitize(rawSummary, {
        allowedTags: [],
        allowedAttributes: {},
      }).trim();

      const rawTitle = sanitize(item.title || "", {
        allowedTags: [],
        allowedAttributes: {},
      }).trim();
      // Some feeds use "Headline - Author Name" format
      const lastDash = rawTitle.lastIndexOf(" - ");
      const headline = lastDash > 0 ? rawTitle.slice(0, lastDash).trim() : rawTitle;
      const author = lastDash > 0 ? rawTitle.slice(lastDash + 3).trim() : null;

      const id = generateId(url);
      const category = classifyCategory(headline, source.category);
      const tags = assignTags({ headline, categories: [category] });

      return {
        id,
        headline,
        author,
        summary: cleanSummary.slice(0, 200),
        imageUrl: extractImageUrl(item),
        sourceUrl: url,
        sourceName: source.name,
        publishedAt: item.pubDate
          ? new Date(item.pubDate)
          : item.isoDate
            ? new Date(item.isoDate)
            : new Date(),
        categories: [category],
        landeedId: generateLandeedId(id),
        ...tags,
        viewCount: generateViewCount(id),
        locations: extractLocations(headline, cleanSummary),
      };
    });

    // Fetch OG images for articles missing images (batch, max 15 per feed)
    const needImages = articles.filter((a) => !a.imageUrl).slice(0, 15);
    if (needImages.length > 0) {
      const ogResults = await Promise.allSettled(
        needImages.map((a) => fetchOgImage(a.sourceUrl)),
      );
      ogResults.forEach((result, i) => {
        if (result.status === "fulfilled" && result.value) {
          needImages[i].imageUrl = result.value;
        }
      });
    }

    return articles.filter((a) => isRelevantArticle(a.headline, a.summary));
  } catch (error) {
    console.error(
      `[feeds] Failed to fetch "${source.name}" (${source.url}):`,
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

export async function fetchAllFeeds(): Promise<Article[]> {
  const results = await Promise.allSettled(
    feedSources.map((source) => fetchSingleFeed(source)),
  );

  const articles: Article[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    }
  }

  // Sort newest first
  articles.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
  );

  // Deduplicate by id
  const seen = new Set<string>();
  const unique: Article[] = [];
  for (const article of articles) {
    if (!seen.has(article.id)) {
      seen.add(article.id);
      unique.push(article);
    }
  }

  return unique;
}
