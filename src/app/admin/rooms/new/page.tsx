'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoomForm from '@/components/admin/RoomForm';

export default function NewRoom() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create room');

      router.push('/admin/rooms');
    } catch (error) {
      console.error('Error creating room:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Add New Room</h1>
      <RoomForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
} 