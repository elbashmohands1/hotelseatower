'use client';

import { useState } from 'react';

export default function RoomFilter() {
  const [priceRange, setPriceRange] = useState('all');
  const [roomType, setRoomType] = useState('all');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Prices</option>
          <option value="0-100">$0 - $100</option>
          <option value="101-200">$101 - $200</option>
          <option value="201-300">$201 - $300</option>
          <option value="301+">$301+</option>
        </select>
      </div>

      {/* Room Type Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Room Type</h3>
        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="single">Single Room</option>
          <option value="double">Double Room</option>
          <option value="suite">Suite</option>
          <option value="deluxe">Deluxe Suite</option>
        </select>
      </div>

      {/* Amenities Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Amenities</h3>
        <div className="space-y-2">
          {['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Ocean View'].map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
} 