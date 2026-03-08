function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-full bg-slate-100 dark:bg-slate-800 skeleton-shimmer ${className ?? ""}`}
    />
  );
}

function ListCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex gap-4">
      {/* Thumbnail placeholder */}
      <div className="shrink-0 w-[100px] h-[100px] md:w-[120px] md:h-[100px] rounded-lg bg-slate-100 dark:bg-slate-800 skeleton-shimmer" />

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Row 1: Category badge + LND ID */}
        <div className="flex items-center justify-between gap-2">
          <SkeletonBar className="h-4 w-20" />
          <SkeletonBar className="h-3 w-24" />
        </div>

        {/* Row 2: Headline */}
        <SkeletonBar className="h-4 w-3/4 mt-1.5" />

        {/* Row 3: Summary */}
        <SkeletonBar className="h-3 w-full mt-1" />

        {/* Row 4: Metadata bar */}
        <div className="flex items-center gap-3 mt-1.5">
          <SkeletonBar className="h-3 w-16" />
          <SkeletonBar className="h-4 w-16 rounded-full" />
          <SkeletonBar className="h-4 w-14 rounded-full" />
          <SkeletonBar className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}

export default function SkeletonLoader() {
  return (
    <div>
      {/* Category tabs skeleton */}
      <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[64, 80, 96, 72, 88].map((w, i) => (
          <div
            key={i}
            className="h-4 rounded-full bg-slate-100 dark:bg-slate-800 skeleton-shimmer"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Filter bar skeleton */}
      <div className="flex items-center gap-3 py-3">
        {[60, 56, 48, 64].map((w, i) => (
          <div
            key={i}
            className="h-7 rounded-full bg-slate-100 dark:bg-slate-800 skeleton-shimmer"
            style={{ width: `${w}px` }}
          />
        ))}
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 shrink-0" />
        <div
          className="h-7 rounded-full bg-slate-100 dark:bg-slate-800 skeleton-shimmer"
          style={{ width: "90px" }}
        />
      </div>

      {/* List card skeletons */}
      <div className="mt-4 flex flex-col gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
