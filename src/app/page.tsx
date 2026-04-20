"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { BookOpen, Sparkles, Highlighter, GraduationCap, Shield, ArrowRight, ChevronRight, Star } from 'lucide-react';

const FEATURED_BOOKS = [
  { id: 'demo-book-001', title: 'The Art of Learning', author: 'Josh Waitzkin', tag: 'Popular', color: 'from-indigo-500/20 to-purple-500/20' },
  { id: 'demo-book-002', title: 'Deep Work', author: 'Cal Newport', tag: 'Trending', color: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'demo-book-003', title: 'Atomic Habits', author: 'James Clear', tag: 'Best Seller', color: 'from-amber-500/20 to-orange-500/20' },
  { id: 'demo-book-004', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', tag: 'Classic', color: 'from-rose-500/20 to-pink-500/20' },
  { id: 'demo-book-005', title: 'Sapiens', author: 'Yuval Noah Harari', tag: 'Must Read', color: 'from-cyan-500/20 to-blue-500/20' },
  { id: 'demo-book-006', title: 'The Psychology of Money', author: 'Morgan Housel', tag: 'New', color: 'from-violet-500/20 to-fuchsia-500/20' },
];

const TIERS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['Read public books', 'Listen to audiobooks', 'Basic AI summaries'],
    color: 'border-gray-500/20',
    badge: 'bg-gray-500/20 text-gray-400',
    cta: 'Get Started',
    ctaColor: 'bg-white/10 hover:bg-white/15 text-white',
  },
  {
    name: 'Student',
    price: '₹100',
    period: '/month',
    features: ['All study books for all grades', 'AI Study Helper (step-by-step)', 'Subject tutor for all subjects', 'Progress tracker'],
    color: 'border-emerald-500/20',
    badge: 'bg-emerald-500/20 text-emerald-400',
    cta: 'Start Learning',
    ctaColor: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
  },
  {
    name: 'Premium',
    price: '₹150',
    period: '/month',
    features: ['Read ALL books', 'Highlighter tool', 'Your Books dashboard', 'Upload your own books', 'AI summaries of highlights'],
    color: 'border-amber-500/20',
    badge: 'bg-amber-500/20 text-amber-400',
    cta: 'Go Premium',
    ctaColor: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    popular: true,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#E4E4E6] font-sans">
      <Navbar tier="FREE" isLoggedIn={false} />

      {/* ── Hero ──────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/15 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <Sparkles size={16} />
            AI-Powered Reading & Study Platform
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold mb-8 leading-tight tracking-tighter">
            Read smarter,{' '}
            <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              not harder.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Highlight text, get AI explanations, solve math step-by-step, and build your personal knowledge library.
            Better than Kindle — built for learners.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/reader/demo-book-001"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all text-sm group"
            >
              Start Reading
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/student-hub"
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all text-sm"
            >
              <GraduationCap size={18} />
              Study Hub
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Everything you need to learn better
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Powerful features designed to make your reading experience productive and enjoyable.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Highlighter,
              title: 'Smart Highlighting',
              desc: 'Highlight any text in any book. All your highlights are organized and linked back to the exact page.',
              color: 'from-yellow-500/20 to-amber-500/20',
              iconColor: 'text-yellow-400',
            },
            {
              icon: Sparkles,
              title: 'AI Explanations',
              desc: 'Select any passage and let AI explain it clearly. Get summaries, definitions, and deeper insights.',
              color: 'from-indigo-500/20 to-purple-500/20',
              iconColor: 'text-indigo-400',
            },
            {
              icon: GraduationCap,
              title: 'Study Helper',
              desc: 'Input a sum number and page — the AI finds the problem and gives you step-by-step solutions.',
              color: 'from-emerald-500/20 to-teal-500/20',
              iconColor: 'text-emerald-400',
            },
            {
              icon: BookOpen,
              title: 'Your Books Hub',
              desc: 'Highlighted, Saved, Liked, Wishlist — all organized in one beautiful dashboard.',
              color: 'from-pink-500/20 to-rose-500/20',
              iconColor: 'text-pink-400',
            },
            {
              icon: Shield,
              title: 'Admin Control',
              desc: 'Super Users can add, edit, and manage every book and user on the platform.',
              color: 'from-red-500/20 to-orange-500/20',
              iconColor: 'text-red-400',
            },
            {
              icon: Star,
              title: 'Premium Experience',
              desc: 'Upload your own documents, access the full library, and unlock all AI features.',
              color: 'from-violet-500/20 to-fuchsia-500/20',
              iconColor: 'text-violet-400',
            },
          ].map((feat) => (
            <div key={feat.title} className="p-7 rounded-2xl bg-[#18181B] border border-white/5 hover:border-white/10 transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-5`}>
                <feat.icon size={24} className={feat.iconColor} />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular Books ─────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Popular Books</h2>
            <p className="text-gray-500 text-sm mt-1">Free to read for all users</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_BOOKS.map((book) => (
            <Link
              href={`/reader/${book.id}`}
              key={book.id}
              className="group block p-6 rounded-2xl bg-[#18181B] border border-white/5 hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)] transition-all"
            >
              <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${book.color} flex items-center justify-center mb-5`}>
                <BookOpen size={36} className="text-white/30" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{book.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 shrink-0">
                  {book.tag}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-gray-600 group-hover:text-indigo-400 transition-colors font-medium">
                Read Now <ChevronRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Pricing ───────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Choose your plan
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Start free, upgrade when you're ready. Cancel anytime.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-8 rounded-2xl bg-[#18181B] border ${tier.color} transition-all ${
                tier.popular ? 'ring-1 ring-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.1)]' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold">
                  Most Popular
                </div>
              )}

              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${tier.badge} mb-4`}>
                {tier.name}
              </span>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-gray-500 text-sm">{tier.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${tier.ctaColor}`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────── */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 rounded-lg">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-500">Veda</span>
          </div>
          <p className="text-xs text-gray-600">
            © 2026 Veda. Built with Next.js, Supabase, and Groq AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
