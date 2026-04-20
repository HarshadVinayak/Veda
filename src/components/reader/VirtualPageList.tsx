"use client";

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VirtualReaderProps {
  pages: string[];
  currentPage: number;
  onPageChange: (page: number) => void;
  highlights: any[];
}

export default function VirtualPageList({ pages, currentPage, onPageChange, highlights }: VirtualReaderProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: pages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 800,
    overscan: 2,
  });

  // Handle intersection/page viewing
  React.useEffect(() => {
    rowVirtualizer.scrollToIndex(currentPage, { align: 'start' });
  }, [currentPage, rowVirtualizer]);

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-64px)] w-full overflow-y-auto scroll-smooth custom-scrollbar"
    >
      <div
        className="relative w-full mx-auto max-w-3xl"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            className="absolute top-0 left-0 w-full p-8 sm:p-12 mb-12 bg-[#131316] border border-white/5 shadow-2xl rounded-[2rem] transition-opacity"
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <div className="flex justify-between mb-8 border-b border-white/5 pb-4">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Page {virtualRow.index + 1}
              </span>
              <span className="text-xs text-gray-600 font-medium">BETTER KINDLE PRO</span>
            </div>
            
            <div className="font-serif text-xl leading-[2.2] text-gray-300 select-text">
              {pages[virtualRow.index]?.match(/[^.!?]+[.!?]+/g)?.map((sentence, i) => {
                const text = sentence.trim();
                const isHighlighted = highlights.some(h => 
                  h.page_number === virtualRow.index + 1 && 
                  h.highlighted_text.includes(text)
                );
                
                return (
                  <span 
                    key={i} 
                    className={cn(
                      "transition-all duration-300 rounded px-1", 
                      isHighlighted 
                        ? "bg-yellow-500/20 border-b-2 border-yellow-500/40 text-white" 
                        : "hover:bg-white/5"
                    )}
                  >
                    {sentence}{' '}
                  </span>
                );
              }) || pages[virtualRow.index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
