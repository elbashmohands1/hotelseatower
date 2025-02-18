'use client';

import { CalendarIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  filter: string;
  onReset: () => void;
}

export default function EmptyState({ filter, onReset }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No bookings found</h3>
      <p className="mt-1 text-sm text-gray-500">
        {filter === 'all'
          ? "There are no bookings in the system yet."
          : `No ${filter} bookings found.`}
      </p>
      {filter !== 'all' && (
        <div className="mt-6">
          <button
            onClick={onReset}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
} 