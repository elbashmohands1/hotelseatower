"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Room } from "@prisma/client"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
  guests: z.string().min(1),
})

interface BookingFormProps {
  room: Room
}

export function BookingForm({ room }: BookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dates: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
      guests: "2",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: room.id,
          checkIn: format(values.dates.from, "yyyy-MM-dd"),
          checkOut: format(values.dates.to, "yyyy-MM-dd"),
          guests: parseInt(values.guests),
          totalAmount:
            room.price *
            Math.ceil(
              (values.dates.to.getTime() - values.dates.from.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      const booking = await response.json()
      toast({
        title: "Booking Confirmed!",
        description: "Your room has been successfully booked.",
      })
      router.push(`/bookings/${booking.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const numberOfNights = Math.ceil(
    (form.watch("dates.to")?.getTime() - form.watch("dates.from")?.getTime()) /
      (1000 * 60 * 60 * 24)
  )

  const totalPrice = room.price * (numberOfNights || 0)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border p-4"
      >
        <FormField
          control={form.control}
          name="dates"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Dates</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} -{" "}
                            {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                      disabled={(date) =>
                        date < new Date() || date < field.value?.from
                      }
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Guests</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map(
                    (num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Price per night</span>
            <span>${room.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Number of nights</span>
            <span>{numberOfNights || 0}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Book Now
        </Button>
      </form>
    </Form>
  )
} 