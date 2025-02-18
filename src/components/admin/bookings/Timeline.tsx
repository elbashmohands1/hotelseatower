'use client';

import { format } from 'date-fns';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { AdminBooking } from '@/types/booking';

interface TimelineEvent {
  type: 'created' | 'status_change';
  status?: string;
  timestamp: Date;
}

interface TimelineProps {
  booking: AdminBooking;
}

export default function Timeline({ booking }: TimelineProps) {
  // Transform booking data into timeline events
  const events: TimelineEvent[] = [
    {
      type: 'created',
      timestamp: booking.createdAt,
    },
    ...booking.history.map(event => ({
      type: 'status_change' as const,
      status: event.status,
      timestamp: event.createdAt,
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEventText = (event: TimelineEvent) => {
    if (event.type === 'created') {
      return 'Booking created';
    }
    return `Status changed to ${event.status}`;
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={eventIdx}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white">
                    {event.type === 'status_change' && event.status
                      ? getStatusIcon(event.status)
                      : <CalendarIcon className="h-5 w-5 text-gray-500" />
                    }
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {getEventText(event)}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 