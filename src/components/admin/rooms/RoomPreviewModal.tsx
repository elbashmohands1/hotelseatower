'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface RoomPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    name: string;
    description: string;
    price: string;
    type: string;
    capacity: string;
    amenities: string[];
    images: string[];
  };
}

export default function RoomPreviewModal({
  isOpen,
  onClose,
  room,
}: RoomPreviewModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900"
                  >
                    Room Preview
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Image Gallery */}
                {room.images.length > 0 && (
                  <div className="relative h-64 mb-6">
                    <Image
                      src={room.images[0]}
                      alt={room.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                    {room.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 flex space-x-2">
                        {room.images.slice(1).map((image, index) => (
                          <div
                            key={image}
                            className="w-16 h-16 relative rounded-md overflow-hidden border-2 border-white"
                          >
                            <Image
                              src={image}
                              alt={`${room.name} ${index + 2}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Room Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {room.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
                    </p>
                  </div>

                  <p className="text-gray-600">{room.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-gray-900">
                        ${parseFloat(room.price).toFixed(2)}
                      </span>
                      <span className="text-gray-500">per night</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span>Up to {room.capacity} guests</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Amenities</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {room.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <span>• {amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 