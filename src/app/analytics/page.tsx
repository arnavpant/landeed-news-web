import PriceTrends from "@/components/PriceTrends";

export const metadata = {
  title: "Market Trends",
};

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Market Trends
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Property price indices across India&apos;s major cities
        </p>
      </div>
      <PriceTrends />
    </div>
  );
}
