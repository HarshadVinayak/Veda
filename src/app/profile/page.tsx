"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { useUserStore } from '@/store/useStore';
import { GraduationCap, BookOpen, ShieldCheck, User } from 'lucide-react';

export default function ProfilePage() {
  const { tier, email, studyMode, readerMode, toggleStudyMode, toggleReaderMode } = useUserStore();

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#E4E4E6]">
      <Navbar tier={tier} isLoggedIn={true} />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl">
            <User size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{email || 'Veda User'}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-widest">
              {tier} Account
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Unlocked Roles Controls - Step 5 */}
          <div className="bg-[#18181B] border border-white/5 rounded-3xl p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-indigo-400" />
              Unlocked Roles
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#0E0E10] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer" onClick={toggleStudyMode}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${studyMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Study Mode</p>
                    <p className="text-xs text-gray-500">Enable AI Study Helper</p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full transition-colors relative ${studyMode ? 'bg-emerald-500' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${studyMode ? 'left-6' : 'left-1'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0E0E10] border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all cursor-pointer" onClick={toggleReaderMode}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${readerMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-gray-500'}`}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Reading Focus</p>
                    <p className="text-xs text-gray-500">Distraction-free UI</p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full transition-colors relative ${readerMode ? 'bg-indigo-500' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${readerMode ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#18181B] border border-white/5 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">Account Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm py-2 border-b border-white/5">
                <span className="text-gray-500">Reading Time</span>
                <span className="text-white">12.4 Hours</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-white/5">
                <span className="text-gray-500">Highlights Saved</span>
                <span className="text-white">84 Points</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-white/5">
                <span className="text-gray-500">Current Progress</span>
                <span className="text-white">65% Math 101</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
