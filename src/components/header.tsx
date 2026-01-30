'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'TV Shows', href: '/tv-shows' },
  { name: 'Movies', href: '/movies' },
  { name: 'New & Popular', href: '/new' },
  { name: 'My List', href: '/my-list' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-colors duration-300',
        scrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-netflix-red text-2xl font-bold">
            NETFLIX
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-netflix-lightGray',
                  pathname === item.href ? 'text-white' : 'text-netflix-lightGray'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {showSearch ? (
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                onBlur={() => {
                  if (!searchQuery) setShowSearch(false);
                }}
                className="w-48 rounded bg-netflix-darkGray px-4 py-1 text-sm text-white placeholder-netflix-lightGray focus:outline-none focus:ring-1 focus:ring-white md:w-64"
              />
            </form>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="text-white hover:text-netflix-lightGray transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          <button
            className="text-white hover:text-netflix-lightGray transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <Link
            href="/login"
            className="flex h-8 w-8 items-center justify-center rounded bg-netflix-red text-white hover:bg-netflix-red/80 transition-colors"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

