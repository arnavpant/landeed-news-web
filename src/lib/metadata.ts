/**
 * Generate a deterministic Landeed ID in "LND-XXXX-XX" format from an article's hex ID.
 */
export function generateLandeedId(articleId: string): string {
  const digits = articleId
    .slice(0, 4)
    .split("")
    .map((ch) => parseInt(ch, 16) % 10)
    .join("");

  const letters = articleId
    .slice(4, 6)
    .split("")
    .map((ch) => String.fromCharCode(65 + (parseInt(ch, 16) % 26)))
    .join("");

  return `LND-${digits}-${letters}`;
}

/**
 * Classify an article into a Landeed property category based on headline keywords.
 * Falls back to the feed-level category if no keyword match is found.
 */
export function classifyCategory(headline: string, feedCategory: string): string {
  const lower = headline.toLowerCase();

  // Regulation / Policy
  if (/\b(rera|regulat|compliance|penalty|government|policy|reform|amendment|budget|law|legal|court|tribunal|stamp duty|registr|land record|encumbrance|mutation|land revenue)\b/.test(lower)) {
    return "Regulation";
  }

  // Land & Agriculture
  if (/\b(agricultur|farmland|farm land|rural land|crop|farmer|agri[\s-]?land|land acqui|land grab|land ceiling|land reform|land deal|acre)\b/.test(lower)) {
    return "Land & Agriculture";
  }

  // Commercial
  if (/\b(commercial|office space|retail|mall|cowork|warehouse|logistics|sez|it park|industrial|factory|manufactur|data cent|grade.?a)\b/.test(lower)) {
    return "Commercial";
  }

  // Residential (broad real estate / housing)
  if (/\b(hous|home|flat|apartment|residential|villa|plot|township|dda|bhk|affordable|luxury|realty|real estate|property|builder|developer|mortgage|home loan|rent|tenant)\b/.test(lower)) {
    return "Residential";
  }

  return feedCategory;
}

/**
 * Assign risk tags and trend indicators based on headline keywords.
 */
export function assignTags(article: {
  headline: string;
  categories: string[];
}): {
  riskTags: string[];
  trendIndicators: string[];
} {
  const lower = article.headline.toLowerCase();

  const riskTags: string[] = [];
  if (/\b(fraud|scam|illegal|violation|penalty|blacklist|ban|fir|arrest|complaint|dispute|encroach)\b/.test(lower)) {
    riskTags.push("RISK ALERT");
  }
  if (/\b(regulation|compliance|restriction|moratorium|crackdown)\b/.test(lower)) {
    riskTags.push("COMPLIANCE");
  }

  const trendIndicators: string[] = [];
  if (/\b(surge|boom|record|spike|soar|rally|all.?time.?high)\b/.test(lower)) {
    trendIndicators.push("HOT ZONE");
  }
  if (/\b(policy|reform|budget|amendment|bill|ordinance)\b/.test(lower)) {
    trendIndicators.push("High Impact");
  }

  return { riskTags, trendIndicators };
}

/**
 * Generate a deterministic pseudo-random view count (100-9999) from an article's hex ID.
 */
export function generateViewCount(articleId: string): number {
  const hexSlice = articleId.slice(6, 10) || articleId.slice(0, 4);
  const num = parseInt(hexSlice, 16);
  return 100 + (num % 9900);
}
