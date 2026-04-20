"use client";

import React, { useState } from 'react';
import { useUserStore } from '@/store/useStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { supabase } from '@/lib/supabase';
import { 
  User, Settings, CreditCard, LogOut, Moon, Sun, Monitor, 
  ChevronRight, Volume2, Cpu, Check, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileDropdown() {
  const { email, tier } = useUserStore();
  const { theme, setTheme, voiceSpeed, setVoiceSpeed, preferredModelId, setPreferredModelId } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'personalization' | 'subscription'>('main');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 border-2 border-white/20 shadow-lg flex items-center justify-center text-white font-bold text-sm hover:scale-105 transition-transform"
      >
        {email?.[0].toUpperCase() || "H"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setActiveTab('main'); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-4 w-72 bg-[#131316] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  {email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white truncate w-44">{email}</p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold italic uppercase tracking-widest">
                    <ShieldCheck size={10} /> {tier || 'FREE'} Tier
                  </p>
                </div>
              </div>

              <div className="p-2">
                {activeTab === 'main' && (
                  <motion.div initial={{ x: -20 }} animate={{ x: 0 }}>
                    <MenuButton icon={<Settings size={16} />} label="Personalization" sub onClick={() => setActiveTab('personalization')} />
                    <MenuButton icon={<CreditCard size={16} />} label="Subscription" sub onClick={() => setActiveTab('subscription')} />
                    
                    <div className="my-2 border-t border-dashed border-white/5" />
                    
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-3 text-gray-400">
                        <Moon size={16} /> <span className="text-sm">Theme</span>
                      </div>
                      <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                        <button onClick={() => setTheme('dark')} className={`p-1 rounded ${theme === 'dark' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Moon size={12} /></button>
                        <button onClick={() => setTheme('light')} className={`p-1 rounded ${theme === 'light' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Sun size={12} /></button>
                        <button onClick={() => setTheme('system')} className={`p-1 rounded ${theme === 'system' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Monitor size={12} /></button>
                      </div>
                    </div>

                    <div className="my-2 border-t border-dashed border-white/5" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </motion.div>
                )}

                {activeTab === 'personalization' && (
                  <motion.div initial={{ x: 20 }} animate={{ x: 0 }}>
                    <button onClick={() => setActiveTab('main')} className="text-[10px] text-gray-500 mb-2 hover:text-white uppercase font-bold tracking-widest px-3">← Back</button>
                    
                    <p className="px-3 text-[10px] text-gray-600 uppercase font-black mb-1">AI Voice Speed</p>
                    <div className="px-3 pb-3">
                      <input 
                        type="range" min="0.5" max="2" step="0.1" 
                        value={voiceSpeed} 
                        onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-white/5 rounded-full appearance-none cursor-pointer" 
                      />
                      <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                        <span>Slow</span><span>{voiceSpeed}x</span><span>Fast</span>
                      </div>
                    </div>

                    <p className="px-3 text-[10px] text-gray-600 uppercase font-black mb-1">AI Model Engine</p>
                    <div className="space-y-1">
                      <OptionButton label="Cerebras (Llama 3.1)" active={preferredModelId === 'cerebras'} onClick={() => setPreferredModelId('cerebras')} />
                      <OptionButton label="Groq (Llama 3.3)" active={preferredModelId === 'groq'} onClick={() => setPreferredModelId('groq')} />
                      <OptionButton label="Gemini 1.5 Flash" active={preferredModelId === 'gemini'} onClick={() => setPreferredModelId('gemini')} />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'subscription' && (
                  <motion.div initial={{ x: 20 }} animate={{ x: 0 }}>
                    <button onClick={() => setActiveTab('main')} className="text-[10px] text-gray-500 mb-2 hover:text-white uppercase font-bold tracking-widest px-3">← Back</button>
                    <div className="p-3 text-center">
                      <p className="text-sm font-bold text-white mb-2">Upgrade Veda</p>
                      <button className="w-full bg-indigo-600 py-2 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors">Compare Plans</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuButton({ icon, label, sub, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-white/5 rounded-xl flex items-center justify-between group transition-colors"
    >
      <div className="flex items-center gap-3 group-hover:text-white transition-colors">
        {icon}
        <span>{label}</span>
      </div>
      {sub && <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400" />}
    </button>
  );
}

function OptionButton({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between rounded-xl transition-colors ${active ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-gray-500 hover:bg-white/5'}`}
    >
      <span>{label}</span>
      {active && <Check size={12} />}
    </button>
  );
}
