const bookings = await prisma.booking.findMany({
  include: {
    user: {
      select: {
        name: true,
        email: true,
      },
    },
    room: {
      select: {
        name: true,
        price: true,
      },
    },
    BookingHistory: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
}); 