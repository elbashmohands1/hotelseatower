
"use client"
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Navigation() {

  return (
    <div className="flex items-center space-x-12 ">
        <Link href="/rooms">Rooms</Link>
        <Link href="#">Contact</Link>
        <Link href="#">Social Media</Link>
      
    </div>
  );
} 