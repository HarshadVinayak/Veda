"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Play, Volume2, Sparkles, Clock, Bookmark } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTTS } from '@/hooks/useTTS';
import { motion } from 'framer-motion';

export default function HomeFeed() {
  const [books, setBooks] = useState<any[]>([]);
  const [vibeQuery, setVibeQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const { speak } = useTTS();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data } = await supabase.from('books').select('*').limit(20);
    setBooks(data || []);
  };

  const handleVibeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    // Task: Mood-based search via Cerebras
    try {
      const resp = await fetch('/api/ai/vibe-search', {
        method: 'POST',
        body: JSON.stringify({ vibe: vibeQuery })
      });
      const data = await resp.json();
      // Filtering existing books for demo purposes, 
      // in production this would be a vector search on Supabase
      setBooks(books.filter(b => data.recommendedTitles.includes(b.title) || b.id === data.bestMatchId));
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const playTeaser = async (bookId: string, title: string, content: string) => {
    // Task: 15-second teaser script via Groq
    try {
      const resp = await fetch('/api/ai/teaser', {
        method: 'POST',
        body: JSON.stringify({ title, content })
      });
      const data = await resp.json();
      speak(data.teaser);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-200 p-6">
      {/* Vibe Search Header */}
      <div className="max-w-4xl mx-auto mb-12 pt-10">
        <h1 className="text-4xl font-black text-white mb-6 tracking-tight">What's your mood?</h1>
        <form onSubmit={handleVibeSearch} className="relative group">
          <input 
            value={vibeQuery}
            onChange={(e) => setVibeQuery(e.target.value)}
            placeholder="I want something spooky for a rainy night..."
            className="w-full bg-[#1B1B1F] border border-white/10 rounded-2xl px-6 py-5 text-lg focus:border-indigo-500 outline-none transition-all shadow-2xl pr-16"
          />
          <button type="submit" className="absolute right-4 top-4 p-3 bg-white text-black rounded-xl hover:scale-105 transition-transform">
            <Search size={22} />
          </button>
        </form>
      </div>

      {/* Discovery Rows */}
      <DiscoveryRow title="Trending Now" books={books.slice(0, 5)} onPlayTeaser={playTeaser} />
      <DiscoveryRow title="Quick 5-Minute Stories" books={books.slice(5, 10)} onPlayTeaser={playTeaser} />
      <DiscoveryRow title="Deep Learning" books={books.slice(10, 15)} onPlayTeaser={playTeaser} />
    </div>
  );
}

function DiscoveryRow({ title, books, onPlayTeaser }: { title: string, books: any[], onPlayTeaser: any }) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-400" /> {title}
        </h2>
        <button className="text-sm text-indigo-400 font-bold hover:underline">View All</button>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-6 px-4 no-scrollbar">
        {books.map((book) => (
          <motion.div 
            key={book.id}
            whileHover={{ y: -10 }}
            className="flex-shrink-0 w-48 group cursor-pointer"
          >
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 p-4 flex flex-col justify-end gap-2">
                <button 
                  onClick={() => onPlayTeaser(book.id, book.title, book.content_text)}
                  className="w-full bg-white text-black py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <Volume2 size={14} /> Listen Trailer
                </button>
                <button className="w-full bg-white/10 backdrop-blur-md text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/20">
                  <Play size={14} fill="white" /> Start Reading
                </button>
              </div>
              
              {/* Fallback pattern for cover if no image exists */}
              <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-purple-900/40 flex flex-col p-4">
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1">{book.academic_category || 'Novel'}</span>
                <span className="text-sm font-bold leading-tight line-clamp-3 text-white">{book.title}</span>
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-gray-200 truncate pr-4">{book.title}</h3>
            <p className="text-xs text-gray-500">{book.author}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
