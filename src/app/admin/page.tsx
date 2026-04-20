"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Shield, Users, BookOpen, Plus, Trash2, Edit3, Eye, Search, BarChart3, TrendingUp } from 'lucide-react';

// Mock data
const MOCK_USERS = [
  { id: '1', email: 'alice@example.com', tier: 'ADULT', joined: '2026-01-15' },
  { id: '2', email: 'bob@example.com', tier: 'STUDENT', joined: '2026-02-20' },
  { id: '3', email: 'charlie@example.com', tier: 'FREE_LISTENER', joined: '2026-03-10' },
  { id: '4', email: 'diana@example.com', tier: 'FREE_LISTENER', joined: '2026-03-22' },
  { id: '5', email: 'eve@example.com', tier: 'ADULT', joined: '2026-04-01' },
];

const MOCK_BOOKS = [
  { id: '1', title: 'The Art of Learning', author: 'Josh Waitzkin', is_study: false, reads: 342 },
  { id: '2', title: 'Mathematics — Class 10', author: 'NCERT', is_study: true, reads: 1205 },
  { id: '3', title: 'Deep Work', author: 'Cal Newport', is_study: false, reads: 567 },
  { id: '4', title: 'Physics — Class 12', author: 'NCERT', is_study: true, reads: 890 },
];

const tierColors: Record<string, string> = {
  FREE_LISTENER: 'bg-gray-500/20 text-gray-400',
  ADULT: 'bg-amber-500/20 text-amber-400',
  STUDENT: 'bg-emerald-500/20 text-emerald-400',
  ROOT_USER: 'bg-indigo-500/20 text-indigo-400',
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'books'>('overview');
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'text-indigo-400' },
    { label: 'Total Books', value: '156', change: '+3', icon: BookOpen, color: 'text-emerald-400' },
    { label: 'Active Readers', value: '1,203', change: '+8%', icon: Eye, color: 'text-amber-400' },
    { label: 'Revenue', value: '₹42,350', change: '+22%', icon: TrendingUp, color: 'text-pink-400' },
  ];

  const sections = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'books' as const, label: 'Books', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#E4E4E6] font-sans">
      <Navbar tier="ROOT_USER" isLoggedIn={true} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-red-500/20 p-3 rounded-2xl">
            <Shield size={24} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Manage users, books, and platform settings.</p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-8">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === sec.id
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <sec.icon size={16} />
              {sec.label}
            </button>
          ))}
        </div>

        {/* ── Overview ────────────────────────── */}
        {activeSection === 'overview' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[#18181B] border border-white/5 rounded-2xl p-5">
                  <stat.icon size={20} className={stat.color} />
                  <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#18181B] border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Tier Distribution</h3>
              <div className="space-y-3">
                {[
                  { tier: 'FREE_LISTENER', count: 1842, pct: 65 },
                  { tier: 'ADULT', count: 604, pct: 21 },
                  { tier: 'STUDENT', count: 389, pct: 14 },
                  { tier: 'ROOT_USER', count: 1, pct: 0.1 },
                ].map((item) => (
                  <div key={item.tier} className="flex items-center gap-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tierColors[item.tier]} w-24 text-center`}>
                      {item.tier}
                    </span>
                    <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-16 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Users ────────────────────────── */}
        {activeSection === 'users' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#18181B] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div className="bg-[#18181B] border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS
                    .filter(u => u.email.includes(search.toLowerCase()))
                    .map((user) => (
                    <tr key={user.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-white">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tierColors[user.tier]}`}>
                          {user.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{user.joined}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                            <Edit3 size={14} />
                          </button>
                          <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Books ────────────────────────── */}
        {activeSection === 'books' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full bg-[#18181B] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <a
                href="/upload"
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
              >
                <Plus size={16} />
                Add Book
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {MOCK_BOOKS.map((book) => (
                <div key={book.id} className="bg-[#18181B] border border-white/5 rounded-2xl p-6 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                    <div className="flex items-center gap-3">
                      {book.is_study && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                          Study Book
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{book.reads} reads</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
