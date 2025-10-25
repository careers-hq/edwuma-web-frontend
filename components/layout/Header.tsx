'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, getUserDisplayName } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navigation = [
    { name: 'Browse Jobs', href: '/' },
    // { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  // Close user menu when clicking outside
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
    // Check profile first, then fall back to user object properties
    const firstName = user.profile?.first_name || user.first_name || '';
    const lastName = user.profile?.last_name || user.last_name || '';
    const firstInitial = firstName.charAt(0) || '';
    const lastInitial = lastName.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase() || user.email.charAt(0).toUpperCase();
  };

  return (
    <header className={cn('bg-primary shadow-sm', className)}>
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/images/logo/logo_01.png"
                alt="Edwuma Logo"
                width={120}
                height={32}
                className="h-8 w-auto"
                style={{ width: "auto" }}
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-white hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth/User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 text-white hover:text-accent transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#B8F23E] text-[#2D4A43] flex items-center justify-center font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                  <span className="font-medium">{getUserDisplayName()}</span>
                  <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard?tab=profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/dashboard?tab=applications"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Applications
                    </Link>
                    <Link
                      href="/dashboard?tab=saved"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Saved Jobs
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-white hover:text-accent font-semibold transition-colors">
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-[#B8F23E] text-[#2D4A43] hover:bg-[#A5D936] font-medium"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#B8F23E] hover:bg-[#3A5A53] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#B8F23E]"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary border-t border-[#3A5A53]">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-primary rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-primary">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#B8F23E] text-[#2D4A43] flex items-center justify-center font-semibold">
                        {getUserInitials()}
                      </div>
                      <div className="text-white">
                        <p className="font-medium">{getUserDisplayName()}</p>
                        <p className="text-sm text-gray-300">{user?.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full justify-start bg-white text-primary">
                        Dashboard
                      </Button>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      <Button variant="outline" size="sm" className="w-full justify-start bg-red-50 text-red-600 border-red-200">
                        Logout
                      </Button>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="success" size="sm" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full bg-accent text-primary hover:bg-primary">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
