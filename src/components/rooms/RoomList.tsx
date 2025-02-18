'use client';
import RoomCard from "./RoomCard";

// Temporary mock data
// const rooms = [
//   {
//     id: 1,
//     name: 'Deluxe Ocean View',
//     description: 'Spacious room with stunning ocean views and modern amenities.',
//     price: 299,
//     image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
//     amenities: ['Ocean View', 'King Bed', 'Wi-Fi', 'Mini Bar'],
//     type: 'deluxe'
//   },
//   {
//     id: 2,
//     name: 'Standard Double Room',
//     description: 'Comfortable room with two double beds, perfect for families.',
//     price: 199,
//     image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
//     amenities: ['City View', 'Double Beds', 'Wi-Fi'],
//     type: 'double'
//   },
//   // Add more rooms as needed
// ];

import { useEffect, useState } from 'react';

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

const RoomList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            <div className="p-6 bg-white rounded-b-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!rooms.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No rooms available at the moment.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );


}



export default RoomList;
