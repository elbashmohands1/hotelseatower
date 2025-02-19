import Link from "next/link"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { RoomCard } from "@/components/rooms/room-card"
import { SearchRooms } from "@/components/rooms/search-rooms"

export default async function HomePage() {
  const featuredRooms = await db.room.findMany({
    take: 3,
    orderBy: {
      avgRating: "desc",
    },
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Experience Luxury Like Never Before
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Book your perfect stay at our premium hotel
            </p>
            <SearchRooms />
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/rooms">View All Rooms</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Amenities Overview */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            World-Class Amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4">
                <span className="text-4xl">🏊‍♂️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Swimming Pool</h3>
              <p className="text-muted-foreground">
                Relax in our infinity pool with stunning views
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <span className="text-4xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fine Dining</h3>
              <p className="text-muted-foreground">
                Experience culinary excellence at our restaurants
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <span className="text-4xl">💆‍♀️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Luxury Spa</h3>
              <p className="text-muted-foreground">
                Rejuvenate your body and mind at our spa
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/amenities">Explore All Amenities</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
