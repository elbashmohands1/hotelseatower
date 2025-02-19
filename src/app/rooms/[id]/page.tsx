import { notFound } from "next/navigation"
import Image from "next/image"
import { db } from "@/lib/db"
import { BookingForm } from "@/components/rooms/booking-form"
import { Icons } from "@/components/ui/icons"

interface RoomPageProps {
  params: {
    id: string
  }
}

export default async function RoomPage({ params }: RoomPageProps) {
  const room = await db.room.findUnique({
    where: {
      id: params.id,
    },
    include: {
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  })

  if (!room) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Room Images */}
        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={room.images[0]}
              alt={room.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {room.images.slice(1, 4).map((image, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-lg overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${room.name} - Image ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Room Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
            <p className="text-2xl font-semibold text-primary">
              ${room.price.toFixed(2)}
              <span className="text-sm text-muted-foreground">/night</span>
            </p>
          </div>

          <div className="prose max-w-none">{room.description}</div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Icons.user className="h-4 w-4" />
              <span>Up to {room.capacity} guests</span>
            </div>
            {room.avgRating > 0 && (
              <div className="flex items-center gap-2">
                <Icons.star className="h-4 w-4 text-yellow-400" />
                <span>
                  {room.avgRating.toFixed(1)} ({room.totalReviews} reviews)
                </span>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Icons.check className="h-4 w-4 text-primary" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <BookingForm room={room} />
        </div>
      </div>

      {/* Reviews Section */}
      {room.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Reviews</h2>
          <div className="grid gap-6">
            {room.reviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-lg p-4 bg-card text-card-foreground"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{review.user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icons.star className="h-4 w-4 text-yellow-400" />
                    <span>{review.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 