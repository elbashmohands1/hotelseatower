import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Room } from "@prisma/client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
        <p className="text-muted-foreground line-clamp-2 mb-4">
          {room.description}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Icons.user className="h-4 w-4" />
            <span>Up to {room.capacity} guests</span>
          </div>
          {room.avgRating > 0 && (
            <div className="flex items-center gap-1">
              <Icons.star className="h-4 w-4 text-yellow-400" />
              <span>{room.avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="text-lg font-semibold">
          ${room.price.toFixed(2)}
          <span className="text-sm text-muted-foreground">/night</span>
        </div>
        <Link
          href={`/rooms/${room.id}`}
          className="text-primary hover:text-primary/80"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
} 