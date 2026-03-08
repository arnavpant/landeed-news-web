export default function AnalyticsLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-7 w-40 rounded-lg bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
        <div className="h-4 w-72 rounded-lg bg-slate-100 dark:bg-slate-800 skeleton-shimmer mt-2" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
          >
            <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer mb-2" />
            <div className="h-7 w-24 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer mb-1" />
            <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
        <div className="h-5 w-64 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer mb-2" />
        <div className="h-3 w-80 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer mb-6" />
        <div className="h-[200px] rounded-xl bg-slate-50 dark:bg-slate-800/50 skeleton-shimmer" />
      </div>

      {/* City chart skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="h-5 w-56 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer mb-2" />
        <div className="h-3 w-72 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer mb-5" />
        <div className="flex flex-wrap gap-2 mb-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-7 rounded-full bg-slate-100 dark:bg-slate-800 skeleton-shimmer"
              style={{ width: `${60 + (i % 3) * 16}px` }}
            />
          ))}
        </div>
        <div className="h-[220px] rounded-xl bg-slate-50 dark:bg-slate-800/50 skeleton-shimmer" />
      </div>
    </div>
  );
}
