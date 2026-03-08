import { Article } from "@/lib/types";

interface MarketPulseProps {
  articles: Article[];
}

function computePulse(articles: Article[]) {
  const now = Date.now();
  const last24h = articles.filter(
    (a) => now - new Date(a.publishedAt).getTime() <= 24 * 60 * 60 * 1000
  );

  const riskCount = articles.filter((a) => a.riskTags.length > 0).length;
  const hotZoneCount = articles.filter((a) =>
    a.trendIndicators.includes("HOT ZONE")
  ).length;
  const policyCount = articles.filter((a) =>
    a.trendIndicators.includes("High Impact")
  ).length;

  // Simple sentiment: count positive vs negative keywords in headlines
  const positiveWords = /\b(surge|boom|record|growth|rise|soar|rally|gain|profit|demand|buy|invest|launch|expand|approve)\b/i;
  const negativeWords = /\b(crash|fall|drop|decline|slump|fraud|scam|ban|penalty|risk|crisis|stall|delay|dispute|illegal)\b/i;

  let positive = 0;
  let negative = 0;
  for (const a of last24h) {
    if (positiveWords.test(a.headline)) positive++;
    if (negativeWords.test(a.headline)) negative++;
  }

  let sentiment: "Bullish" | "Bearish" | "Neutral";
  if (positive > negative + 2) sentiment = "Bullish";
  else if (negative > positive + 2) sentiment = "Bearish";
  else sentiment = "Neutral";

  // Category distribution
  const catCounts: Record<string, number> = {};
  for (const a of articles) {
    const cat = a.categories[0] ?? "Other";
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  }
  const topCategory = Object.entries(catCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return {
    total: articles.length,
    last24h: last24h.length,
    riskCount,
    hotZoneCount,
    policyCount,
    sentiment,
    topCategory: topCategory ? { name: topCategory[0], count: topCategory[1] } : null,
  };
}

const sentimentConfig = {
  Bullish: { icon: "trending_up", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
  Bearish: { icon: "trending_down", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  Neutral: { icon: "trending_flat", color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-800" },
};

export default function MarketPulse({ articles }: MarketPulseProps) {
  const pulse = computePulse(articles);
  const sc = sentimentConfig[pulse.sentiment];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-xl">
          monitoring
        </span>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Market Pulse
        </h3>
        <span className="ml-auto text-[10px] text-slate-400 uppercase tracking-wide font-medium">
          Live
        </span>
        <span className="size-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* Sentiment */}
      <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${sc.bg}`}>
        <span className={`material-symbols-outlined text-2xl ${sc.color}`}>
          {sc.icon}
        </span>
        <div>
          <p className={`text-sm font-bold ${sc.color}`}>{pulse.sentiment}</p>
          <p className="text-[11px] text-slate-400">Market Sentiment</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5">
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {pulse.last24h}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            Articles Today
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5">
          <p className="text-lg font-bold text-primary">{pulse.total}</p>
          <p className="text-[10px] text-slate-400 font-medium">Total</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5">
          <p className="text-lg font-bold text-orange-500">{pulse.hotZoneCount}</p>
          <p className="text-[10px] text-slate-400 font-medium">Hot Zones</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5">
          <p className="text-lg font-bold text-red-500">{pulse.riskCount}</p>
          <p className="text-[10px] text-slate-400 font-medium">Risk Alerts</p>
        </div>
      </div>

      {/* Top category */}
      {pulse.topCategory && (
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-400">Trending Sector</span>
          <span className="font-semibold text-primary">
            {pulse.topCategory.name} ({pulse.topCategory.count})
          </span>
        </div>
      )}

      {/* Policy count */}
      {pulse.policyCount > 0 && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Policy Changes</span>
          <span className="font-semibold text-primary">
            {pulse.policyCount} this cycle
          </span>
        </div>
      )}
    </div>
  );
}
