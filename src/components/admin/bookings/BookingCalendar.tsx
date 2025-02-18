'use client';

import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import type { AdminBooking } from '@/types/booking';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

interface BookingCalendarProps {
  bookings: AdminBooking[];
}

export default function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  const events = bookings.map(booking => ({
    id: booking.id,
    title: `${booking.user.name || 'Guest'} - ${booking.room.name}`,
    start: new Date(booking.checkIn),
    end: new Date(booking.checkOut),
    resource: booking,
  }));

  const eventStyleGetter = (event: any) => {
    const style = {
      backgroundColor: 
        event.resource.status === 'confirmed' ? '#22c55e' :
        event.resource.status === 'pending' ? '#eab308' :
        '#ef4444',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block',
    };
    return { style };
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => setSelectedBooking(event.resource)}
          views={['month', 'week', 'day']}
          tooltipAccessor={(event) => `
            Guest: ${event.resource.user.name || event.resource.user.email}
            Room: ${event.resource.room.name}
            Status: ${event.resource.status}
            Amount: $${event.resource.totalAmount}
          `}
        />
      </div>

      {selectedBooking && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="font-medium text-lg mb-2">Booking Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Guest</p>
              <p className="font-medium">{selectedBooking.user.name || selectedBooking.user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Room</p>
              <p className="font-medium">{selectedBooking.room.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-medium capitalize">{selectedBooking.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Amount</p>
              <p className="font-medium">${selectedBooking.totalAmount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 