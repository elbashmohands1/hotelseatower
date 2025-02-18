'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { Room } from '@prisma/client';
import { validateRoomForm, RoomFormData } from '@/lib/validations/room';
import Toast from '@/components/ui/Toast';
import RoomPreviewModal from './RoomPreviewModal';

interface EditRoomFormProps {
  room: Room;
}

const roomTypes = ['standard', 'deluxe', 'suite', 'family'];
const amenityOptions = [
  'Wi-Fi',
  'TV',
  'Air Conditioning',
  'Mini Bar',
  'Room Service',
  'Ocean View',
  'Balcony',
  'King Bed',
];

export default function EditRoomForm({ room }: EditRoomFormProps) {
  const [formData, setFormData] = useState<RoomFormData>({
    name: room.name,
    description: room.description,
    price: room.price.toString(),
    type: room.type,
    capacity: room.capacity.toString(),
    amenities: room.amenities,
    images: room.images,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RoomFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const router = useRouter();

  // Add toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Add preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');

    // Validate form
    const validationErrors = validateRoomForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/rooms/${room.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update room');
      }

      setToast({
        show: true,
        message: 'Room updated successfully',
        type: 'success',
      });

      // Wait for toast to show before redirecting
      setTimeout(() => {
        router.refresh();
        router.push('/admin/rooms');
      }, 1000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to update room');
      setToast({
        show: true,
        message: err instanceof Error ? err.message : 'Failed to update room',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (result: any) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, result.info.secure_url],
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price per night</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className={`block w-full pl-7 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Room Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.type ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {roomTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.capacity ? 'border-red-300' : 'border-gray-300'
              }`}
              min="1"
              required
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
            )}
          </div>
        </div>

        {/* Add Amenities Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 gap-4">
            {amenityOptions.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        amenities: [...prev.amenities, amenity],
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        amenities: prev.amenities.filter(a => a !== amenity),
                      }));
                    }
                  }}
                  className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                    errors.amenities?.includes(amenity) ? 'border-red-300' : ''
                  }`}
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
          {errors.amenities && (
            <p className="mt-1 text-sm text-red-600">{errors.amenities.join(', ')}</p>
          )}
        </div>

        {/* Images Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Images
          </label>
          <div className="space-y-4">
            {/* Display existing images */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={image} className="relative group">
                    <img
                      src={image}
                      alt={`Room ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }));
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Image upload widget */}
            <CldUploadWidget
              uploadPreset="hotel_rooms"
              onUpload={(result: any) => handleImageUpload(result)}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="w-full flex justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="text-sm text-gray-600">
                    Upload Images
                  </span>
                </button>
              )}
            </CldUploadWidget>
            <p className="text-xs text-gray-500">
              Recommended: Upload images with a 16:9 aspect ratio
            </p>
          </div>
        </div>

        {submitError && (
          <p className="text-sm text-red-600">{submitError}</p>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={isLoading || formData.images.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
      
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />

      <RoomPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        room={formData}
      />
    </>
  );
} 