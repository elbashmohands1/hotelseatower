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

interface BookingConfirmationProps {
  userName: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
}

export default function BookingConfirmation({
  userName,
  roomName,
  checkIn,
  checkOut,
  guests,
  totalPrice,
}: BookingConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your booking confirmation at Luxury Hotel</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', padding: '40px 0' }}>
        <Container>
          <Section style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '5px' }}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
              Booking Confirmation
            </Text>
            
            <Text>Dear {userName},</Text>
            
            <Text>
              Thank you for choosing Luxury Hotel. Your booking has been confirmed.
            </Text>

            <Section style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '5px' }}>
              <Text style={{ fontWeight: 'bold', marginBottom: '10px' }}>Booking Details:</Text>
              <Row>
                <Column>Room:</Column>
                <Column>{roomName}</Column>
              </Row>
              <Row>
                <Column>Check-in:</Column>
                <Column>{format(checkIn, 'MMMM dd, yyyy')}</Column>
              </Row>
              <Row>
                <Column>Check-out:</Column>
                <Column>{format(checkOut, 'MMMM dd, yyyy')}</Column>
              </Row>
              <Row>
                <Column>Guests:</Column>
                <Column>{guests}</Column>
              </Row>
              <Row>
                <Column>Total Price:</Column>
                <Column>${totalPrice}</Column>
              </Row>
            </Section>

            <Text>
              If you have any questions, please don't hesitate to contact us.
            </Text>

            <Link
              href={`${process.env.NEXTAUTH_URL}/bookings`}
              style={{
                display: 'inline-block',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '5px',
                textDecoration: 'none',
                marginTop: '20px',
              }}
            >
              View Booking
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
} 