import BookingDetailsSkeleton from '@/components/admin/bookings/BookingDetailsSkeleton';

export default function BookingDetailsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <BookingDetailsSkeleton />
    </div>
  );
} 