import { z } from 'zod';

export const roomSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  type: z.enum(['standard', 'deluxe', 'suite']),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
});

export type RoomFormData = z.infer<typeof roomSchema>;

export function validateRoomForm(data: RoomFormData) {
  const errors: Partial<Record<keyof RoomFormData, string>> = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  const price = parseFloat(data.price);
  if (isNaN(price) || price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  const capacity = parseInt(data.capacity);
  if (isNaN(capacity) || capacity < 1) {
    errors.capacity = 'Capacity must be at least 1';
  }

  if (!data.type) {
    errors.type = 'Room type is required';
  }

  if (data.amenities.length === 0) {
    errors.amenities = 'Select at least one amenity';
  }

  if (data.images.length === 0) {
    errors.images = 'Upload at least one image';
  }

  return errors;
} 