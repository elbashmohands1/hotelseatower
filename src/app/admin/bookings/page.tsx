import { prisma } from '@/lib/prisma';
import BookingsContainer from '@/components/admin/bookings/BookingsContainer';
import type { AdminBooking } from '@/types/booking';
import type { Prisma } from '@prisma/client';

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      <BookingsContainer bookings={bookings} stats={stats} />
    </div>
  );
}

async function getBookings(): Promise<AdminBooking[]> {
  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      room: {
        select: {
          name: true,
          price: true,
        },
      },
      history: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return bookings as AdminBooking[];
} 