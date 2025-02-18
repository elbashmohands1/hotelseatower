'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { DateRange } from 'react-date-range';
import { format, addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { loadStripe } from '@stripe/stripe-js';

interface BookingFormProps {
  roomId: string;
  price: number;
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function calculateTotalPrice(price: number, checkIn: Date, checkOut: Date): number {
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  const roomTotal = price * nights;
  const cleaningFee = 50;
  const serviceFee = 30;
  return roomTotal + cleaningFee + serviceFee;
}

interface DateRangeType {
  startDate: Date;
  endDate: Date;
  key: string;
}

// Create a custom hook for click outside that accepts HTMLDivElement
function useClickOutsideDiv(ref: React.RefObject<HTMLDivElement | null>, handler: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}

// Create a custom hook for focus trap that accepts HTMLDivElement
function useFocusTrapDiv(ref: React.RefObject<HTMLDivElement | null>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }

    document.addEventListener('keydown', handleTabKey);
    firstFocusable.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, ref]);
}

export default function BookingForm({ roomId, price }: BookingFormProps) {
  const [dateRange, setDateRange] = useState<DateRangeType[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [guests, setGuests] = useState('1');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  const { data: session } = useSession();
  const router = useRouter();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const datePickerContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dateRange[0].startDate && dateRange[0].endDate) {
      checkAvailability();
      calculateTotal();
    }
    fetchBookedDates();
  }, [dateRange, roomId]);

  // Use the custom hooks
  useClickOutsideDiv(datePickerRef, () => {
    if (isDatePickerOpen) setIsDatePickerOpen(false);
  });

  useEscapeKey(() => {
    if (isDatePickerOpen) setIsDatePickerOpen(false);
  });

  useFocusTrapDiv(datePickerContentRef, isDatePickerOpen);

  const checkAvailability = async () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) return;
    
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/rooms/${roomId}/availability?` + new URLSearchParams({
          checkIn: dateRange[0].startDate.toISOString(),
          checkOut: dateRange[0].endDate.toISOString(),
        })
      );
      
      if (!res.ok) throw new Error('Failed to check availability');
      
      const data = await res.json();
      setIsAvailable(data.available);
    } catch (error) {
      console.error('Error checking availability:', error);
      setError('Failed to check room availability');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    const nights = Math.ceil(
      (dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const roomTotal = price * nights;
    const cleaningFee = 50;
    const serviceFee = 30;
    setTotalPrice(roomTotal + cleaningFee + serviceFee);
  };

  const fetchBookedDates = async () => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/bookings`);
      const bookings = await res.json();
      
      // Create array of all booked dates
      const dates: Date[] = [];
      bookings.forEach((booking: any) => {
        const start = new Date(booking.checkIn);
        const end = new Date(booking.checkOut);
        
        let current = start;
        while (current <= end) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      });
      
      setBookedDates(dates);
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/auth/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const totalPrice = calculateTotalPrice(price, dateRange[0].startDate, dateRange[0].endDate);
      
      const res = await fetch('/api/bookings/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          checkIn: dateRange[0].startDate,
          checkOut: dateRange[0].endDate,
          guests,
          totalPrice,
        }),
      });

      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      
      if (!stripe) throw new Error('Stripe failed to load');

      setError('');
      setIsRedirecting(true);

      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('Failed to process booking. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsRedirecting(false);
    }
  };

  const disabledDates = bookedDates;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        ${price} <span className="text-sm font-normal text-gray-600">/night</span>
      </h2>

      {isLoading && (
        <div className="animate-pulse bg-gray-100 rounded-md p-4 mb-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-4">
        {/* Date Range Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dates
          </label>
          <div className="relative" ref={datePickerRef}>
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-left"
              aria-expanded={isDatePickerOpen}
              aria-haspopup="true"
            >
              {format(dateRange[0].startDate, 'MMM dd, yyyy')} - {format(dateRange[0].endDate, 'MMM dd, yyyy')}
            </button>
            <div
              ref={datePickerContentRef}
              className={`absolute z-50 mt-2 transition-all duration-200 ease-in-out ${
                isDatePickerOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
              role="dialog"
              aria-label="Choose dates"
            >
              <DateRange
                ranges={dateRange}
                onChange={item => {
                  if (item.selection.startDate && item.selection.endDate) {
                    setDateRange([{
                      startDate: item.selection.startDate,
                      endDate: item.selection.endDate,
                      key: 'selection'
                    }]);
                  }
                }}
                minDate={new Date()}
                rangeColors={['#2563eb']}
                months={1}
                direction="vertical"
                className="border border-gray-300 rounded-md shadow-lg bg-white"
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>

        {/* Number of Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <div className="relative">
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
            <UserGroupIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {isAvailable === false && (
          <div className="text-red-600 text-sm">
            Room is not available for selected dates
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isAvailable || isRedirecting || isLoading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRedirecting 
            ? 'Redirecting to payment...' 
            : isSubmitting 
              ? 'Processing...'
              : isLoading
                ? 'Checking availability...'
                : isAvailable === false
                  ? 'Not available for selected dates'
                  : 'Book Now'}
        </button>
      </form>

      {/* Price Details */}
      {totalPrice > 0 && (
        <div className="mt-6 border-t pt-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">
              ${price} x {Math.ceil((dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) / (1000 * 60 * 60 * 24))} nights
            </span>
            <span className="text-gray-900">
              ${price * Math.ceil((dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) / (1000 * 60 * 60 * 24))}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Cleaning fee</span>
            <span className="text-gray-900">$50</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Service fee</span>
            <span className="text-gray-900">$30</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}
    </div>
  );
} 