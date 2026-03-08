export default function SavedLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-40 rounded-lg bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
          <div className="h-4 w-28 rounded-lg bg-slate-100 dark:bg-slate-800 skeleton-shimmer mt-2" />
        </div>
        <div className="h-8 w-20 rounded-lg bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex gap-4"
          >
            <div className="shrink-0 w-[100px] h-[100px] md:w-[120px] md:h-[100px] rounded-lg bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 w-20 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
                <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
              </div>
              <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer mt-1.5" />
              <div className="flex items-center gap-3 mt-1.5">
                <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
                <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />
                <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800 skeleton-shimmer ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
