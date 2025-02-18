import { prisma } from '@/lib/prisma';
import AdminStats from '@/components/admin/AdminStats';
import RecentBookings from '@/components/admin/RecentBookings';
import RevenueChart from '@/components/admin/RevenueChart';

export default async function AdminDashboard() {
  // Fetch overview statistics
  const [bookings, totalUsers, totalRooms] = await Promise.all([
    prisma.booking.findMany({
      where: {
        status: 'confirmed',
      },
      select: {
        id: true,
        guests: true,
        checkIn: true,
        checkOut: true,
        totalAmount: true,
      },
    }),
    prisma.user.count(),
    prisma.room.count(),
  ]);

  // Calculate total revenue and bookings
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((acc, booking) => acc + (booking.totalAmount || 0), 0);

  // Fetch recent bookings - fixed to use only select
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      status: 'confirmed',
    },
    select: {
      id: true,
      createdAt: true,
      status: true,
      totalAmount: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      room: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Fetch and transform revenue data for the chart
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const bookingsByDate = await prisma.booking.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
      status: 'confirmed',
    },
    _sum: {
      totalAmount: true,
    },
  });

  // Transform the revenue data
  const revenueData = bookingsByDate.map(booking => ({
    createdAt: booking.createdAt,
    _sum: {
      totalAmount: booking._sum.totalAmount || 0,
    },
  }));

  // Transform recent bookings to match the interface
  const transformedBookings = recentBookings.map(booking => ({
    id: booking.id,
    createdAt: booking.createdAt,
    status: booking.status,
    totalAmount: booking.totalAmount || 0,
    user: {
      name: booking.user.name,
      email: booking.user.email,
    },
    room: {
      id: booking.room.id,
      name: booking.room.name,
    },
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      
      <AdminStats
        totalBookings={totalBookings}
        totalRevenue={totalRevenue}
        totalUsers={totalUsers}
        totalRooms={totalRooms}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <RecentBookings bookings={transformedBookings} />
      </div>
    </div>
  );
} 