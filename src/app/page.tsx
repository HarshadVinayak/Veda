"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  Highlighter, 
  GraduationCap, 
  Shield, 
  ArrowRight, 
  Search, 
  Mic, 
  Camera, 
  ChevronRight,
  Play,
  Languages
} from 'lucide-react';

const FEATURED_BOOKS = [
  { id: '1', title: 'The Bhagavad Gita', author: 'Vyasa', category: 'Classic', color: 'bg-orange-500/20' },
  { id: '2', title: 'Deep Work', author: 'Cal Newport', category: 'Productivity', color: 'bg-indigo-500/20' },
  { id: '3', title: 'Atomic Habits', author: 'James Clear', category: 'Growth', color: 'bg-emerald-500/20' },
];

/**
 * HomePage Component
 * High-end cinematic landing page for Veda.
 * Features: Search tabs, Tier previews, Premium animations.
 */
export default function HomePage() {
  const [searchTab, setSearchTab] = useState<'all' | 'study' | 'audio'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar tier="FREE_LISTENER" isLoggedIn={false} />

      {/* ── Hero / Search Section ──────────────────────────── */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles size={14} />
            The Future of Learning is Here
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl sm:text-8xl font-black mb-8 leading-[0.9] tracking-tighter"
          >
            Search less. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Know more.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-medium"
          >
            Veda is your second brain for reading. Highlight anything, 
            ask AI tutors, and listen in any language.
          </motion.p>

          {/* Search Module */}
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="relative max-w-2xl mx-auto group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-[#18181B] rounded-[1.8rem] border border-white/10 overflow-hidden shadow-2xl">
               {/* Tabs */}
               <div className="flex border-b border-white/5 bg-white/5">
                 {['all', 'study', 'audio'].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setSearchTab(tab as any)}
                     className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                       searchTab === tab ? 'text-white bg-white/5' : 'text-gray-500 hover:text-gray-300'
                     }`}
                   >
                     {tab}
                   </button>
                 ))}
               </div>
               
               {/* Input Area */}
               <div className="flex items-center p-2">
                 <div className="pl-4 text-gray-500">
                   <Search size={20} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Search books, chapters or solve sums..." 
                   className="flex-1 bg-transparent border-none py-4 px-4 text-white placeholder-gray-600 focus:outline-none font-medium"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <div className="flex items-center gap-2 pr-2">
                   <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-indigo-400 transition-colors">
                     <Mic size={20} />
                   </button>
                   <Link 
                    href="/upload"
                    className="p-3 bg-indigo-500 hover:bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20 transition-all"
                   >
                     <Camera size={20} />
                   </Link>
                 </div>
               </div>
            </div>
            
            {/* AI Results Teaser (Mock) */}
            <AnimatePresence>
              {searchQuery.length > 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-4 p-4 bg-[#18181B] border border-white/10 rounded-2xl shadow-2xl z-20 text-left"
                >
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-3">
                    <Sparkles size={14} />
                    AI AGENT SUGGESTION
                  </div>
                  <p className="text-sm text-gray-300">
                    "I see you're looking for '{searchQuery}'. I have indexed 5 books on this topic. Should I generate a summary of the core concepts for you?"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* ── Feature Grid ─────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Languages, title: 'Regional TTS', desc: 'Listen to any book in Hindi, Tamil, Telugu & Marathi with native AI voices.', color: 'text-orange-400' },
          { icon: Highlighter, title: 'Smart Vaults', desc: 'Sync your highlights across devices and get weekly AI reports.', color: 'text-indigo-400' },
          { icon: Shield, title: 'Root Control', desc: 'Direct access to global libraries for harish.ramamoorthy7@gmail.com.', color: 'text-pink-400' },
          { icon: GraduationCap, title: 'Study Agent', desc: 'Scan a Page No. and Sum No. to get step-by-step logic instantly.', color: 'text-emerald-400' },
        ].map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-[2rem] bg-[#18181B] border border-white/5 hover:border-indigo-500/30 transition-all group"
          >
            <div className={`mb-6 p-4 rounded-2xl bg-white/5 inline-flex ${feature.color}`}>
              <feature.icon size={24} />
            </div>
            <h3 className="text-white font-black text-xl mb-3 tracking-tight">{feature.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-semibold">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* ── Library Teaser ────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 w-full">
         <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Veda Library</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Free & Premium Content</p>
            </div>
            <Link href="/dashboard" className="text-indigo-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight size={16} />
            </Link>
         </div>

         <div className="grid sm:grid-cols-3 gap-8">
            {FEATURED_BOOKS.map((book) => (
              <Link key={book.id} href={`/reader/${book.id}`} className="group relative">
                <div className={`aspect-[3/4] rounded-[2.5rem] ${book.color} mb-6 flex items-center justify-center relative overflow-hidden`}>
                   <BookOpen size={48} className="text-white/20 group-hover:scale-125 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                      <div className="bg-white text-black p-4 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform">
                        <Play size={24} fill="currentColor" />
                      </div>
                   </div>
                </div>
                <h3 className="text-white font-bold text-lg">{book.title}</h3>
                <p className="text-gray-500 text-sm">{book.author}</p>
              </Link>
            ))}
         </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
               <BookOpen size={16} className="text-white" />
             </div>
             <span className="font-black text-white text-xl tracking-tighter uppercase">Veda</span>
           </div>
           <p className="text-gray-600 text-xs font-bold tracking-widest uppercase text-center sm:text-left">
             Built for Harish. Powered by Cerebras & Groq. © 2026
           </p>
           <div className="flex items-center gap-8 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
             <Link href="#" className="hover:text-white">Privacy</Link>
             <Link href="#" className="hover:text-white">Terms</Link>
             <Link href="#" className="hover:text-white">Support</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
