"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, Library, GraduationCap, Upload, Shield, LogIn, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  tier?: 'FREE_LISTENER' | 'ADULT' | 'STUDENT' | 'ROOT_USER';
  isLoggedIn?: boolean;
}

export default function Navbar({ tier = 'FREE', isLoggedIn = false }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home, tiers: ['FREE_LISTENER', 'ADULT', 'STUDENT', 'ROOT_USER'] },
    { href: '/dashboard', label: 'Your Books', icon: Library, tiers: ['FREE_LISTENER', 'ADULT', 'STUDENT', 'ROOT_USER'] },
    { href: '/student-hub', label: 'Study Hub', icon: GraduationCap, tiers: ['STUDENT', 'ROOT_USER'] },
    { href: '/profile', label: 'Profile', icon: User, tiers: ['FREE_LISTENER', 'ADULT', 'STUDENT', 'ROOT_USER'] },
    { href: '/upload', label: 'Upload', icon: Upload, tiers: ['ADULT', 'ROOT_USER'] },
    { href: '/admin', label: 'Admin', icon: Shield, tiers: ['ROOT_USER'] },
  ];

  const visibleItems = navItems.filter(item => item.tiers.includes(tier));

  const tierColors: Record<string, string> = {
    FREE_LISTENER: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    ADULT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    STUDENT: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    ROOT_USER: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0E0E10]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <BookOpen size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight hidden sm:block uppercase">
              Veda
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${tierColors[tier]}`}>
                {tier}
              </span>
            )}

            {!isLoggedIn ? (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            ) : null}

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-gray-400 hover:text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0E0E10]/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
