"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserTier } from "@/types/database";

export default function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
    };
    checkUser();
  }, [router]);

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // 1. Check if username is already taken
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username.trim())
        .single();

      if (existingUser) {
        throw new Error("This username is already claimed. Choose another.");
      }

      // 2. Fetch current profile to preserve tier (for Root users)
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("tier")
        .eq("id", user.id)
        .single();

      // 3. Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          username: username.trim(),
          avatar_url: (user.user_metadata?.avatar_url as string | null) || null,
          tier: (currentProfile?.tier || "FREE_LISTENER") as UserTier,
        } as any)
        .eq("id", user.id);

      if (profileError) throw profileError;

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save username");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2rem] shadow-xl mb-6"
          >
            <Sparkles className="text-indigo-400" size={40} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-white mb-2 tracking-tight"
          >
            Define your self.
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="text-gray-500 font-medium"
          >
            How should Veda address you?
          </motion.p>
        </div>

        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleFinish} 
          className="space-y-6"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
            <div className="relative">
              <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full h-16 bg-[#18181B]/80 backdrop-blur-xl border border-white/10 rounded-2xl pl-14 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="text-red-400 text-sm text-center font-bold bg-red-400/5 py-4 rounded-xl border border-red-400/20"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full h-16 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Confirm Identity
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
