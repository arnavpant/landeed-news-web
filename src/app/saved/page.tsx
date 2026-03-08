"use client";

import { useState } from "react";
import { useBookmarks, SavedArticle } from "@/contexts/BookmarkContext";
import { formatDistanceToNow } from "date-fns";
import ArticleDrawer from "@/components/ArticleDrawer";
import { Article } from "@/lib/types";

function toArticle(saved: SavedArticle): Article {
  return {
    ...saved,
    publishedAt: new Date(saved.publishedAt),
  };
}

function getSourceFavicon(sourceUrl: string): string | null {
  try {
    const hostname = new URL(sourceUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return null;
  }
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

export default function SavedPage() {
  const { savedArticles, toggleBookmark, clearAll } = useBookmarks();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (savedArticles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="size-20 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-4xl text-primary/40">
            bookmark
          </span>
        </div>
        <h2 className="text-xl font-bold text-black dark:text-white mb-2">
          No saved articles yet
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs text-sm leading-relaxed">
          Tap the bookmark icon on any article to save it here for later reading.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Browse articles
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Saved Articles
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {savedArticles.length} article{savedArticles.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <button
          onClick={clearAll}
          className="text-xs font-medium text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Saved articles list */}
      <div className="flex flex-col gap-4">
        {savedArticles.map((saved) => {
          const article = toArticle(saved);
          const category = article.categories[0] ?? "News";
          const faviconUrl = getSourceFavicon(article.sourceUrl);

          return (
            <div
              key={saved.id}
              className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 p-4 transition-all hover:border-primary/30 hover:shadow-md cursor-pointer flex gap-4"
              onClick={() => setSelectedArticle(article)}
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
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(saved);
                    }}
                    className="size-8 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Remove from saved"
                  >
                    <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      bookmark
                    </span>
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-snug line-clamp-2 mt-1">
                  {article.headline}
                </h4>

                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {formatDistanceToNow(article.publishedAt, { addSuffix: false })} ago
                  </span>

                  {article.locations.length > 0 && (
                    <span className="flex items-center gap-1 text-[11px] text-primary font-medium">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {article.locations.slice(0, 2).join(", ")}
                    </span>
                  )}

                  <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 ml-auto">
                    {faviconUrl && (
                      <img src={faviconUrl} alt="" className="size-4 rounded-full" />
                    )}
                    <span className="truncate max-w-[120px]">
                      {article.sourceName}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedArticle && (
        <ArticleDrawer
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
