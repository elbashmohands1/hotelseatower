'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  room: {
    name: string;
  };
}

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export default function CancelBookingModal({
  isOpen,
  onClose,
  booking,
}: CancelBookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = async () => {
    if (!booking) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
        method: 'PATCH',
      });

      if (!res.ok) {
        throw new Error('Failed to cancel booking');
      }

      window.location.reload();
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <ExclamationTriangleIcon
              className="w-6 h-6 text-red-600"
              aria-hidden="true"
            />
          </div>

          <Dialog.Title className="mt-4 text-lg font-medium text-center text-gray-900">
            Cancel Booking
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-sm text-center text-gray-500">
            Are you sure you want to cancel your booking for{' '}
            {booking?.room.name}? This action cannot be undone.
          </Dialog.Description>

          {error && (
            <p className="mt-2 text-sm text-center text-red-600">{error}</p>
          )}

          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={onClose}
            >
              No, keep it
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Yes, cancel it'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 