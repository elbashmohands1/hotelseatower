import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Update user to be admin
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });

    return NextResponse.json({ message: 'User is now an admin' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to make user admin' },
      { status: 500 }
    );
  }
} 