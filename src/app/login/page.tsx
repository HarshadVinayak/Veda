"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { BookOpen, LogIn, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle OAuth session on component mount or redirect back
  useEffect(() => {
    const handleAuthChange = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setLoading(true);
        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single();

        if (profileError || !profile?.username) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    };

    handleAuthChange();
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          }
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
          >
            <BookOpen size={40} className="text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-black tracking-tighter text-white mb-2"
          >
            VEDA
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]"
          >
            Intelligence Reading Assistant
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Access your library</h2>
            <p className="text-gray-400 font-medium mb-10 text-sm">Sign in to sync your books and AI highlights.</p>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-16 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-4 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={22} />
                    Continue with Google
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Footer Props */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 grid grid-cols-3 gap-4"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-indigo-400">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Secure</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-purple-400">
              <Sparkles size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">AI Sync</span>
          </div>
           <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-amber-400">
              <Zap size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fast OCR</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
