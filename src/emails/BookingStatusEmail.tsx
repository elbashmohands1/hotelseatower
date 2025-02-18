import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
  Link,
} from '@react-email/components';

interface BookingStatusEmailProps {
  userName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  bookingId: string;
}

export default function BookingStatusEmail({
  userName,
  roomName,
  checkIn,
  checkOut,
  status,
  bookingId,
}: BookingStatusEmailProps) {
  const previewText = `Your booking status has been updated to ${status}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Status Update</Heading>
          
          <Text style={text}>Dear {userName},</Text>
          
          <Text style={text}>
            Your booking status for {roomName} has been updated to <strong>{status}</strong>.
          </Text>

          <Text style={text}>Booking Details:</Text>
          <Text style={details}>
            Booking ID: {bookingId}<br />
            Room: {roomName}<br />
            Check-in: {checkIn}<br />
            Check-out: {checkOut}
          </Text>

          {status === 'confirmed' && (
            <Text style={text}>
              We look forward to welcoming you on {checkIn}.
            </Text>
          )}

          {status === 'cancelled' && (
            <Text style={text}>
              We're sorry to see you cancel. We hope to serve you in the future.
            </Text>
          )}

          <Button
            pX={20}
            pY={12}
            style={btn}
            href={`${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}`}
          >
            View Booking Details
          </Button>

          <Text style={footer}>
            If you have any questions, please don't hesitate to contact us.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
  textAlign: 'center' as const,
};

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '16px',
};

const details = {
  ...text,
  backgroundColor: '#f9f9f9',
  padding: '16px',
  borderRadius: '4px',
};

const btn = {
  backgroundColor: '#2563eb',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  marginTop: '24px',
};

const footer = {
  color: '#777',
  fontSize: '14px',
  marginTop: '32px',
  textAlign: 'center' as const,
}; 