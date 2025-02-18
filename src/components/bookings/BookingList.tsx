'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import CancelBookingModal from './CancelBookingModal';

interface Booking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  totalAmount: number;
  room: {
    id: string;
    name: string;
    images: string[];
  };
}

interface BookingListProps {
  bookings: Booking[];
}

export default function BookingList({ bookings }: BookingListProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  if (!bookings.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No bookings found
        </h3>
        <p className="text-gray-600 mb-6">
          You haven't made any bookings yet.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Browse Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {booking.room.name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative h-48 md:h-32 md:w-48 rounded-lg overflow-hidden">
                <Image
                  src={booking.room.images[0]}
                  alt={booking.room.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>
                    {format(new Date(booking.checkIn), 'MMM dd, yyyy')} -{' '}
                    {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>Total Amount: ${booking.totalAmount}</span>
                </div>

                <div className="flex gap-4">
                  <Link
                    href={`/rooms/${booking.room.id}`}
                    className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
                  >
                    View Room
                  </Link>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      className="text-red-600 hover:text-red-700 transition duration-300"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <CancelBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
} 