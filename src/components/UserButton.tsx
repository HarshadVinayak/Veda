"use client";

import React, { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  User, 
  Settings, 
  CreditCard, 
  Palette, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Shield,
  ChevronRight,
  Check,
  Moon,
  Sun,
  Monitor,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserButtonProps {
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
    tier: string;
    email?: string;
  };
}

export default function UserButton({ user }: UserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'personalization' | 'subscription'>('main');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Settings state (could be from a store, but local for now for simplicity in this component)
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [preferredModel, setPreferredModel] = useState('cerebras');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveTab('main');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const initials = user.username ? user.username.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "HV";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm shadow-lg overflow-hidden">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-bold text-white leading-tight">{user.username}</p>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{user.tier}</p>
        </div>
        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-3 w-72 bg-[#131316] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] z-50 overflow-hidden backdrop-blur-3xl"
          >
            {/* User Header */}
            <div className="p-5 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-bold">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user.username}</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold italic uppercase tracking-widest">
                  <ShieldCheck size={10} /> {user.tier} Tier
                </p>
              </div>
            </div>

            <div className="p-2">
              {activeTab === 'main' && (
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  <MenuButton 
                    icon={<Sparkles size={16} />} 
                    label="Personalization" 
                    sub 
                    onClick={() => setActiveTab('personalization')} 
                  />
                  <MenuButton 
                    icon={<CreditCard size={16} />} 
                    label="Subscription" 
                    sub 
                    onClick={() => setActiveTab('subscription')} 
                  />
                  <MenuButton 
                    icon={<User size={16} />} 
                    label="Account Settings" 
                    onClick={() => router.push('/profile/account')} 
                  />
                  
                  <div className="my-2 border-t border-dashed border-white/5 mx-2" />
                  
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Palette size={16} /> <span className="text-sm">Appearance</span>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                      <button onClick={() => setTheme('dark')} className={`p-1 rounded ${theme === 'dark' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Moon size={12} /></button>
                      <button onClick={() => setTheme('light')} className={`p-1 rounded ${theme === 'light' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Sun size={12} /></button>
                      <button onClick={() => setTheme('system')} className={`p-1 rounded ${theme === 'system' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Monitor size={12} /></button>
                    </div>
                  </div>

                  {user.tier === 'ROOT_USER' && (
                    <>
                      <div className="my-2 border-t border-dashed border-white/5 mx-2" />
                      <button
                        onClick={() => { router.push("/admin"); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-black text-indigo-400 hover:bg-indigo-500/10 transition-all group"
                      >
                        <Shield size={16} className="text-indigo-400" />
                        Admin Control
                      </button>
                    </>
                  )}

                  <div className="my-2 border-t border-dashed border-white/5 mx-2" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </motion.div>
              )}

              {activeTab === 'personalization' && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  <button onClick={() => setActiveTab('main')} className="text-[10px] text-gray-500 mb-2 hover:text-white uppercase font-bold tracking-widest px-3">← Back to Menu</button>
                  
                  <p className="px-3 text-[10px] text-gray-600 uppercase font-black mb-1 mt-4">AI Voice Speed</p>
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

                  <p className="px-3 text-[10px] text-gray-600 uppercase font-black mb-1 mt-2">Preferred AI Engine</p>
                  <div className="space-y-1">
                    <OptionButton label="Cerebras (Instant)" active={preferredModel === 'cerebras'} onClick={() => setPreferredModel('cerebras')} />
                    <OptionButton label="Groq (Powerful)" active={preferredModel === 'groq'} onClick={() => setPreferredModel('groq')} />
                    <OptionButton label="Gemini 1.5 (Multimodal)" active={preferredModel === 'gemini'} onClick={() => setPreferredModel('gemini')} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'subscription' && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  <button onClick={() => setActiveTab('main')} className="text-[10px] text-gray-500 mb-2 hover:text-white uppercase font-bold tracking-widest px-3">← Back to Menu</button>
                  <div className="p-4 text-center">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
                      <CreditCard size={32} />
                    </div>
                    <p className="text-sm font-bold text-white mb-2">Upgrade Veda</p>
                    <p className="text-[10px] text-gray-500 mb-6 font-medium">Unlock Unlimited Scans & Offline Reads</p>
                    <button className="w-full bg-gradient-to-tr from-indigo-600 to-purple-600 py-3 rounded-xl text-xs font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all">Manage Subscription</button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
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
        <div className="text-gray-500 group-hover:text-indigo-400 transition-colors">
          {icon}
        </div>
        <span className="font-medium">{label}</span>
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
