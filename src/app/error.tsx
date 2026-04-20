"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
            <AlertTriangle className="text-red-500" size={48} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Something went wrong</h1>
          <p className="text-gray-400 font-medium">
            Veda encountered an unexpected error. Don't worry, your library is safe.
          </p>
        </div>

        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-left overflow-auto max-h-40">
          <code className="text-xs text-red-300/80 font-mono">
            {error.message || "An unknown error occurred."}
          </code>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="flex-1 h-14 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
          >
            <RefreshCcw size={20} />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <Home size={20} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
