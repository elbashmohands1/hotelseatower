export default function EditRoomLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Loading State */}
        <div className="max-w-2xl bg-white p-6 rounded-lg shadow space-y-6">
          {/* Name field */}
          <div>
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Description field */}
          <div>
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Price field */}
          <div>
            <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Type and Capacity */}
          <div className="grid grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Loading State */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-96 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
} 