import { prisma } from './prisma';

export async function checkRoomAvailability(
  roomId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const existingBooking = await prisma.booking.findFirst({
    where: {
      roomId,
      OR: [
        {
          // Check if there's any booking that overlaps with the requested dates
          AND: [
            { checkIn: { lte: checkOut } },
            { checkOut: { gte: checkIn } },
          ],
        },
      ],
      NOT: {
        status: 'cancelled',
      },
    },
  });

  return !existingBooking;
}

export function calculateTotalPrice(
  price: number,
  checkIn: Date,
  checkOut: Date
): number {
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  const roomTotal = price * nights;
  const cleaningFee = 50;
  const serviceFee = 30;

  return roomTotal + cleaningFee + serviceFee;
} 