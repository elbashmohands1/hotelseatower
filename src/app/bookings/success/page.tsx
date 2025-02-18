'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  useEffect(() => {
    if (!success) {
      router.push('/');
    }
  }, [success, router]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Booking Confirmed!
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Thank you for your booking. We've sent you an email with all the details.
        </p>
        <div className="mt-8">
          <Link
            href="/bookings"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
} 