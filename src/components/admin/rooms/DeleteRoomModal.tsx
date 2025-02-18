'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Room {
  id: string;
  name: string;
  _count?: {
    bookings: number;
  };
}

interface DeleteRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

export default function DeleteRoomModal({
  isOpen,
  onClose,
  room,
}: DeleteRoomModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDelete = async () => {
    if (!room) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/rooms/${room.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete room');
      }

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete room');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if no room is selected
  if (!room) return null;

  // Check if room has active bookings
  const hasBookings = room._count?.bookings && room._count.bookings > 0;

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
            Delete Room
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-sm text-center text-gray-500">
            Are you sure you want to delete {room.name}? This action cannot be undone.
            {hasBookings && (
              <p className="mt-2 text-red-600 font-medium">
                Warning: This room has active bookings.
              </p>
            )}
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
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          {hasBookings && (
            <p className="mt-4 text-xs text-center text-gray-500">
              Note: Deleting this room will not affect existing bookings.
              They will be marked as archived.
            </p>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 