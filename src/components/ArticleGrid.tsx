"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Article } from "@/lib/types";
import CategoryTabs, { matchesCategory } from "./CategoryTabs";
import FilterBar from "./FilterBar";
import ListCard from "./ListCard";
import ArticleDrawer from "./ArticleDrawer";

interface ArticleGridProps {
  articles: Article[];
}

const BATCH_SIZE = 20;

function isWithinTimeWindow(publishedAt: Date, window: string): boolean {
  const now = Date.now();
  const published = new Date(publishedAt).getTime();
  const diff = now - published;

  switch (window) {
    case "Last Hour":
      return diff <= 60 * 60 * 1000;
    case "Today":
      return diff <= 24 * 60 * 60 * 1000;
    case "This Week":
      return diff <= 7 * 24 * 60 * 60 * 1000;
    default:
      return true;
  }
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState("Universal Feed");
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [displayCount, setDisplayCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Filtering pipeline
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (activeCategory !== "Universal Feed") {
      result = result.filter((a) =>
        matchesCategory(a.categories, activeCategory)
      );
    }

    if (timeFilter !== "All Time") {
      result = result.filter((a) => isWithinTimeWindow(a.publishedAt, timeFilter));
    }

    if (cityFilter !== "All Cities") {
      result = result.filter((a) =>
        a.locations.some((loc) =>
          loc.toLowerCase().includes(cityFilter.toLowerCase())
        )
      );
    }

    return result;
  }, [articles, activeCategory, timeFilter, cityFilter]);

  const visibleArticles = useMemo(
    () => filteredArticles.slice(0, displayCount),
    [filteredArticles, displayCount]
  );

  const hasMore = displayCount < filteredArticles.length;

  // Reset displayCount when filters change
  useEffect(() => {
    setDisplayCount(BATCH_SIZE);
  }, [activeCategory, timeFilter, cityFilter]);

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    setDisplayCount((prev) => prev + BATCH_SIZE);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCloseDrawer = () => {
    setSelectedArticle(null);
  };

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedArticle]);

  return (
    <div>
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <FilterBar
        timeFilter={timeFilter}
        cityFilter={cityFilter}
        onTimeFilterChange={setTimeFilter}
        onCityFilterChange={setCityFilter}
      />

      <div className="mt-4 flex flex-col gap-4">
        {visibleArticles.map((article) => (
          <ListCard
            key={article.id}
            article={article}
            onClick={handleArticleClick}
          />
        ))}
      </div>

      {/* Empty state for filtered results */}
      {filteredArticles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-slate-700 mb-4">
            search_off
          </span>
          <h3 className="text-base font-bold text-black dark:text-white mb-1">
            No articles found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-5">
            Try changing your category, time range, or city filter to see more results.
          </p>
          <button
            onClick={() => {
              setActiveCategory("Universal Feed");
              setTimeFilter("All Time");
              setCityFilter("All Cities");
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">filter_alt_off</span>
            Clear all filters
          </button>
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="h-10" />
      )}

      {/* End of feed indicator */}
      {!hasMore && visibleArticles.length > 0 && (
        <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
          Showing all {filteredArticles.length} articles
        </div>
      )}

      {selectedArticle && (
        <ArticleDrawer
          article={selectedArticle}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}
