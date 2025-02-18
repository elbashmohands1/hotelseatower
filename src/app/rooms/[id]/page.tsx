import { prisma } from '@/lib/prisma';
import RoomDetail from '@/components/rooms/RoomDetail';
import BookingForm from '@/components/rooms/BookingForm';
import { notFound } from 'next/navigation';

export default async function RoomPage({ params }: { params: { id: string } }) {
  const room = await prisma.room.findUnique({
    where: {
      id: params.id,
    },
    include: {
      reviews: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  if (!room) {
    notFound();
  }

  // Calculate average rating
  const avgRating = room.reviews.length > 0
    ? room.reviews.reduce((acc, review) => acc + review.rating, 0) / room.reviews.length
    : 0;

  const initialData = {
    ...room,
    avgRating,
    totalReviews: room._count.reviews,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RoomDetail initialData={initialData} />
        </div>
        <div className="lg:col-span-1">
          <BookingForm roomId={room.id} price={room.price} />
        </div>
      </div>
    </div>
  );
} 