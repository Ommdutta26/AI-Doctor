import React from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

function AppHeader() {
  const menuOptions = [
    { id: 1, name: 'Home', path: '/dashboard' },
    { id: 2, name: 'History', path: '/dashboard/history' },
    { id: 3, name: 'Pricing', path: '/dashboard/billing' },
    { id: 4, name: 'Profile', path: '/profile' },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 md:px-12 lg:px-20">
        
        {/* Logo */}
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://media.gettyimages.com/id/2218070863/vector/healthcare-symbol.jpg?s=612x612&w=gi&k=20&c=yV23P5HkhpiYbpWMbst89bzc4Vr803ah4Wn8CxIf-vM="
              alt="logo"
              className="w-12 h-12 object-contain hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-bold text-blue-700">AI Doctor</span>
          </div>
        </Link>

        {/* Menu */}
        <nav className="hidden md:flex gap-10 items-center">
          {menuOptions.map((option) => (
            <Link key={option.id} href={option.path}>
              <span className="relative cursor-pointer text-gray-700 font-medium hover:text-blue-600 transition-all">
                {option.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all hover:w-full"></span>
              </span>
            </Link>
          ))}
        </nav>

        {/* User Button */}
        <div className="ml-4">
          <UserButton appearance={{ elements: { userButtonBox: 'rounded-full shadow-md' } }} />
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
