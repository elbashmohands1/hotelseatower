import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { checkRoomAvailability, calculateTotalPrice } from '@/lib/roomUtils';
import { sendBookingConfirmation } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { roomId, checkIn, checkOut, guests } = await req.json();

    // Validate input
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json(
        { message: 'Invalid dates provided' },
        { status: 400 }
      );
    }

    // Check room availability
    const isAvailable = await checkRoomAvailability(roomId, checkInDate, checkOutDate);

    if (!isAvailable) {
      return NextResponse.json(
        { message: 'Room is not available for the selected dates' },
        { status: 400 }
      );
    }

    // Get room details for price calculation
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json(
        { message: 'Room not found' },
        { status: 404 }
      );
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice(room.price, checkInDate, checkOutDate);

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        status: 'confirmed',
      },
      include: {
        user: true,
        room: true,
      },
    });

    // Send confirmation email
    await sendBookingConfirmation({
      userEmail: booking.user.email!,
      userName: booking.user.name || 'Valued Guest',
      roomName: booking.room.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      totalPrice: totalPrice,
    });

    return NextResponse.json(
      { 
        message: 'Booking created successfully',
        booking,
        totalPrice 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            images: true,
            price: true,
          },
        },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 