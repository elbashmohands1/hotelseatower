'use client';

import { Fragment, useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  show: boolean;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', show, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <Transition
      show={isVisible}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed right-4 top-4 z-50 w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {type === 'success' ? (
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              ) : (
                <XCircleIcon className="h-6 w-6 text-red-400" />
              )}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{message}</p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => {
                  setIsVisible(false);
                  onClose();
                }}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
} 