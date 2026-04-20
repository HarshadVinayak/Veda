"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { useBookStore, useUserStore } from '@/store/useStore';
import { useTTS } from '@/hooks/useTTS';
import { Send, Volume2, Bot, User, Loader2, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatSidebar({ bookId, bookTitle }: { bookId: string; bookTitle: string }) {
  const { currentPage, activeBook } = useBookStore();
  const { id: userId } = useUserStore();
  const { speak } = useTTS();
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract context from current book
  const contextText = activeBook?.content_text || "";

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      bookContext: contextText,
      bookId,
      userId: userId
    },
    initialMessages: [
      { id: '1', role: 'assistant', content: `Hi! I'm your AI guide for "${bookTitle}". How can I help you understand this book today?` }
    ]
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center gap-2"
        >
          <MessageSquare size={24} />
          <span className="font-bold hidden sm:inline">Ask AI</span>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-[#0E0E10] border-l border-white/5 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#131316]">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                  <Bot size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Reading Guide</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{bookTitle}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white p-2">
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
            >
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    m.role === 'user' ? 'bg-indigo-600' : 'bg-white/5 border border-white/10'
                  }`}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-indigo-400" />}
                  </div>
                  
                  <div className={`relative group max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-[#1B1B1F] text-gray-200 border border-white/5 rounded-tl-none line-height-relaxed'
                  }`}>
                    {m.content}
                    
                    {/* Step 14 Task 4: Speaker Icon */}
                    {m.role === 'assistant' && (
                      <button 
                        onClick={() => speak(m.content)}
                        className="absolute -right-10 top-2 p-2 rounded-lg bg-white/5 text-gray-500 opacity-0 group-hover:opacity-100 transition-all hover:text-indigo-400"
                        title="Read aloud"
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Loader2 size={16} className="text-indigo-400 animate-spin" />
                  </div>
                  <div className="bg-[#1B1B1F] text-gray-500 px-4 py-3 rounded-2xl rounded-tl-none italic text-xs animate-pulse">
                    AI is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-[#131316]">
              <div className="relative group">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about this chapter..."
                  className="w-full bg-[#1B1B1F] border border-white/10 text-white rounded-xl px-4 py-3 pr-12 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-gray-600 mt-3 text-center">
                Powered by Veda Fail-Safe AI Core
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
