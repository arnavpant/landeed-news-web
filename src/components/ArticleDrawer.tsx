"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Article } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { useBookmarks } from "@/contexts/BookmarkContext";

interface ArticleDrawerProps {
  article: Article;
  onClose: () => void;
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

export default function ArticleDrawer({ article, onClose }: ArticleDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiImpacts, setAiImpacts] = useState<{ label: string; direction: "up" | "down" | "neutral" }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fetchedRef = useRef<string | null>(null);
  const category = article.categories[0] ?? "News";
  const faviconUrl = getSourceFavicon(article.sourceUrl);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fetchedRef.current === article.id) return;
    fetchedRef.current = article.id;
    setAiSummary(null);
    setAiImpacts([]);
    setAiError(null);
    setAiLoading(true);

    fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        headline: article.headline,
        summary: article.summary,
        category,
        sourceName: article.sourceName,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 503 ? "API key not configured" : "Failed");
        return res.json();
      })
      .then((data) => {
        setAiSummary(data.summary);
        if (Array.isArray(data.impacts)) setAiImpacts(data.impacts);
      })
      .catch((err) => setAiError(err.message))
      .finally(() => setAiLoading(false));
  }, [article.id, article.headline, article.summary, article.sourceName, category]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  const handleOverlayClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleDrawerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleBookmark = () => {
    toggleBookmark({
      ...article,
      publishedAt: article.publishedAt.toISOString(),
      locations: article.locations ?? [],
      savedAt: new Date().toISOString(),
    });
  };

  const handleWhatsApp = () => {
    const text = `${article.headline}\n\nRead more: ${article.sourceUrl}\n\n— via Landeed News`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.sourceUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleOverlayClick}
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 h-full z-50 w-full max-w-lg xl:max-w-xl bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={handleDrawerClick}
      >
        <div className="h-full overflow-y-auto no-scrollbar">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                {category}
              </span>
              {/* Location tags */}
              {(article.locations ?? []).map((loc) => (
                <span
                  key={loc}
                  className="flex items-center gap-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full"
                >
                  <span className="material-symbols-outlined text-[12px]">location_on</span>
                  {loc}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleBookmark}
                className="size-9 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
                title={bookmarked ? "Remove bookmark" : "Save article"}
              >
                <span
                  className={`material-symbols-outlined text-lg ${bookmarked ? "text-primary" : "text-slate-400"}`}
                  style={bookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  bookmark
                </span>
              </button>
              <button
                onClick={handleClose}
                className="size-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close drawer"
              >
                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">
                  close
                </span>
              </button>
            </div>
          </div>

          {/* Image section */}
          <div className="px-6 pt-6">
            {article.imageUrl ? (
              <div className="rounded-xl overflow-hidden aspect-video">
                <img
                  src={article.imageUrl}
                  alt={article.headline}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div
                className={`rounded-xl aspect-video bg-gradient-to-br ${getCategoryGradient(category)} flex items-center justify-center`}
              >
                <span className="material-symbols-outlined opacity-30 text-7xl">
                  {getCategoryIcon(category)}
                </span>
              </div>
            )}
          </div>

          {/* Content area */}
          <div className="p-6 space-y-6">
            {/* Headline */}
            <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">
              {article.headline}
            </h2>

            {/* Metadata row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-slate-400">
                {formatDistanceToNow(article.publishedAt, { addSuffix: true })}
              </span>
              {article.author && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {article.author}
                  </span>
                </>
              )}
              <span className="text-slate-300 dark:text-slate-600">&bull;</span>
              <div className="flex items-center gap-2">
                {faviconUrl ? (
                  <img src={faviconUrl} alt="" className="size-5 rounded-full" />
                ) : (
                  <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-primary">
                      {article.sourceName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {article.sourceName}
                </span>
              </div>
            </div>

            {/* Full summary */}
            {article.summary && (
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {article.summary}
              </p>
            )}

            {/* Landeed AI Summary */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">
                  auto_awesome
                </span>
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Landeed AI Analysis
                </span>
              </div>

              {aiLoading && (
                <div className="flex items-center gap-3 py-2">
                  <div className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-sm text-slate-500">Analyzing article...</span>
                </div>
              )}

              {aiError && (
                <p className="text-sm text-slate-400 italic">
                  {aiError === "API key not configured"
                    ? "Add GEMINI_API_KEY to .env to enable Landeed AI"
                    : "Could not generate analysis. Try again later."}
                </p>
              )}

              {aiSummary && (
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {aiSummary}
                </div>
              )}

              {/* Impact Indicators */}
              {aiImpacts.length > 0 && (
                <div className="pt-3 border-t border-primary/10 space-y-2">
                  <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                    Market Impact
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {aiImpacts.map((impact) => (
                      <div
                        key={impact.label}
                        className="flex items-center gap-2 rounded-lg bg-white/60 dark:bg-slate-800/60 px-3 py-2"
                      >
                        <span
                          className={`material-symbols-outlined text-base ${
                            impact.direction === "up"
                              ? "text-green-500"
                              : impact.direction === "down"
                                ? "text-red-500"
                                : "text-slate-400"
                          }`}
                        >
                          {impact.direction === "up"
                            ? "arrow_upward"
                            : impact.direction === "down"
                              ? "arrow_downward"
                              : "arrow_forward"}
                        </span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                          {impact.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Share + Action buttons */}
            <div className="flex gap-3">
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Read Full Article
                <span className="material-symbols-outlined text-xl">open_in_new</span>
              </a>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">share</span>
                WhatsApp
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  {copied ? "check" : "link"}
                </span>
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* Bottom padding */}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
}
