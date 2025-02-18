import { format } from 'date-fns';
import Link from 'next/link';

interface Booking {
  id: string;
  createdAt: Date;
  status: string;
  totalAmount: number;
  user: {
    name: string | null;
    email: string;
  };
  room: {
    id: string;
    name: string;
  };
}

interface RecentBookingsProps {
  bookings: Booking[];
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
        <div className="mt-4">
          {bookings.length === 0 ? (
            <p className="text-gray-500">No recent bookings</p>
          ) : (
            <div className="flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <li key={booking.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.user.name || booking.user.email}
                          </p>
                          <Link
                            href={`/admin/rooms/${booking.room.id}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {booking.room.name}
                          </Link>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <p className="mt-1 text-sm text-gray-500">
                          {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          ${booking.totalAmount}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  href="/admin/bookings"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View all bookings
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 