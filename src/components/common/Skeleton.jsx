export function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 
        dark:from-gray-800 dark:via-gray-700 dark:to-gray-800
        bg-[length:200%_100%] animate-shimmer rounded-xl ${className}`}
    />
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border 
        border-gray-100 dark:border-gray-800 p-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <Skeleton className="h-28 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}