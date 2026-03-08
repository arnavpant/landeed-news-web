"use client";

const LANDEED_CATEGORIES = [
  "Universal Feed",
  "Residential",
  "Commercial",
  "Regulation",
  "Land & Agriculture",
] as const;

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * Checks if an article belongs to a given Landeed display category.
 * Article categories are now set per-article via classifyCategory() in metadata.ts,
 * so this is a direct string match.
 */
export function matchesCategory(
  articleCategories: string[],
  landeedCategory: string
): boolean {
  if (landeedCategory === "Universal Feed") return true;
  return articleCategories.some((c) => c === landeedCategory);
}

export default function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 flex gap-8 overflow-x-auto no-scrollbar">
      {LANDEED_CATEGORIES.map((cat) => {
        const isActive = cat === activeCategory;
        return (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
              isActive
                ? "border-primary font-bold text-primary"
                : "border-transparent text-slate-400 hover:text-primary/70 dark:hover:text-primary/70"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
