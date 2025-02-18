import {
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

interface AdminStatsProps {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalRooms: number;
}

export default function AdminStats({
  totalBookings,
  totalRevenue,
  totalUsers,
  totalRooms,
}: AdminStatsProps) {
  const stats = [
    {
      name: 'Total Bookings',
      value: totalBookings,
      icon: CalendarIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Total Users',
      value: totalUsers,
      icon: UsersIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Rooms',
      value: totalRooms,
      icon: HomeIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 