"use client";

import React, { useState } from 'react';
import { X, Send, BookOpenCheck, Loader2 } from 'lucide-react';

interface StudySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  contextText?: string;
}

export default function StudySidebar({ isOpen, onClose, contextText = '' }: StudySidebarProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch('/api/ai/study-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: contextText || 'General study question',
          question: question,
          provider: 'groq',
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAnswer(data.answer);
      setHistory(prev => [{ q: question, a: data.answer }, ...prev]);
      setQuestion('');
    } catch (err: unknown) {
      setAnswer('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-[#131316] border-l border-white/5 z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-xl">
            <BookOpenCheck size={20} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Study Helper</h3>
            <p className="text-gray-500 text-xs">Powered by Llama 3 AI</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Context Banner */}
      {contextText && (
        <div className="mx-4 mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <p className="text-xs text-indigo-400 font-semibold mb-1">📖 Selected Context</p>
          <p className="text-xs text-gray-400 line-clamp-3 italic">"{contextText}"</p>
        </div>
      )}

      {/* Answer area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <div className="flex items-center gap-3 text-indigo-400 p-4">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Analyzing and solving...</span>
          </div>
        )}

        {answer && !loading && (
          <div className="bg-[#18181B] border border-white/5 rounded-2xl p-5">
            <p className="text-emerald-400 text-xs font-bold mb-3 uppercase tracking-wider">Step-by-step Solution</p>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {answer}
            </div>
          </div>
        )}

        {history.length > 1 && (
          <div className="pt-4 border-t border-white/5">
            <p className="text-gray-500 text-xs font-semibold mb-3 uppercase tracking-wider">Previous Questions</p>
            {history.slice(1).map((item, i) => (
              <details key={i} className="mb-2 bg-[#18181B] rounded-xl border border-white/5">
                <summary className="p-3 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                  {item.q}
                </summary>
                <div className="px-3 pb-3 text-xs text-gray-500 whitespace-pre-wrap">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        )}

        {!answer && !loading && history.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🧠</div>
            <p className="text-gray-500 text-sm">Ask me any question about your textbook.</p>
            <p className="text-gray-600 text-xs mt-1">I'll provide step-by-step solutions!</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Solve Sum 4 on Page 50..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            className="flex-1 bg-[#0E0E10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
