import { Metadata } from "next"
import { db } from "@/lib/db"
import { RoomCard } from "@/components/rooms/room-card"
import { SearchRooms } from "@/components/rooms/search-rooms"

export const metadata: Metadata = {
  title: "Rooms & Suites - Luxury Hotel",
  description: "Browse our selection of luxurious rooms and suites.",
}

interface RoomsPageProps {
  searchParams: {
    checkIn?: string
    checkOut?: string
    guests?: string
    type?: string
  }
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const { checkIn, checkOut, guests, type } = searchParams

  const where = {
    ...(type && type !== "any" ? { type } : {}),
    ...(guests ? { capacity: { gte: parseInt(guests) } } : {}),
  }

  const rooms = await db.room.findMany({
    where,
    orderBy: {
      price: "asc",
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Rooms & Suites</h1>
      <div className="mb-8">
        <SearchRooms />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  )
} 