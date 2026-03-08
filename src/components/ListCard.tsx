"use client";

import { Article } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { useState } from "react";

interface ListCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

function getCategoryGradient(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("residential")) return "from-purple-500/20 to-indigo-500/20";
  if (lower.includes("commercial")) return "from-blue-500/20 to-indigo-500/20";
  if (lower.includes("regulat")) return "from-fuchsia-500/20 to-purple-500/20";
  if (lower.includes("agri") || lower.includes("land")) return "from-green-500/20 to-emerald-500/20";
  return "from-primary/20 to-primary/5";
}

function getCategoryIcon(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("residential")) return "apartment";
  if (lower.includes("commercial")) return "storefront";
  if (lower.includes("regulat")) return "gavel";
  if (lower.includes("agri") || lower.includes("land")) return "grass";
  return "article";
}

function getSourceFavicon(sourceUrl: string): string | null {
  try {
    const hostname = new URL(sourceUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return null;
  }
}

export default function ListCard({ article, onClick }: ListCardProps) {
  const category = article.categories[0] ?? "News";
  const timeAgo = formatDistanceToNow(article.publishedAt, { addSuffix: false });
  const faviconUrl = getSourceFavicon(article.sourceUrl);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [copied, setCopied] = useState(false);
  const bookmarked = isBookmarked(article.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark({
      ...article,
      publishedAt: article.publishedAt.toISOString(),
      savedAt: new Date().toISOString(),
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${article.headline} — ${article.sourceUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(article.sourceUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 p-4 transition-all hover:border-primary/30 hover:shadow-md cursor-pointer flex gap-4"
      onClick={() => onClick(article)}
    >
      {/* Thumbnail */}
      <div className="shrink-0 w-[100px] h-[100px] md:w-[120px] md:h-[100px] rounded-lg overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.headline}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${getCategoryGradient(category)} flex items-center justify-center`}
          >
            <span className="material-symbols-outlined opacity-40 text-3xl">
              {getCategoryIcon(category)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Row 1: Category badge + actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-primary/10 text-primary">
              {category}
            </span>
            {/* Location tags */}
            {article.locations.slice(0, 2).map((loc) => (
              <span
                key={loc}
                className="hidden sm:flex items-center gap-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"
              >
                <span className="material-symbols-outlined text-[12px]">location_on</span>
                {loc}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleShare}
              className="size-7 flex items-center justify-center rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors opacity-0 group-hover:opacity-100"
              title="Share on WhatsApp"
            >
              <span className="material-symbols-outlined text-[16px] text-green-600">share</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="size-7 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
              title={copied ? "Copied!" : "Copy link"}
            >
              <span className="material-symbols-outlined text-[16px] text-slate-400">
                {copied ? "check" : "link"}
              </span>
            </button>
            <button
              onClick={handleBookmark}
              className="size-7 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
              title={bookmarked ? "Remove bookmark" : "Save article"}
            >
              <span
                className={`material-symbols-outlined text-[16px] ${bookmarked ? "text-primary" : "text-slate-400"}`}
                style={bookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                bookmark
              </span>
            </button>
          </div>
        </div>

        {/* Row 2: Headline */}
        <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-snug line-clamp-2 mt-1">
          {article.headline}
        </h4>

        {/* Row 3: Summary */}
        {article.summary && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {article.summary}
          </p>
        )}

        {/* Row 4: Metadata bar */}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-slate-400" title="Published time">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {timeAgo} ago
          </span>

          {/* Risk tags */}
          {article.riskTags.map((tag) => (
            <span key={tag} className="flex items-center gap-0.5 text-[11px] font-semibold text-red-500">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              {tag}
            </span>
          ))}

          {/* Trend indicators */}
          {article.trendIndicators.map((indicator) => (
            <span
              key={indicator}
              className={`flex items-center gap-0.5 text-[11px] font-semibold ${
                indicator === "HOT ZONE" ? "text-orange-500" : "text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {indicator === "HOT ZONE" ? "local_fire_department" : "trending_up"}
              </span>
              {indicator}
            </span>
          ))}

          {/* Author + Source logo */}
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 ml-auto">
            {faviconUrl && (
              <img src={faviconUrl} alt="" className="size-4 rounded-full" />
            )}
            <span className="truncate max-w-[120px]">
              {article.author || article.sourceName}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
