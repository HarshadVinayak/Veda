"use client";

import React from "react";
import Link from "next/link";
import { Ghost, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <Ghost className="text-indigo-400" size={48} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">404</h1>
          <h2 className="text-xl font-bold">Page has vanished</h2>
          <p className="text-gray-400 font-medium">
            The page you're looking for doesn't exist in this version of reality.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 h-14 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
          >
            <Home size={20} />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
