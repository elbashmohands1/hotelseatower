'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface RoomCalendarProps {
  roomId: string;
}

export default function RoomCalendar({ roomId }: RoomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const res = await fetch(
          `/api/admin/rooms/${roomId}/bookings?start=${start.toISOString()}&end=${end.toISOString()}`
        );
        
        if (!res.ok) throw new Error('Failed to fetch bookings');
        
        const data = await res.json();
        setBookings(data.map((booking: any) => ({
          ...booking,
          checkIn: new Date(booking.checkIn),
          checkOut: new Date(booking.checkOut),
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [roomId, currentDate]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getBookingsForDay = (date: Date) => {
    return bookings.filter(booking => 
      (date >= booking.checkIn && date <= booking.checkOut)
    );
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayBookings = getBookingsForDay(day);
          const isBooked = dayBookings.length > 0;
          
          return (
            <div
              key={day.toISOString()}
              className={`bg-white p-2 h-24 overflow-hidden ${
                isBooked ? 'bg-blue-50' : ''
              }`}
            >
              <div className="font-medium text-sm text-gray-900">
                {format(day, 'd')}
              </div>
              {dayBookings.map(booking => (
                <div
                  key={booking.id}
                  className={`text-xs p-1 mt-1 rounded ${
                    isSameDay(day, booking.checkIn)
                      ? 'bg-green-100 text-green-800'
                      : isSameDay(day, booking.checkOut)
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {booking.user.name || booking.user.email}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
} 