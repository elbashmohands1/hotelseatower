'use client';

import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface RoomCalendarProps {
  roomId: string;
}

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

const calendarStyles = {
  height: 600,
  eventPropGetter: () => ({
    className: 'bg-blue-600 text-white rounded-md px-2 py-1',
  }),
  dayPropGetter: (date: Date) => ({
    className: 'text-gray-700 hover:bg-gray-50 transition-colors',
  }),
};

export default function RoomCalendar({ roomId }: RoomCalendarProps) {
  const [bookings, setBookings] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [roomId]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/bookings`);
      const data = await res.json();
      
      // Transform bookings into events for the calendar
      const events = data.map((booking: Booking) => ({
        title: 'Booked',
        start: new Date(booking.checkIn),
        end: new Date(booking.checkOut),
        allDay: true,
      }));
      
      setBookings(events);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-sm text-gray-600">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-50 rounded"></div>
          <span className="text-sm text-gray-600">Today</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-50 rounded"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
      </div>
      
      <div className="h-[600px] bg-white rounded-lg shadow-md p-4">
        <Calendar
          localizer={localizer}
          events={bookings}
          startAccessor="start"
          endAccessor="end"
          views={['month']}
          defaultView="month"
          {...calendarStyles}
          tooltipAccessor={(event) => `Booked: ${format(event.start, 'MMM dd')} - ${format(event.end, 'MMM dd')}`}
        />
      </div>
    </div>
  );
} 