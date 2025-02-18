'use client';

import { TableCellsIcon, CalendarIcon } from '@heroicons/react/24/outline';
import ExportBookings from './ExportBookings';
import type { AdminBooking } from '@/types/booking';

interface BookingsHeaderProps {
  bookings: AdminBooking[];
  view: 'table' | 'calendar';
  onViewChange: (view: 'table' | 'calendar') => void;
}

export default function BookingsHeader({ bookings, view, onViewChange }: BookingsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Bookings</h1>
      <div className="flex items-center space-x-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => onViewChange('table')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              view === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TableCellsIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewChange('calendar')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              view === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
        </div>
        <ExportBookings bookings={bookings} />
      </div>
    </div>
  );
} 