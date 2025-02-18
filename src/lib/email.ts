import { Resend } from 'resend';
import BookingConfirmation from '@/components/emails/BookingConfirmation';
import BookingStatusUpdate from '@/components/emails/BookingStatusUpdate';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingEmailProps {
  userEmail: string;
  userName: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
}

export async function sendBookingConfirmation({
  userEmail,
  userName,
  roomName,
  checkIn,
  checkOut,
  guests,
  totalPrice,
}: BookingEmailProps) {
  try {
    await resend.emails.send({
      from: 'Luxury Hotel <bookings@yourdomain.com>',
      to: userEmail,
      subject: 'Booking Confirmation - Luxury Hotel',
      react: BookingConfirmation({
        userName,
        roomName,
        checkIn,
        checkOut,
        guests,
        totalPrice,
      }),
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
}

export async function sendBookingCancellation({
  userEmail,
  userName,
  roomName,
  checkIn,
  checkOut,
}: BookingEmailProps) {
  try {
    await resend.emails.send({
      from: 'Luxury Hotel <bookings@yourdomain.com>',
      to: userEmail,
      subject: 'Booking Cancellation - Luxury Hotel',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">Booking Cancellation</h1>
          <p>Dear ${userName},</p>
          <p>Your booking has been cancelled as requested.</p>
          
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2c5282; margin-top: 0;">Cancelled Booking Details</h2>
            <p><strong>Room:</strong> ${roomName}</p>
            <p><strong>Check-in:</strong> ${checkIn.toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${checkOut.toLocaleDateString()}</p>
          </div>
          
          <p>We hope to welcome you to Luxury Hotel in the future.</p>
          <p>Best regards,<br>Luxury Hotel Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendBookingStatusUpdate({
  userEmail,
  userName,
  roomName,
  bookingId,
  status,
  checkIn,
  checkOut,
}: {
  userEmail: string;
  userName: string;
  roomName: string;
  bookingId: string;
  status: string;
  checkIn: Date;
  checkOut: Date;
}) {
  try {
    await resend.emails.send({
      from: 'Luxury Hotel <bookings@luxuryhotel.com>',
      to: userEmail,
      subject: `Booking Status Update - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      react: BookingStatusUpdate({
        userName,
        roomName,
        bookingId,
        status,
        checkIn,
        checkOut,
      }),
    });
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
} 