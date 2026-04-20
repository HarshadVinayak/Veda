"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/useStore';
import Navbar from '@/components/Navbar';
import { BookOpen, Sparkles, Download, Trash2, ChevronRight, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HighlightsVault() {
  const { id: userId, tier } = useUserStore();
  const [highlightsByBook, setHighlightsByBook] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [explainingId, setExplainingId] = useState<string | null>(null);

  useEffect(() => {
    if (userId) fetchHighlights();
  }, [userId]);

  const fetchHighlights = async () => {
    const { data, error } = await supabase
      .from('highlights')
      .select('*, books(title)')
      .eq('user_id', userId as string);

    if (data) {
      const grouped = data.reduce((acc: any, h: any) => {
        const title = h.books?.title || 'Unknown Book';
        if (!acc[title]) acc[title] = [];
        acc[title].push(h);
        return acc;
      }, {});
      setHighlightsByBook(grouped);
    }
    setLoading(false);
  };

  const handleAiExplain = async (highlightId: string, text: string) => {
    setExplainingId(highlightId);
    try {
      const resp = await fetch('/api/ai/helper', {
        method: 'POST',
        body: JSON.stringify({ context: text, taskType: 'SIMPLIFY' })
      });
      const data = await resp.json();
      
      // Update local state with explanation
      const newGrouped = { ...highlightsByBook };
      Object.keys(newGrouped).forEach(bookTitle => {
        newGrouped[bookTitle] = newGrouped[bookTitle].map((h: any) => 
          h.id === highlightId ? { ...h, ai_explanation: data.answer } : h
        );
      });
      setHighlightsByBook(newGrouped);
    } catch (err) {
      console.error(err);
    } finally {
      setExplainingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-200">
      <Navbar isLoggedIn={!!userId} tier={tier} />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
              <Bookmark className="text-indigo-500" size={32} /> Highlights Vault
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Your personal knowledge bank, powered by AI.</p>
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all">
            <Download size={18} /> Export as PDF
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-12">
            {Object.keys(highlightsByBook).length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                <Bookmark size={48} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-500 font-medium">No highlights yet. Start reading to fill your vault!</p>
              </div>
            ) : (
              Object.keys(highlightsByBook).map((bookTitle) => (
                <section key={bookTitle} className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-white/5" />
                    <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest">{bookTitle}</h2>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {highlightsByBook[bookTitle].map((h: any) => (
                      <HighlightCard 
                        key={h.id} 
                        highlight={h} 
                        onAiExplain={handleAiExplain}
                        isExplaining={explainingId === h.id}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function HighlightCard({ highlight, onAiExplain, isExplaining }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#131316] border border-white/5 rounded-3xl p-6 hover:border-indigo-500/30 transition-all shadow-2xl flex flex-col group"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">
          Page {highlight.page_number}
        </span>
        <button className="text-gray-600 hover:text-red-400 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      <p className="text-white text-lg font-medium leading-relaxed mb-6 italic">
        "{highlight.highlighted_text}"
      </p>

      <AnimatePresence>
        {highlight.ai_explanation && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-6 p-4 bg-indigo-500/5 border-l-2 border-indigo-500 rounded-r-2xl"
          >
            <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <Sparkles size={12} /> AI Insight
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {highlight.ai_explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => onAiExplain(highlight.id, highlight.highlighted_text)}
        disabled={isExplaining}
        className="mt-auto w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
      >
        {isExplaining ? (
          <div className="w-4 h-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        ) : (
          <Sparkles size={14} className="text-indigo-400" />
        )}
        {highlight.ai_explanation ? 'Refresh Insight' : 'Explain Why Important'}
      </button>
    </motion.div>
  );
}
