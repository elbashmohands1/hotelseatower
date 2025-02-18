import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Section,
  Row,
  Column,
} from '@react-email/components';
import { format } from 'date-fns';

interface BookingStatusUpdateProps {
  userName: string;
  roomName: string;
  bookingId: string;
  status: string;
  checkIn: Date;
  checkOut: Date;
}

export default function BookingStatusUpdate({
  userName,
  roomName,
  bookingId,
  status,
  checkIn,
  checkOut,
}: BookingStatusUpdateProps) {
  const statusColor = {
    confirmed: '#22c55e',
    pending: '#eab308',
    cancelled: '#ef4444',
  }[status];

  return (
    <Html>
      <Head />
      <Preview>Your booking status has been updated</Preview>
      <Body style={main}>
        <Container>
          <Section style={content}>
            <Text style={logo}>Luxury Hotel</Text>
            <Text style={title}>Booking Status Update</Text>
            <Text style={text}>Dear {userName},</Text>
            <Text style={text}>
              Your booking status has been updated to{' '}
              <span style={{ color: statusColor, fontWeight: 600 }}>{status}</span>.
            </Text>

            <Section style={boxInfo}>
              <Row>
                <Column>
                  <Text style={boxTitle}>Booking Details</Text>
                  <Text style={boxText}>Room: {roomName}</Text>
                  <Text style={boxText}>
                    Check-in: {format(new Date(checkIn), 'MMM d, yyyy')}
                  </Text>
                  <Text style={boxText}>
                    Check-out: {format(new Date(checkOut), 'MMM d, yyyy')}
                  </Text>
                  <Text style={boxText}>Booking ID: {bookingId}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={text}>
              You can view your booking details by clicking the button below.
            </Text>

            <Link
              href={`${process.env.NEXTAUTH_URL}/bookings`}
              style={button}
            >
              View Booking
            </Link>

            <Text style={footer}>
              If you have any questions, please don't hesitate to contact us.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Email styles
const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const content = {
  backgroundColor: '#ffffff',
  border: '1px solid #e6e6e6',
  borderRadius: '5px',
  padding: '40px',
  marginVertical: '20px',
};

const logo = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  textAlign: 'center' as const,
  color: '#1a1a1a',
};

const title = {
  fontSize: '20px',
  fontWeight: 'bold' as const,
  textAlign: 'center' as const,
  margin: '30px 0',
  color: '#1a1a1a',
};

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#4a4a4a',
  marginBottom: '20px',
};

const boxInfo = {
  padding: '20px',
  backgroundColor: '#f9fafb',
  borderRadius: '5px',
  marginBottom: '20px',
};

const boxTitle = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  marginBottom: '12px',
};

const boxText = {
  fontSize: '14px',
  color: '#4a4a4a',
  margin: '3px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '30px auto',
  width: 'fit-content',
};

const footer = {
  fontSize: '14px',
  color: '#666666',
  textAlign: 'center' as const,
  marginTop: '30px',
}; 