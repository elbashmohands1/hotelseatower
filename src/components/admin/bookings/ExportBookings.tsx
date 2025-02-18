'use client';

import { useState } from 'react';
import { format, isWithinInterval } from 'date-fns';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import type { AdminBooking } from '@/types/booking';

interface ExportBookingsProps {
  bookings: AdminBooking[];
}

export default function ExportBookings({ bookings }: ExportBookingsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      // Filter bookings by date range
      const filteredBookings = bookings.filter(booking =>
        isWithinInterval(new Date(booking.createdAt), {
          start: dateRange[0].startDate,
          end: dateRange[0].endDate,
        })
      );

      const headers = [
        'Booking ID',
        'Guest Name',
        'Email',
        'Room',
        'Check In',
        'Check Out',
        'Guests',
        'Status',
        'Total Amount',
        'Booking Date',
      ];

      const data = filteredBookings.map(booking => [
        booking.id,
        booking.user.name || 'Guest',
        booking.user.email,
        booking.room.name,
        format(new Date(booking.checkIn), 'yyyy-MM-dd'),
        format(new Date(booking.checkOut), 'yyyy-MM-dd'),
        booking.guests,
        booking.status,
        booking.totalAmount,
        format(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      ]);

      const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `bookings_${format(dateRange[0].startDate, 'yyyy-MM-dd')}_to_${format(
          dateRange[0].endDate,
          'yyyy-MM-dd'
        )}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowDatePicker(false);
    } catch (error) {
      console.error('Error exporting bookings:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDatePicker(!showDatePicker)}
        disabled={isExporting}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
        {isExporting ? 'Exporting...' : 'Export Bookings'}
      </button>

      {showDatePicker && (
        <div className="absolute right-0 mt-2 z-10 bg-white rounded-lg shadow-lg">
          <div className="p-4">
            <DateRange
              ranges={dateRange}
              onChange={item => setDateRange([item.selection])}
              months={1}
              direction="vertical"
              className="border border-gray-200 rounded-md"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowDatePicker(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={exportToCSV}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 