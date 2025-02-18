import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BookingDetails from '@/components/admin/bookings/BookingDetails';

interface BookingPageProps {
  params: {
    id: string;
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      room: true,
    },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Booking Details</h1>
      </div>

      <BookingDetails booking={booking} />
    </div>
  );
} 