'use client'

export function NFTCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-300"></div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title and price */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-5 bg-gray-300 rounded w-16"></div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <div className="h-3 bg-gray-200 rounded w-8"></div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>

        {/* Seller info */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Attributes */}
        <div className="flex gap-1 mb-4">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-14"></div>
        </div>

        {/* Button */}
        <div className="h-10 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-pulse">
      <div className="text-center">
        <div className="h-8 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
      </div>
    </div>
  )
}

export function SearchBarSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
}
