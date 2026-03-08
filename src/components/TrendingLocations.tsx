"use client";

import { Article } from "@/lib/types";

interface TrendingLocationsProps {
  articles: Article[];
  onCityClick?: (city: string) => void;
}

// Major Indian cities and real estate hubs
const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Gurugram", "Gurgaon", "Noida", "Ahmedabad",
  "Jaipur", "Lucknow", "Thane", "Navi Mumbai", "Goa", "Kochi",
  "Chandigarh", "Indore", "Nagpur", "Coimbatore", "Vizag",
  "Visakhapatnam", "Thiruvananthapuram", "Mysuru", "Mysore",
  "Bhubaneswar", "Patna", "Surat", "Vadodara", "Faridabad",
  "Ghaziabad", "Greater Noida", "Dwarka", "Mohali", "Zirakpur",
  "Dubai", "UAE",
];

// Normalize aliases
function normalizeCity(city: string): string {
  const aliases: Record<string, string> = {
    "Bangalore": "Bengaluru",
    "Gurgaon": "Gurugram",
    "Mysore": "Mysuru",
    "Vizag": "Visakhapatnam",
  };
  return aliases[city] || city;
}

function extractCities(articles: Article[]): { city: string; count: number }[] {
  const counts: Record<string, number> = {};

  for (const article of articles) {
    const text = `${article.headline} ${article.summary}`;
    const seen = new Set<string>();

    for (const city of INDIAN_CITIES) {
      // Case-insensitive word boundary match
      const regex = new RegExp(`\\b${city}\\b`, "i");
      if (regex.test(text)) {
        const normalized = normalizeCity(city);
        if (!seen.has(normalized)) {
          seen.add(normalized);
          counts[normalized] = (counts[normalized] || 0) + 1;
        }
      }
    }
  }

  return Object.entries(counts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export default function TrendingLocations({ articles, onCityClick }: TrendingLocationsProps) {
  const cities = extractCities(articles);

  if (cities.length === 0) return null;

  const maxCount = cities[0]?.count || 1;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-xl">
          location_on
        </span>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Trending Locations
        </h3>
      </div>

      {/* City list */}
      <div className="space-y-2.5">
        {cities.map((item, i) => (
          <button
            key={item.city}
            onClick={() => onCityClick?.(item.city)}
            className="w-full group"
          >
            <div className="flex items-center gap-3">
              {/* Rank */}
              <span className={`text-xs font-bold w-5 text-right ${
                i === 0 ? "text-primary" : "text-slate-400"
              }`}>
                {i + 1}
              </span>

              {/* Bar + label */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                    {item.city}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.count} {item.count === 1 ? "article" : "articles"}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      i === 0
                        ? "bg-primary"
                        : i < 3
                          ? "bg-primary/60"
                          : "bg-primary/30"
                    }`}
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
