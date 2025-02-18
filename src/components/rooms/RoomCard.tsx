import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/outline';

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  type: string;
  capacity: number;
  amenities: string[];
  avgRating: number;
  totalReviews: number;
}

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {room.name}
        </h3>
        <p className="text-gray-600 mb-4">{room.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-gray-600">
              {room.avgRating.toFixed(1)} ({room.totalReviews})
            </span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            ${room.price}
            <span className="text-sm font-normal text-gray-600">/night</span>
          </div>
        </div>
        <Link
          href={`/rooms/${room.id}`}
          className="mt-4 block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 