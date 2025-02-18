import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendBookingConfirmation } from '@/lib/email';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const { roomId, userId, checkIn, checkOut, guests } = session.metadata;

      // Create booking in database
      const booking = await prisma.booking.create({
        data: {
          userId,
          roomId,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          guests: parseInt(guests),
          status: 'confirmed',
          totalAmount: session.amount_total / 100,
        },
        include: {
          user: true,
          room: true,
        },
      });

      // Send confirmation email
      await sendBookingConfirmation({
        userEmail: booking.user.email!,
        userName: booking.user.name || 'Valued Guest',
        roomName: booking.room.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        totalPrice: booking.totalAmount,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 