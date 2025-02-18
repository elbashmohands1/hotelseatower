import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditRoomForm from '@/components/admin/rooms/EditRoomForm';
import RoomCalendar from '@/components/admin/rooms/RoomCalendar';

interface EditRoomPageProps {
  params: {
    id: string;
  };
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const room = await prisma.room.findUnique({
    where: { id: params.id },
  });

  if (!room) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Room</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EditRoomForm room={room} />
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Room Availability
            </h2>
            <RoomCalendar roomId={room.id} />
          </div>
        </div>
      </div>
    </div>
  );
} 