'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';
import { roomSchema, RoomFormData } from '@/lib/validations/room';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface RoomFormProps {
  initialData?: RoomFormData;
  onSubmit: (data: RoomFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function RoomForm({ initialData, onSubmit, isSubmitting }: RoomFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      type: 'standard',
      capacity: 1,
      images: [],
      amenities: [],
    },
  });

  const images = watch('images');
  const amenities = watch('amenities');
  const [newAmenity, setNewAmenity] = useState('');

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      const updatedAmenities = [...amenities, newAmenity.trim()];
      setValue('amenities', updatedAmenities);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    const updatedAmenities = amenities.filter((_, i) => i !== index);
    setValue('amenities', updatedAmenities);
  };

  const handleImageUpload = (result: any) => {
    const updatedImages = [...images, result.info.secure_url];
    setValue('images', updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setValue('images', updatedImages);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price per night</label>
            <input
              type="number"
              {...register('price', { valueAsNumber: true })}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Room Type</label>
            <select
              {...register('type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              {...register('capacity', { valueAsNumber: true })}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amenities</label>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add amenity"
            />
            <button
              type="button"
              onClick={handleAddAmenity}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          {errors.amenities && (
            <p className="mt-1 text-sm text-red-600">{errors.amenities.message}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Images
          </label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`Room image ${index + 1}`}
                  width={200}
                  height={150}
                  className="rounded-lg object-cover w-full h-32"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {errors.images && (
            <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
          )}
          <CldUploadButton
            uploadPreset="hotel_rooms"
            onUpload={handleImageUpload}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload Image
          </CldUploadButton>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Room'}
          </button>
        </div>
      </div>
    </form>
  );
} 