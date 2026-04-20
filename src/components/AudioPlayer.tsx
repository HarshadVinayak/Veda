"use client";

import React, { useState, useEffect } from 'react';
import { useBookStore, useUserStore } from '@/store/useStore';
import { useTTS } from '@/hooks/useTTS';
import { Play, Pause, SkipForward, SkipBack, Volume2, X, Music, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioPlayer() {
  const { activeBook: book, currentPage, setCurrentPage } = useBookStore();
  const { speak, pause, resume, stop, isSpeaking, isPaused } = useTTS();
  const [intro, setIntro] = useState<string | null>(null);
  const [loadingIntro, setLoadingIntro] = useState(false);

  // Step 15 Task 1: Generate Dramatic Intro via Cerebras
  const generateIntro = async () => {
    setLoadingIntro(true);
    try {
      const resp = await fetch('/api/ai/dramatic-intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: book?.title, 
          context: book?.content_text.slice(0, 1000) 
        })
      });
      const data = await resp.json();
      setIntro(data.intro);
    } catch (err) {
      console.error("Intro generation failed", err);
    } finally {
      setLoadingIntro(false);
    }
  };

  const handlePlay = () => {
    if (isPaused) {
      resume();
    } else {
      const fullText = intro ? `${intro}\n\n${book?.content_text}` : book?.content_text;
      speak(fullText || "");
    }
  };

  if (!book) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 w-full h-24 bg-[#131316]/95 backdrop-blur-xl border-t border-white/5 z-[60] px-6 py-2 flex items-center justify-between"
    >
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-12 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg shadow-lg flex items-center justify-center">
          <Music size={20} className="text-white/50" />
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold text-white truncate">{book.title}</h4>
          <p className="text-xs text-gray-500 truncate">Listening to Page {currentPage + 1}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6">
          <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} className="text-gray-400 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={handlePlay}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isSpeaking && !isPaused ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button onClick={() => setCurrentPage(Math.min(book.content_text.split('\n\n').length - 1, currentPage + 1))} className="text-gray-400 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        
        {/* Step 15 Task 1: Dramatic Intro Trigger */}
        {!intro && !loadingIntro && (
          <button 
            onClick={generateIntro}
            className="text-[10px] text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors uppercase font-bold tracking-tighter"
          >
            <Sparkles size={10} /> Get AI Intro
          </button>
        )}
        {loadingIntro && <span className="text-[10px] text-gray-600 animate-pulse uppercase font-bold tracking-tighter">Crafting Intro...</span>}
        {intro && <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-tighter">AI Intro Ready</span>}
      </div>

      <div className="flex items-center justify-end gap-4 w-1/3">
        <div className="flex items-center gap-2 group">
          <Volume2 size={18} className="text-gray-500 group-hover:text-indigo-400 transition-colors" />
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-indigo-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
