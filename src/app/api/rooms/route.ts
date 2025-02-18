import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
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

    // Calculate average ratings and transform the response
    const transformedRooms = rooms.map(room => {
      const avgRating = room.reviews.length > 0
        ? room.reviews.reduce((acc, review) => acc + review.rating, 0) / room.reviews.length
        : 0;

      return {
        id: room.id,
        name: room.name,
        description: room.description,
        price: room.price,
        images: room.images,
        type: room.type,
        capacity: room.capacity,
        amenities: room.amenities,
        avgRating,
        totalReviews: room._count.reviews,
      };
    });

    return NextResponse.json(transformedRooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
} 