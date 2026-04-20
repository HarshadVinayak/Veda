"use client";

import React, { useState, useOptimistic, useTransition, useMemo } from 'react';
import { useBookStore, useUserStore } from '@/store/useStore';
import { UserTier } from '@/types/database';
import VirtualPageList from './VirtualPageList';
import ChatSidebar from '../ChatSidebar';
import { supabase } from '@/lib/supabase';
import { useTTS } from '@/hooks/useTTS';
import { Brain, Play, Pause, Square, Highlighter, ChevronLeft, ChevronRight, MessageSquareText, Globe, Users } from 'lucide-react';
import StudySidebar from '../StudySidebar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BetterReader({ bookId, pages }: { bookId: string; pages: string[] }) {
  const { activeBook, currentPage, setCurrentPage, highlights, addHighlight } = useBookStore();
  const { tier, studyMode } = useUserStore();
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [isPending, startTransition] = useTransition();
  const [studyOpen, setStudyOpen] = useState(false);

  // TTS Hook
  const { speak, pause, resume, stop, isSpeaking, isPaused, voices, selectedVoice, setSelectedVoice } = useTTS();

  // Optimistic UI for Highlights
  const [optimisticHighlights, addOptimisticHighlight] = useOptimistic(
    highlights,
    (state, newHighlight: any) => [...state, newHighlight]
  );

  const handleSaveHighlight = async () => {
    if (!selectedText) return;
    
    const newHighlight = {
      book_id: bookId,
      highlighted_text: selectedText,
      page_number: currentPage + 1,
      line_index: 0,
    };

    startTransition(async () => {
      addOptimisticHighlight(newHighlight);
      setMenuPos(null);
      
      const { data, error } = await (supabase.from('highlights') as any).insert([newHighlight]);
      if (!error && data) addHighlight(data[0]);
    });
  };

  const handleSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setMenuPos(null);
      return;
    }
    const text = sel.toString().trim();
    if (text.length > 0) {
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      setMenuPos({ x: rect.left + rect.width / 2, y: Math.max(0, rect.top - 60) });
      setSelectedText(text);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0E0E10] text-gray-200 font-sans overflow-hidden">
      {/* Top Controls */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#131316] z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-mono text-gray-500">Page {currentPage + 1} / {pages.length}</span>
          <button onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={() => isSpeaking ? (isPaused ? resume() : pause()) : speak(pages[currentPage])} className="p-2 hover:bg-white/10 rounded-lg text-indigo-400">
              {isSpeaking && !isPaused ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={stop} className="p-2 hover:bg-white/10 rounded-lg text-gray-500">
              <Square size={16} />
            </button>
          </div>
          
          {(studyMode || tier === 'STUDENT') && (
            <button onClick={() => setStudyOpen(true)} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-sm font-semibold">
              <Brain size={18} /> <span className="hidden sm:inline">Study Helper</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden" onMouseUp={handleSelection}>
        {menuPos && (
          <div className="fixed z-50 -translate-x-1/2 flex items-center gap-1 bg-[#1B1B1F] border border-white/10 p-1 rounded-xl shadow-2xl animate-in fade-in zoom-in" style={{ top: menuPos.y, left: menuPos.x }}>
            <button 
              onClick={handleSaveHighlight}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
            >
              <Highlighter size={14} /> Highlight
            </button>
            <div className="w-px h-6 bg-white/10" />
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-400 hover:bg-indigo-400/10 rounded-lg">
              <MessageSquareText size={14} /> Ask AI
            </button>
            <div className="w-px h-6 bg-white/10" />
            <button 
              onClick={async () => {
                // Task: Smart Dictionary via Groq
                const resp = await fetch('/api/ai/smart-dictionary', {
                  method: 'POST',
                  body: JSON.stringify({ word: selectedText, context: pages[currentPage] })
                });
                const data = await resp.json();
                alert(`${selectedText}: ${data.definition}`);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-400/10 rounded-lg"
            >
              <Globe size={14} /> Define
            </button>
            <div className="w-px h-6 bg-white/10" />
            <button 
              onClick={async () => {
                // Task: X-Ray via Gemini
                const resp = await fetch('/api/ai/x-ray', {
                  method: 'POST',
                  body: JSON.stringify({ character: selectedText, bookId })
                });
                const data = await resp.json();
                alert(`X-Ray - ${selectedText}: ${data.bio}`);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-400 hover:bg-purple-400/10 rounded-lg"
            >
              <Users size={14} /> X-Ray
            </button>
          </div>
        )}

        <VirtualPageList 
          pages={pages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          highlights={optimisticHighlights}
        />
      </div>

      <StudySidebar isOpen={studyOpen} onClose={() => setStudyOpen(false)} contextText={selectedText || pages[currentPage]} />
      <ChatSidebar bookId={bookId} bookTitle={activeBook?.title || 'Current Book'} />
    </div>
  );
}
