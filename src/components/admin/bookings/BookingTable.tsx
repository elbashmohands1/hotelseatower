'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import type { AdminBooking } from '@/types/booking';
import FilterBar from './FilterBar';
import SortableHeader from './SortableHeader';
import Pagination from './Pagination';
import TableSkeleton from './TableSkeleton';
import EmptyState from './EmptyState';

interface BookingTableProps {
  bookings: AdminBooking[];
  isLoading?: boolean;
}

type SortField = 'checkIn' | 'checkOut' | 'status' | 'totalAmount';

const ITEMS_PER_PAGE = 10;

export default function BookingTable({ bookings, isLoading = false }: BookingTableProps) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState<{ field: SortField; direction: 'asc' | 'desc' }>({
    field: 'checkIn',
    direction: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  // Filter bookings
  const filteredBookings = bookings.filter(booking => 
    filter === 'all' ? true : booking.status === filter
  );

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const direction = sort.direction === 'asc' ? 1 : -1;
    
    switch (sort.field) {
      case 'checkIn':
        return direction * (new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
      case 'checkOut':
        return direction * (new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime());
      case 'status':
        return direction * a.status.localeCompare(b.status);
      case 'totalAmount':
        return direction * (a.totalAmount - b.totalAmount);
      default:
        return 0;
    }
  });

  // Paginate bookings
  const totalPages = Math.ceil(sortedBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (filteredBookings.length === 0) {
    return (
      <EmptyState 
        filter={filter} 
        onReset={() => setFilter('all')} 
      />
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        counts={{
          all: bookings.length,
          pending: bookings.filter(b => b.status === 'pending').length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          cancelled: bookings.filter(b => b.status === 'cancelled').length,
        }}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <SortableHeader
                label="Check In"
                field="checkIn"
                sort={sort}
                onSort={setSort}
              />
              <SortableHeader
                label="Check Out"
                field="checkOut"
                sort={sort}
                onSort={setSort}
              />
              <SortableHeader
                label="Status"
                field="status"
                sort={sort}
                onSort={setSort}
              />
              <SortableHeader
                label="Total"
                field="totalAmount"
                sort={sort}
                onSort={setSort}
              />
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {booking.user.name || 'Guest'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {booking.user.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {booking.room.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ${booking.room.price} per night
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {format(new Date(booking.checkIn), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  ${Number(booking.totalAmount).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
} 