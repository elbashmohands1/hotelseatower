'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloudIcon } from 'lucide-react';

interface CreateRoomModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateRoomModal({ open, onClose }: CreateRoomModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: '',
    capacity: '',
    images: [] as string[],
    amenities: [] as string[],
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadedImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          if (data.secure_url) {
            uploadedImages.push(data.secure_url);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          amenities: formData.amenities.filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error('Failed to create room');

      router.refresh();
      onClose();
      setFormData({
        name: '',
        description: '',
        price: '',
        type: '',
        capacity: '',
        images: [],
        amenities: [],
      });
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price per Night</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Room Type</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity (persons)</Label>
                <Input
                  id="capacity"
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 border-dashed border-2 border-gray-300 rounded-md p-4">
              <Label>Room Images</Label>
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  handleImageUpload({ target: { files } });
                }}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center h-36 p-4 border-2 border-dashed border-gray-400 rounded-md cursor-pointer"
              >
                <div className="text-gray-500">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Uploading...</span>
                    </div>
                  ) : formData.images.length > 0 ? (
                    <div className="grid grid-cols-5 gap-4 my-2">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={url}
                            alt={`Room ${index + 1}`}
                            className="object-cover w-full h-32" // Adjusted height for medium size
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => removeImage(index)}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      onClick={() => document.getElementById('image-upload-input')?.click()} // Activate click to upload
                      className='flex items-center gap-2'
                    >
                      <UploadCloudIcon size={40} />
                      Drag & drop images here
                    </div>
                  )}
                  <input
                    id="image-upload-input" // Added ID for reference
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Upload up to 5 images. Supported formats: JPG, PNG, WebP
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amenities">Amenities</Label>
                <Input
                  id="amenities"
                  placeholder="WiFi, TV, Air Conditioning"
                  value={formData.amenities.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    amenities: e.target.value.split(',').map(item => item.trim()),
                  }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Room'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 