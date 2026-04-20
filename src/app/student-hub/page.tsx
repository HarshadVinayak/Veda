"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import StudySidebar from '@/components/StudySidebar';
import Link from 'next/link';
import { BookOpen, GraduationCap, Calculator, FlaskConical, Globe2, BookText, Brain, ChevronRight, TrendingUp } from 'lucide-react';

const STUDY_BOOKS = [
  {
    id: 'math-10',
    title: 'Mathematics – Class 10',
    subject: 'Mathematics',
    grade: '10th Grade',
    icon: Calculator,
    color: 'from-blue-500/20 to-cyan-500/20',
    textColor: 'text-blue-400',
    chapters: 15,
  },
  {
    id: 'science-10',
    title: 'Science – Class 10',
    subject: 'Science',
    grade: '10th Grade',
    icon: FlaskConical,
    color: 'from-emerald-500/20 to-teal-500/20',
    textColor: 'text-emerald-400',
    chapters: 16,
  },
  {
    id: 'social-10',
    title: 'Social Science – Class 10',
    subject: 'Social Science',
    grade: '10th Grade',
    icon: Globe2,
    color: 'from-amber-500/20 to-orange-500/20',
    textColor: 'text-amber-400',
    chapters: 24,
  },
  {
    id: 'english-10',
    title: 'English Literature – Class 10',
    subject: 'English',
    grade: '10th Grade',
    icon: BookText,
    color: 'from-purple-500/20 to-pink-500/20',
    textColor: 'text-purple-400',
    chapters: 12,
  },
  {
    id: 'math-12',
    title: 'Mathematics – Class 12',
    subject: 'Mathematics',
    grade: '12th Grade',
    icon: Calculator,
    color: 'from-indigo-500/20 to-violet-500/20',
    textColor: 'text-indigo-400',
    chapters: 13,
  },
  {
    id: 'physics-12',
    title: 'Physics – Class 12',
    subject: 'Physics',
    grade: '12th Grade',
    icon: FlaskConical,
    color: 'from-rose-500/20 to-red-500/20',
    textColor: 'text-rose-400',
    chapters: 15,
  },
];

export default function StudentHubPage() {
  const [studyOpen, setStudyOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const grades = ['all', '10th Grade', '12th Grade'];
  const filteredBooks = selectedGrade === 'all'
    ? STUDY_BOOKS
    : STUDY_BOOKS.filter(b => b.grade === selectedGrade);

  // Mock stats
  const stats = [
    { label: 'Problems Solved', value: '47', icon: Brain, color: 'text-emerald-400' },
    { label: 'Study Hours', value: '23.5', icon: TrendingUp, color: 'text-indigo-400' },
    { label: 'Books Accessed', value: '6', icon: BookOpen, color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#E4E4E6] font-sans">
      <Navbar tier="STUDENT" isLoggedIn={true} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <GraduationCap size={14} />
              Student Plan Active
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Study Hub</h1>
            <p className="text-gray-500">Your AI-powered study companion. Access all study materials and get step-by-step help.</p>
          </div>
          <button
            onClick={() => setStudyOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all"
          >
            <Brain size={18} />
            Open Study Helper
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#18181B] border border-white/5 rounded-2xl p-5 text-center">
              <stat.icon size={22} className={`${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Grade Filter */}
        <div className="flex gap-2 mb-8">
          {grades.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedGrade === grade
                  ? 'bg-white/10 text-white border border-white/10'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {grade === 'all' ? 'All Grades' : grade}
            </button>
          ))}
        </div>

        {/* Book Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <Link
              href={`/reader/${book.id}`}
              key={book.id}
              className="group block p-6 rounded-2xl bg-[#18181B] border border-white/5 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${book.color} flex items-center justify-center mb-4`}>
                <book.icon size={26} className={book.textColor} />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-1">
                {book.title}
              </h3>
              <p className="text-xs text-gray-500 mb-4">{book.grade} • {book.chapters} chapters</p>
              <div className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-emerald-400 transition-colors font-medium">
                Start Reading <ChevronRight size={12} />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Study Helper Button */}
        <button
          onClick={() => setStudyOpen(true)}
          className="sm:hidden fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] z-40"
        >
          <Brain size={24} />
        </button>
      </main>

      <StudySidebar isOpen={studyOpen} onClose={() => setStudyOpen(false)} />
    </div>
  );
}
