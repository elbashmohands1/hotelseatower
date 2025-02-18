import Link from 'next/link';

export default function Logo() {
  return (
    <div className="flex items-center">
      <Link href="/" className="text-xl font-bold text-primary">
        Luxury Hotel
      </Link>
    </div>
  );
} 