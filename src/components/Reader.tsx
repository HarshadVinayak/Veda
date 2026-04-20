"use client";
import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { HighlightInsert } from '@/types/database';

export function Reader({ bookId, userId }: { bookId: string; userId: string }) {
  const [highlightedText, setHighlightedText] = useState("");
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setMenuPos(null);
      setHighlightedText("");
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Calculate position relative to container or window
      setMenuPos({ x: rect.left + rect.width / 2, y: rect.top - 50 });
      setHighlightedText(text);
    }
  };

  const handleSave = async () => {
    if (!highlightedText) return;
    
    // In a real app we'd fetch the exact page
    const pageNumber = 1;
    const lineIndex = 0;

    const payload: HighlightInsert = {
      user_id: userId,
      book_id: bookId,
      highlighted_text: highlightedText,
      page_number: pageNumber,
      line_index: lineIndex,
    };

    const { error } = await supabase.from('highlights').insert(payload as any);

    if (error) {
      alert("Error saving highlight: " + error.message);
    } else {
      alert("Highlight saved successfully to Your Library!");
      setMenuPos(null);
    }
  };

  const handleAskAI = async () => {
    if (!highlightedText) return;
    setIsLoading(true);
    setAiResponse("");
    
    try {
      // Testing with STUDENT role for tutoring, or PREMIUM for summary.
      // We pass the user query as asking for help.
      const res = await fetch('/api/ai/helper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contextText: highlightedText,
          userQuery: 'Can you summarize or explain this concept?',
          tier: 'STUDENT', 
          provider: 'groq'
        })
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        
        // Very basic parsing for streamText streams, typically lines starting with 0:"text"
        const lines = chunkValue.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const text = JSON.parse(line.substring(2));
              setAiResponse((prev) => prev + text);
            } catch (e) {}
          }
        }
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {menuPos && (
        <div 
          className="fixed z-50 transform -translate-x-1/2 flex items-center gap-2 bg-[#1B1B1F] border border-white/10 p-2 rounded-xl shadow-2xl origin-bottom animate-in fade-in zoom-in duration-200"
          style={{ top: menuPos.y, left: menuPos.x }}
        >
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
          >
            Save Highlight
          </button>
          <div className="w-[1px] h-6 bg-white/10"></div>
          <button 
            onClick={handleAskAI}
            className="px-4 py-2 text-sm font-medium text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors flex items-center gap-2"
          >
            Ask AI Assistant
          </button>
        </div>
      )}

      <div 
        ref={containerRef}
        className="p-10 md:p-16 max-w-3xl mx-auto bg-[#131316] text-[#E4E4E6] rounded-2xl shadow-2xl relative overflow-hidden border border-white/5"
        onMouseUp={handleMouseUp}
      >
        <h2 className="text-4xl font-serif mb-10 text-white tracking-tight leading-tight">The Art of Learning</h2>
        
        <div className="text-xl leading-loose font-serif text-gray-300 relative z-10 selection:bg-indigo-500/40 selection:text-white">
          <p className="mb-8">
            Learning is not a spectator sport. The more actively you engage with the material, 
            the deeper your understanding becomes. When you read, don't just let the words 
            wash over you. Instead, interrogate the text. Ask questions, draw connections, 
            and highlight the passages that resonate with you.
          </p>
          <p className="mb-8">
            Mastery requires patience and deliberate practice. It's not about how fast you 
            can consume information, but rather how well you can synthesize it and apply it 
            to novel situations.
          </p>
        </div>
        
        {(aiResponse || isLoading) && (
          <div className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl relative z-20">
            <h3 className="text-indigo-400 font-semibold mb-2 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {isLoading && !aiResponse ? (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                ) : null}
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              AI Assistant Response
            </h3>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {aiResponse || "Analyzing the text..."}
            </div>
            {aiResponse && !isLoading && (
              <button 
                onClick={() => setAiResponse("")} 
                className="mt-4 text-xs tracking-wider uppercase text-gray-500 hover:text-white transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
