'use client';

import { useState } from 'react';
import type { AdminBooking } from '@/types/booking';
import BookingTable from './BookingTable';
import BookingStats from './BookingStats';

interface BookingsContainerProps {
  bookings: AdminBooking[];
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
}

export default function BookingsContainer({ bookings, stats }: BookingsContainerProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <BookingStats stats={stats} />
      <BookingTable bookings={bookings} isLoading={isLoading} />
    </div>
  );
} 