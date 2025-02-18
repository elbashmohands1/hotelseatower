import type { Booking, BookingHistory, User, Room } from '@prisma/client';

export interface BookingHistory {
  id: string;
  bookingId: string;
  status: string;
  createdAt: Date;
}

export interface AdminBooking extends Omit<Booking, 'user' | 'room'> {
  user: {
    name: string | null;
    email: string;
  };
  room: {
    name: string;
    price: number;
  };
  history: BookingHistory[];
} 