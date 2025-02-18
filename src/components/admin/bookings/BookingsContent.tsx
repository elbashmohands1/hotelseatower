'use client';

import BookingTable from './BookingTable';
import BookingCalendar from './BookingCalendar';
import type { AdminBooking } from '@/types/booking';

interface BookingsContentProps {
  bookings: AdminBooking[];
  view: 'table' | 'calendar';
}

export default function BookingsContent({ bookings, view }: BookingsContentProps) {
  return (
    <>
      {view === 'table' ? (
        <BookingTable bookings={bookings} />
      ) : (
        <BookingCalendar bookings={bookings} />
      )}
    </>
  );
} 