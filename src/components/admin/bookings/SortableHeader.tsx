'use client';

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

interface SortableHeaderProps {
  label: string;
  field: string;
  currentSort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
}

export default function SortableHeader({ label, field, currentSort, onSort }: SortableHeaderProps) {
  const isActive = currentSort.field === field;

  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <div className="flex flex-col">
          <ChevronUpIcon 
            className={`h-3 w-3 ${
              isActive && currentSort.direction === 'asc' 
                ? 'text-blue-600' 
                : 'text-gray-400'
            }`} 
          />
          <ChevronDownIcon 
            className={`h-3 w-3 -mt-1 ${
              isActive && currentSort.direction === 'desc' 
                ? 'text-blue-600' 
                : 'text-gray-400'
            }`} 
          />
        </div>
      </div>
    </th>
  );
} 