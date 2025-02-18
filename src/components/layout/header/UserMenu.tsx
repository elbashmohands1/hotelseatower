'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button variant="ghost" asChild>
        <Link href="/api/auth/signin">Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user?.image ?? ''} alt={session.user?.email ?? ''} />
            <AvatarFallback>{session.user?.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {session.user?.name && (
              <p className="font-medium">{session.user.name}</p>
            )}
            {session.user?.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {session.user.email}
              </p>
            )}
          </div>
        </div>
       {
        session.user?.isAdmin && (
       <DropdownMenuItem asChild>
          <Link href="/admin">Dashboard</Link>
        </DropdownMenuItem>)}
        <DropdownMenuItem asChild>
          <Link href="/bookings">My Bookings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/api/auth/signout">Sign Out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 