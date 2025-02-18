'use client';

export default function BookingDetailsSkeleton() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 