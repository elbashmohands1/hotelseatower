import type { Room as PrismaRoom } from '@prisma/client';

export interface AdminRoom extends PrismaRoom {
  _count: {
    bookings: number;
    reviews: number;
  };
} 