'use client'

export function NFTCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}






