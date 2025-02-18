'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function BookingError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Booking error:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Error loading booking</h3>
        <p className="mt-1 text-sm text-gray-500">{error.message}</p>
        <div className="mt-6">
          <button
            onClick={reset}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
} 