'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth, useIsAdmin } from '@/lib/auth';

interface HeaderProps {
  className?: string;
  plain?: boolean;
}

const NAV = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, getUserDisplayName } = useAuth();
  const isAdmin = useIsAdmin();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.profile?.first_name || user.first_name || '';
    const lastName = user.profile?.last_name || user.last_name || '';
    const firstInitial = firstName.charAt(0) || '';
    const lastInitial = lastName.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase() || user.email.charAt(0).toUpperCase();
  };

  const account = isAuthenticated ? (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center gap-2 text-sm font-semibold text-[#244034]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d2f34c] text-sm font-bold text-[#244034]">
          {getUserInitials()}
        </span>
        <span className="hidden lg:inline">{getUserDisplayName()}</span>
        <svg className={cn('h-4 w-4 transition-transform', isUserMenuOpen && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isUserMenuOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl bg-white py-1 shadow-lg ring-1 ring-black/5">
          {isAdmin ? (
            <Link href="/admin" className="block px-4 py-2 text-sm text-[#141414] hover:bg-[#F4F2EE]" onClick={() => setIsUserMenuOpen(false)}>
              Admin
            </Link>
          ) : null}
          <Link href="/dashboard" className="block px-4 py-2 text-sm text-[#141414] hover:bg-[#F4F2EE]" onClick={() => setIsUserMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/profile" className="block px-4 py-2 text-sm text-[#141414] hover:bg-[#F4F2EE]" onClick={() => setIsUserMenuOpen(false)}>
            Profile
          </Link>
          <Link href="/dashboard#saved" className="block px-4 py-2 text-sm text-[#141414] hover:bg-[#F4F2EE]" onClick={() => setIsUserMenuOpen(false)}>
            Saved jobs
          </Link>
          <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
            Log out
          </button>
        </div>
      ) : null}
    </div>
  ) : (
    <Link href="/start" className="text-sm font-semibold text-[#244034]">
      Log in
    </Link>
  );

  return (
    <div className={className}>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <Link href="/" className="text-[28px] font-extrabold leading-none tracking-[-0.05em] text-[#244034]">
            edwuma
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[15px] font-bold text-[#141414] hover:text-[#244034]"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {account}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#244034] md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Menu</span>
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="border-t border-black/5 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-xl px-3 py-3 text-base font-bold text-[#141414]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-3 border-t border-black/5 pt-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d2f34c] font-bold text-[#244034]">
                      {getUserInitials()}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-[#141414]">{getUserDisplayName()}</span>
                      <span className="block text-sm text-black/50">{user?.email}</span>
                    </span>
                  </div>
                  {isAdmin ? (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full justify-start rounded-full">Admin</Button>
                    </Link>
                  ) : null}
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start rounded-full">Dashboard</Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start rounded-full">Profile</Button>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Button variant="outline" size="sm" className="w-full justify-start rounded-full border-red-200 bg-red-50 text-red-600">
                      Log out
                    </Button>
                  </button>
                </>
              ) : (
                <Link href="/start" onClick={() => setIsMobileMenuOpen(false)} className="px-3 text-sm font-semibold text-[#244034]">
                  Log in
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </header>
    </div>
  );
};

export default Header;
