'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { 
  CalendarIcon, 
  UserIcon, 
  HomeIcon, 
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Toast from '@/components/ui/Toast';
import type { AdminBooking } from '@/types/booking';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Timeline from './Timeline';

interface BookingDetailsProps {
  booking: AdminBooking;
}

const statusOptions = ['pending', 'confirmed', 'cancelled'] as const;

export default function BookingDetails({ booking }: BookingDetailsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as const });
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    status: string;
  }>({
    isOpen: false,
    status: '',
  });

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === booking.status) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update booking status');

      setToast({
        show: true,
        message: 'Booking status updated successfully',
        type: 'success',
      });
      router.refresh();
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to update booking status',
        type: 'error',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusClick = (newStatus: string) => {
    setConfirmDialog({
      isOpen: true,
      status: newStatus,
    });
  };

  const handleStatusConfirm = async () => {
    const newStatus = confirmDialog.status;
    setConfirmDialog({ isOpen: false, status: '' });
    await handleStatusUpdate(newStatus);
  };

  // Create timeline events
  const timelineEvents = [
    {
      type: 'created' as const,
      timestamp: booking.createdAt,
    },
    // Add status change events if the status has been updated
    ...(booking.createdAt.getTime() !== booking.updatedAt.getTime()
      ? [{
          type: 'status_change' as const,
          status: booking.status,
          timestamp: booking.updatedAt,
        }]
      : []
    ),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <>
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Booking Information</h2>
            <div className="flex items-center space-x-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusClick(status)}
                  disabled={isUpdating || status === booking.status}
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    status === booking.status
                      ? status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Guest Information</h3>
              <div className="mt-2 flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.user.name || 'Guest'}
                  </p>
                  <p className="text-sm text-gray-500">{booking.user.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Room Details</h3>
              <div className="mt-2 flex items-center space-x-3">
                <HomeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.room.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${booking.room.price} per night
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Stay Duration</h3>
              <div className="mt-2 flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">
                    {format(new Date(booking.checkIn), 'MMM d, yyyy')} -{' '}
                    {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Payment Details</h3>
              <div className="mt-2 flex items-center space-x-3">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    ${booking.totalAmount}
                  </p>
                  <p className="text-sm text-gray-500">Total amount</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Booking Timeline</h3>
              <div className="mt-2 flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">
                    Created: {format(new Date(booking.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last updated: {format(new Date(booking.updatedAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Booking Timeline</h2>
        </div>
        <div className="p-6">
          <Timeline booking={booking} />
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, status: '' })}
        onConfirm={handleStatusConfirm}
        title="Update Booking Status"
        message={`Are you sure you want to mark this booking as ${confirmDialog.status}? This will send an email notification to the guest.`}
        confirmText="Update Status"
        isLoading={isUpdating}
        type={
          confirmDialog.status === 'confirmed'
            ? 'info'
            : confirmDialog.status === 'cancelled'
            ? 'danger'
            : 'warning'
        }
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </>
  );
} 