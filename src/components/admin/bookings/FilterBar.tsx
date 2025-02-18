'use client';

interface FilterBarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  totalCount: number;
}

export default function FilterBar({ currentFilter, onFilterChange, totalCount }: FilterBarProps) {
  return (
    <div className="bg-white px-6 py-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium text-gray-900">
            All Bookings <span className="text-gray-500">({totalCount})</span>
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                currentFilter === 'all'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterChange('confirmed')}
              className={`px-3 py-1 text-sm rounded-full ${
                currentFilter === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => onFilterChange('pending')}
              className={`px-3 py-1 text-sm rounded-full ${
                currentFilter === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => onFilterChange('cancelled')}
              className={`px-3 py-1 text-sm rounded-full ${
                currentFilter === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 