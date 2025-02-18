import RoomList from '@/components/rooms/RoomList';
import RoomFilter from '@/components/rooms/RoomFilter';

export default function RoomsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Rooms</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <RoomFilter />
        </div>
        <div className="lg:col-span-3">
          <RoomList />
        </div>
      </div>
    </div>
  );
} 