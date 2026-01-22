'use client';

import { useState } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

interface NavbarProps {
  currentPage?: string;
}

export function Navbar({ currentPage = 'home' }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/#features', label: 'Features', id: 'features' },
    { href: '/pricing', label: 'Pricing', id: 'pricing' },
    { href: '/docs', label: 'Docs', id: 'docs' },
    { href: '/blog', label: 'Blog', id: 'blog' },
    { href: '/contact', label: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl sm:text-3xl font-bold text-purple-600">short.link</span>
            <span className="text-xs sm:text-sm text-gray-600 hidden lg:inline whitespace-nowrap">Privacy-first URL shortener</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 lg:gap-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-gray-600 hover:text-purple-600 font-medium text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex gap-3 lg:gap-4 items-center flex-shrink-0">
            <SignedOut>
              <Link
                href="/sign-in"
                className="px-3 lg:px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up?redirect_url=/onboarding/choose-plan"
                className="px-3 lg:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors"
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="px-3 lg:px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium text-sm transition-colors"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-xl absolute left-0 right-0 top-full animate-in slide-in-from-top-2 duration-200 z-50">
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl font-medium text-base transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <SignedOut>
                <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 text-center text-purple-600 hover:bg-purple-50 rounded-xl font-bold text-base transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up?redirect_url=/onboarding/choose-plan"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 text-center bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold text-base transition-colors shadow-lg hover:shadow-purple-500/25"
                  >
                    Get Started Free
                  </Link>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 text-center text-purple-600 hover:bg-purple-50 rounded-xl font-medium text-base transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
