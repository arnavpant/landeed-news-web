import { Suspense } from "react";
import { fetchAllFeeds } from "@/lib/feeds";
import ArticleGrid from "@/components/ArticleGrid";
import MarketPulse from "@/components/MarketPulse";
import TrendingLocations from "@/components/TrendingLocations";
import SkeletonLoader from "@/components/SkeletonLoader";

export const revalidate = 900; // ISR: revalidate every 15 minutes

async function ArticleFeed() {
  const articles = await fetchAllFeeds();

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center">
        <div className="size-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">
            cloud_off
          </span>
        </div>
        <h3 className="text-lg font-bold text-black dark:text-white mb-2">
          No articles available
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed mb-6">
          News feeds may be temporarily unreachable. This usually resolves within a few minutes.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Try Again
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
      {/* Main feed */}
      <div className="min-w-0">
        <ArticleGrid articles={articles} />
      </div>

      {/* Right sidebar widgets */}
      <div className="hidden xl:flex flex-col gap-6">
        <MarketPulse articles={articles} />
        <TrendingLocations articles={articles} />
      </div>
    </div>
  );
}

function PoweredByLandeed() {
  return (
    <div className="mt-16 mb-4 border-t border-slate-200 dark:border-slate-800 pt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.prod.website-files.com/64897dbf5ae300633717ee2e/673834bb4da80eda38325c94_landeed%20logo.svg"
            alt="Landeed"
            className="h-6"
          />
          <span className="text-xs text-slate-400">
            India&apos;s digital property intelligence platform
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.landeed.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            landeed.com
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.landeed"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Get the App
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Suspense fallback={<SkeletonLoader />}>
        <ArticleFeed />
      </Suspense>
      <PoweredByLandeed />
    </div>
  );
}
