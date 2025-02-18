import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create sample rooms
  await prisma.room.create({
    data: {
      name: 'Deluxe Ocean View',
      description: 'Spacious room with stunning ocean views and modern amenities.',
      price: 299.99,
      images: [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      type: 'deluxe',
      capacity: 2,
      amenities: ['Ocean View', 'King Bed', 'Wi-Fi', 'Smart TV', 'Mini Bar', 'Room Service'],
    },
  });

  // Create a test user
  const hashedPassword = await hash('password123', 10);
  await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 