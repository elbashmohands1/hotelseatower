'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { StarIcon, WifiIcon, TvIcon, HomeModernIcon } from '@heroicons/react/24/solid';
import ReviewList from '@/components/reviews/ReviewList';
import RoomCalendar from './RoomCalendar';

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

interface RoomDetailProps {
  initialData: Room;
}

// This would eventually come from your API/database
// const roomData = {
//   id: 1,
//   name: 'Deluxe Ocean View',
//   description: 'Spacious room with stunning ocean views and modern amenities.',
//   longDescription: `Experience luxury living in our Deluxe Ocean View room. Wake up to breathtaking views of the ocean and enjoy modern amenities designed for your comfort. This spacious room features a king-size bed, private balcony, and elegant furnishings.

// The en-suite bathroom includes a rain shower and premium toiletries. Stay connected with high-speed Wi-Fi and enjoy entertainment on the 55-inch smart TV.`,
//   price: 299,
//   images: [
//     'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
//     'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
//     'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
//   ],
//   amenities: [
//     { name: 'Ocean View', icon: HomeModernIcon },
//     { name: 'King Bed', icon: HomeModernIcon },
//     { name: 'Wi-Fi', icon: WifiIcon },
//     { name: 'Smart TV', icon: TvIcon },
//     { name: 'Mini Bar', icon: HomeModernIcon },
//     { name: 'Room Service', icon: HomeModernIcon }
//   ],
//   rating: 4.8,
//   reviews: 124
// };

export default function RoomDetail({ initialData }: RoomDetailProps) {
  const [room, setRoom] = useState<Room>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoom();
  }, [initialData.id]);

  const fetchRoom = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/rooms/${initialData.id}`);
      if (!res.ok) throw new Error('Failed to fetch room details');
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setRoom(data);
    } catch (error) {
      console.error('Error fetching room:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch room details');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Gallery */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="col-span-2 relative h-[400px]">
          <Image
            src={room.images[0]}
            alt={room.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        {room.images.slice(1).map((image, index) => (
          <div key={index} className="relative h-[200px]">
            <Image
              src={image}
              alt={`${room.name} view ${index + 2}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Room Details */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(room.avgRating)
                      ? 'text-yellow-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-gray-600">
              {room.avgRating.toFixed(1)}
            </span>
            <span className="text-gray-500">
              ({room.totalReviews} {room.totalReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-6 whitespace-pre-line">
          {room.description}
        </p>

        {/* Amenities */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {room.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <span className="text-gray-600 capitalize">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Policies */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Policies</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Check-in: 3:00 PM - 11:00 PM</li>
            <li>Check-out: 11:00 AM</li>
            <li>No smoking</li>
            <li>No pets allowed</li>
          </ul>
        </div>

        {/* Availability Calendar */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Availability Calendar
          </h2>
          <RoomCalendar roomId={room.id} />
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Reviews ({room.totalReviews})
          </h2>
          <ReviewList roomId={room.id} />
        </div>
      </div>
    </div>
  );
} 