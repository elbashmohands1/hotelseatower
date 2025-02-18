'use client';

import Logo from './header/Logo';
import Navigation from './header/Navigation';
import UserMenu from './header/UserMenu';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <Logo />
          <Navigation />
          <UserMenu />
        </div>
      </nav>
    </header>
  );
} 