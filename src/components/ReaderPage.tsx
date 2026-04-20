"use client";

import React, { useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { HighlightInsert, UserTier } from '@/types/database';
import StudySidebar from '@/components/StudySidebar';
import UpgradePrompt from '@/components/UpgradePrompt';
import { Highlighter, Brain, BookmarkPlus, ChevronLeft, ChevronRight, GraduationCap, Loader2 } from 'lucide-react';

interface ReaderPageProps {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  pages: string[];  // Array of page content strings
  userId: string;
  tier: UserTier;
  initialPage?: number;
  existingHighlights?: { text: string; page: number; lineIndex: number }[];
}

export default function ReaderPage({
  bookId,
  bookTitle,
  bookAuthor,
  pages,
  userId,
  tier,
  initialPage = 0,
  existingHighlights = [],
}: ReaderPageProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [studyOpen, setStudyOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [savedHighlights, setSavedHighlights] = useState<string[]>(
    existingHighlights.map(h => h.text)
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const readerRef = useRef<HTMLDivElement>(null);
  const canHighlight = tier === 'PREMIUM' || tier === 'SUPER';
  const canStudy = tier === 'STUDENT' || tier === 'SUPER';
  const totalPages = pages.length;

  const handleTextSelect = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setMenuPos(null);
      setSelectedText('');
      return;
    }
    const text = sel.toString().trim();
    if (text.length > 2) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setMenuPos({ x: rect.left + rect.width / 2, y: rect.top - 60 });
      setSelectedText(text);
    }
  }, []);

  const handleHighlight = async () => {
    if (!selectedText || !canHighlight) return;

    const payload: HighlightInsert = {
      user_id: userId,
      book_id: bookId,
      highlighted_text: selectedText,
      page_number: currentPage + 1,
      line_index: 0,
    };

    const { error } = await supabase.from('highlights').insert(payload as any);

    if (!error) {
      setSavedHighlights(prev => [...prev, selectedText]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
    setMenuPos(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleAIExplain = async () => {
    if (!selectedText) return;
    setAiLoading(true);
    setAiResponse('');

    try {
      const res = await fetch('/api/ai/helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contextText: selectedText,
          userQuery: 'Explain this passage clearly and concisely.',
          tier: tier,
          provider: 'groq',
        }),
      });

      if (!res.body) throw new Error('No response');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        const chunk = decoder.decode(value);
        // Parse streamed text
        setAiResponse(prev => prev + chunk);
      }
    } catch {
      setAiResponse('Failed to get AI response. Please try again.');
    } finally {
      setAiLoading(false);
      setMenuPos(null);
    }
  };

  // Render page content with highlights marked
  const renderContent = (text: string) => {
    if (savedHighlights.length === 0) return text;

    let result = text;
    // Simple highlight rendering — wrap matched text
    savedHighlights.forEach(h => {
      const escaped = h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(
        new RegExp(`(${escaped})`, 'gi'),
        '%%MARK_START%%$1%%MARK_END%%'
      );
    });

    return result;
  };

  const renderedContent = renderContent(pages[currentPage] || '');
  const contentParts = renderedContent.split(/(%%MARK_START%%|%%MARK_END%%)/);

  let insideMark = false;
  const contentElements = contentParts.map((part, i) => {
    if (part === '%%MARK_START%%') { insideMark = true; return null; }
    if (part === '%%MARK_END%%') { insideMark = false; return null; }
    if (insideMark) {
      return <mark key={i} className="bg-yellow-400/30 text-yellow-200 px-0.5 rounded">{part}</mark>;
    }
    return <span key={i}>{part}</span>;
  });

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#E4E4E6] flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#131316] border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white truncate max-w-xs sm:max-w-lg">{bookTitle}</h1>
          <p className="text-xs text-gray-500">{bookAuthor}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-mono">
            Page {currentPage + 1} / {totalPages}
          </span>
          {canStudy && (
            <button
              onClick={() => setStudyOpen(true)}
              className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-500/30 transition-all"
            >
              <GraduationCap size={16} />
              Study Helper
            </button>
          )}
        </div>
      </div>

      {/* Reader Body */}
      <div className="flex-1 flex justify-center relative">
        <div className="w-full max-w-3xl px-6 sm:px-12 py-12 relative">
          {/* Floating Selection Menu */}
          {menuPos && (
            <div
              className="fixed z-50 transform -translate-x-1/2 flex items-center gap-1 bg-[#1B1B1F] border border-white/10 p-1.5 rounded-xl shadow-2xl"
              style={{ top: menuPos.y, left: menuPos.x }}
            >
              {canHighlight ? (
                <button
                  onClick={handleHighlight}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                >
                  <Highlighter size={14} />
                  Highlight
                </button>
              ) : (
                <button disabled className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 cursor-not-allowed rounded-lg">
                  <Highlighter size={14} />
                  <span className="text-xs">Premium only</span>
                </button>
              )}
              <div className="w-px h-6 bg-white/10" />
              <button
                onClick={handleAIExplain}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
              >
                <Brain size={14} />
                AI Explain
              </button>
              <div className="w-px h-6 bg-white/10" />
              <button
                onClick={() => setMenuPos(null)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
              >
                <BookmarkPlus size={14} />
                Save
              </button>
            </div>
          )}

          {/* Success Toast */}
          {saveSuccess && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-6 py-3 rounded-xl text-sm font-medium shadow-lg">
              ✓ Highlight saved to Your Books!
            </div>
          )}

          {/* Book Content */}
          <div
            ref={readerRef}
            className="font-serif text-xl leading-[2] text-gray-300 selection:bg-indigo-500/40 selection:text-white"
            onMouseUp={handleTextSelect}
          >
            {contentElements}
          </div>

          {/* AI Response */}
          {(aiResponse || aiLoading) && (
            <div className="mt-10 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <h3 className="text-indigo-400 font-bold text-sm mb-3 flex items-center gap-2 uppercase tracking-wider">
                {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
                AI Explanation
              </h3>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {aiResponse || 'Analyzing the selected text...'}
              </div>
              {aiResponse && !aiLoading && (
                <button
                  onClick={() => setAiResponse('')}
                  className="mt-4 text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}

          {/* Free tier banner */}
          {tier === 'FREE' && (
            <div className="mt-12">
              <UpgradePrompt feature="Highlighting & AI Features" targetTier="PREMIUM" />
            </div>
          )}
        </div>
      </div>

      {/* Page Navigation */}
      <div className="bg-[#131316] border-t border-white/5 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {/* Page dots */}
        <div className="flex gap-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentPage
                  ? 'bg-indigo-500 w-6'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Study Sidebar */}
      <StudySidebar
        isOpen={studyOpen}
        onClose={() => setStudyOpen(false)}
        contextText={selectedText || pages[currentPage]?.substring(0, 500)}
      />
    </div>
  );
}
