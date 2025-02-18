interface BookingStatsProps {
  stats: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    revenue: number;
  };
}

export default function BookingStats({ stats }: BookingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Confirmed</h3>
        <p className="mt-2 text-3xl font-bold text-green-600">{stats.confirmed}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Pending</h3>
        <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.pending}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
        <p className="mt-2 text-3xl font-bold text-red-600">{stats.cancelled}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
        <p className="mt-2 text-3xl font-bold text-blue-600">
          ${stats.revenue?.toLocaleString()}
        </p>
      </div>
    </div>
  );
} 