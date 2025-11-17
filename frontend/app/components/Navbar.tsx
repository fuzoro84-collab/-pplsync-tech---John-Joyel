'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  isAuthenticated?: boolean;
  username?: string;
  showActions?: boolean;
  onAddNote?: () => void;
}

export default function Navbar({ isAuthenticated, username, showActions, onAddNote }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-soft-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={isAuthenticated ? '/dashboard' : '/'} className="text-2xl font-bold text-calm-teal">
            DAsh
          </Link>

          {isAuthenticated && username && (
            <div className="hidden md:block text-lg font-semibold text-deep-charcoal">
              {getGreeting()}, {username}!
            </div>
          )}

          <div className="flex gap-4 items-center">
            {showActions ? (
              <>
                <button
                  onClick={onAddNote}
                  className="px-6 py-2 rounded-lg font-semibold bg-calm-teal text-white hover:bg-opacity-90 transition-colors"
                >
                  Add Note
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-lg font-semibold border-2 border-calm-teal text-calm-teal hover:bg-calm-teal hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2 rounded-lg font-semibold text-calm-teal hover:bg-calm-teal hover:bg-opacity-10 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 rounded-lg font-semibold bg-calm-teal text-white hover:bg-opacity-90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
