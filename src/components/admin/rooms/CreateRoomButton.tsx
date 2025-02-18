'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PhotoIcon } from '@heroicons/react/24/outline';
import CreateRoomModal from './CreateRoomModal';

export default function CreateRoomButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <PhotoIcon className="h-4 w-4 mr-2" />
        Add Room
      </Button>

      <CreateRoomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 