import { prisma } from '@/lib/prisma';
import RoomTable from '@/components/admin/rooms/RoomTable';
import CreateRoomButton from '@/components/admin/rooms/CreateRoomButton';
import type { AdminRoom } from '@/types/room';

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    include: {
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  }) as AdminRoom[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rooms Management</h1>
        <CreateRoomButton />
      </div>
      <RoomTable rooms={rooms} />
    </div>
  );
} 