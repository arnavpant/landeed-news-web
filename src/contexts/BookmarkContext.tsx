"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

/** Serializable version of Article for localStorage */
export interface SavedArticle {
  id: string;
  headline: string;
  author: string | null;
  summary: string;
  imageUrl: string | null;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string; // ISO string
  categories: string[];
  landeedId: string;
  riskTags: string[];
  trendIndicators: string[];
  viewCount: number;
  locations: string[];
  savedAt: string; // ISO string
}

interface BookmarkContextType {
  savedArticles: SavedArticle[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (article: SavedArticle) => void;
  clearAll: () => void;
}

const BookmarkContext = createContext<BookmarkContextType>({
  savedArticles: [],
  isBookmarked: () => false,
  toggleBookmark: () => {},
  clearAll: () => {},
});

const STORAGE_KEY = "landeed-saved-articles";

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedArticles(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedArticles));
    } catch {
      // ignore quota errors
    }
  }, [savedArticles, hydrated]);

  const isBookmarked = useCallback(
    (id: string) => savedArticles.some((a) => a.id === id),
    [savedArticles]
  );

  const toggleBookmark = useCallback((article: SavedArticle) => {
    setSavedArticles((prev) => {
      const exists = prev.some((a) => a.id === article.id);
      if (exists) {
        return prev.filter((a) => a.id !== article.id);
      }
      return [{ ...article, savedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const clearAll = useCallback(() => {
    setSavedArticles([]);
  }, []);

  return (
    <BookmarkContext.Provider value={{ savedArticles, isBookmarked, toggleBookmark, clearAll }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarkContext);
}
