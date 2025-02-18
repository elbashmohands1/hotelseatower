'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { DateRange } from 'react-date-range';
import { format, addDays } from 'date-fns';
import { useClickOutside } from '@/hooks/useClickOutside';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export default function SearchBar() {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [guests, setGuests] = useState('1');
  const router = useRouter();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const datePickerContentRef = useRef<HTMLDivElement>(null);

  useClickOutside(datePickerRef, () => {
    if (isDatePickerOpen) setIsDatePickerOpen(false);
  });

  useEscapeKey(() => {
    if (isDatePickerOpen) setIsDatePickerOpen(false);
  });

  useFocusTrap(datePickerContentRef, isDatePickerOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert dates to ISO strings for URL parameters
    const params = new URLSearchParams({
      checkIn: dateRange[0].startDate.toISOString(),
      checkOut: dateRange[0].endDate.toISOString(),
      guests,
    });
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Range Picker */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dates
            </label>
            <div className="relative" ref={datePickerRef}>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-left"
                aria-expanded={isDatePickerOpen}
                aria-haspopup="true"
              >
                {format(dateRange[0].startDate, 'MMM dd, yyyy')} - {format(dateRange[0].endDate, 'MMM dd, yyyy')}
              </button>
              <div
                ref={datePickerContentRef}
                className={`absolute z-50 mt-2 transition-all duration-200 ease-in-out ${
                  isDatePickerOpen
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
                role="dialog"
                aria-label="Choose dates"
              >
                <DateRange
                  ranges={dateRange}
                  onChange={item => setDateRange([item.selection])}
                  minDate={new Date()}
                  rangeColors={['#2563eb']}
                  months={2}
                  direction="horizontal"
                  className="border border-gray-300 rounded-md shadow-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Number of Guests */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <div className="relative">
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
              <UserGroupIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 h-full mt-6"
          >
            Search Rooms
          </button>
        </form>
      </div>
    </div>
  );
} 