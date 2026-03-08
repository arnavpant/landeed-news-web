"use client";

import { Article } from "@/lib/types";
import { format } from "date-fns";

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

function getCategoryGradient(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("residential"))
    return "from-purple-500/20 to-indigo-500/20";
  if (lower.includes("commercial"))
    return "from-blue-500/20 to-indigo-500/20";
  if (lower.includes("regulat"))
    return "from-fuchsia-500/20 to-purple-500/20";
  if (lower.includes("agri") || lower.includes("land"))
    return "from-green-500/20 to-emerald-500/20";
  return "from-primary/20 to-primary/5";
}

function getCategoryIcon(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("residential")) return "apartment";
  if (lower.includes("regulat")) return "gavel";
  if (lower.includes("commercial")) return "storefront";
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

export default function ArticleCard({ article, onClick }: ArticleCardProps) {
  const category = article.categories[0] ?? "News";
  const faviconUrl = getSourceFavicon(article.sourceUrl);

  return (
    <div
      className="group bg-white dark:bg-slate-900 rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 p-4 transition-all hover:border-primary/20 hover:shadow-lg shadow-slate-200/20 cursor-pointer"
      onClick={() => onClick(article)}
    >
      {/* Image area */}
      <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.headline}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${getCategoryGradient(category)} flex items-center justify-center`}
          >
            <span className="material-symbols-outlined opacity-30 text-6xl">
              {getCategoryIcon(category)}
            </span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="px-2 pb-2 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
            {category}
          </span>
          <span className="text-slate-300">&bull;</span>
          <span className="text-xs text-slate-400">
            {format(article.publishedAt, "MMM d, yyyy")}
          </span>
          {article.author && (
            <>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                {article.author}
              </span>
            </>
          )}
        </div>

        <h4 className="text-xl font-bold text-slate-800 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {article.headline}
        </h4>

        {article.summary && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 font-light leading-relaxed">
            {article.summary}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          {faviconUrl ? (
            <img
              src={faviconUrl}
              alt=""
              className="size-6 rounded-full"
            />
          ) : (
            <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {article.sourceName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-xs font-medium text-slate-700 dark:text-slate-400">
            {article.sourceName}
          </span>
        </div>
      </div>
    </div>
  );
}
