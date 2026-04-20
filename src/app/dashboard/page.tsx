"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import UserButton from "@/components/UserButton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Plus, 
  Camera, 
  Clock, 
  Bookmark, 
  Zap, 
  X,
  CreditCard,
  Sparkles
} from "lucide-react";

// --- Types ---
interface BookRecord {
  id: string;
  title: string;
  author: string;
  current_page: number;
  total_pages: number;
  last_read: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function DashboardPage() {
  const { profile, loading } = useUser();
  const [showSubModal, setShowSubModal] = useState(false);

  // Mock data for demo (fetched from supabase in real world)
  const [savedBooks] = useState<BookRecord[]>([
    { id: "1", title: "Atomic Habits", author: "James Clear", current_page: 45, total_pages: 320, last_read: "2 hours ago" },
    { id: "2", title: "Deep Work", author: "Cal Newport", current_page: 89, total_pages: 250, last_read: "Yesterday" },
    { id: "4", title: "The Psychology of Money", author: "Morgan Housel", current_page: 10, total_pages: 240, last_read: "3 days ago" },
  ]);

  const [continueReading] = useState<BookRecord[]>([
    { id: "3", title: "The Art of Learning", author: "Josh Waitzkin", current_page: 120, total_pages: 300, last_read: "Just now" },
  ]);

  const handleAction = () => {
    if (profile?.tier === "FREE_LISTENER") {
      setShowSubModal(true);
    } else {
      console.log("Action triggered");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0E10] text-white p-6">
        <header className="max-w-7xl mx-auto h-20 flex items-center justify-between mb-12">
          <div className="w-32 h-8 bg-white/5 animate-pulse rounded-xl" />
          <div className="w-12 h-12 bg-white/5 animate-pulse rounded-full" />
        </header>
        <main className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4">
            <div className="w-48 h-4 bg-white/5 animate-pulse rounded-full" />
            <div className="w-3/4 h-16 bg-white/5 animate-pulse rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-white/5 animate-pulse rounded-[2.5rem]" />
            <div className="h-48 bg-white/5 animate-pulse rounded-[2.5rem]" />
          </div>
          <div className="space-y-8">
            <div className="w-64 h-8 bg-white/5 animate-pulse rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-white/5 animate-pulse rounded-[2.5rem]" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0E0E10]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <BookOpen size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">VEDA</span>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            {profile && <UserButton user={profile} />}
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Welcome Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-3">
             <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
                <Sparkles size={12} className="text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Global Library Active</span>
             </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            {getGreeting()}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">{profile?.username || "Learner"}</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl">
            Your intelligence companion is ready. You've unlocked <span className="text-white font-bold">4 concepts</span> this week.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAction}
            className="group relative h-48 bg-[#18181B] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/50 hover:bg-white/[0.03] transition-all p-10 text-left"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Plus size={160} className="text-indigo-500" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <Plus size={32} className="text-indigo-400" />
              </div>
              <h3 className="text-3xl font-black mb-1">Upload PDF</h3>
              <p className="text-gray-500 font-bold text-sm tracking-wide">Sync digital documents to Veda</p>
            </div>
          </motion.button>

          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAction}
            className="group relative h-48 bg-[#18181B] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-purple-500/50 hover:bg-white/[0.03] transition-all p-10 text-left"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Camera size={160} className="text-purple-500" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <Camera size={32} className="text-purple-400" />
              </div>
              <h3 className="text-3xl font-black mb-1">Camera Scan</h3>
              <p className="text-gray-500 font-bold text-sm tracking-wide">Real-time OCR for physical books</p>
            </div>
          </motion.button>
        </motion.div>

        {/* Library Content */}
        <div className="space-y-16">
          {/* Continue Reading */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-amber-500" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter">In Progress</h2>
              </div>
              <Link href="/library" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline decoration-2 underline-offset-8">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {continueReading.map(book => (
                <BookCard key={book.id} book={book} variant="large" />
              ))}
            </div>
          </motion.section>

          {/* Saved Books */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <Bookmark size={20} className="text-indigo-400" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter">Your Library</h2>
              </div>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {savedBooks.map(book => (
                <BookCard key={book.id} book={book} variant="small" />
              ))}
            </motion.div>
          </motion.section>
        </div>
      </main>

      {/* Subscription Modal */}
      <AnimatePresence>
        {showSubModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#18181B] border border-white/10 w-full max-w-xl rounded-[3rem] p-12 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Mesh effects */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full" />
              
              <button 
                onClick={() => setShowSubModal(false)}
                className="absolute top-8 right-8 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X size={28} />
              </button>

              <div className="text-center relative z-10">
                <motion.div 
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                >
                  <Zap size={48} className="text-white fill-white" />
                </motion.div>
                <h2 className="text-4xl font-black mb-6 tracking-tighter italic">Evolve your reading</h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                  Free users get limited OCR & uploads. Unlock <span className="text-white font-bold">Unlimited Ingestion</span>, AI Flashcards, and Premium Audiobooks.
                </p>

                <div className="space-y-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-16 bg-white text-black rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
                  >
                    <CreditCard size={22} />
                    Upgrade Now - ₹299
                  </motion.button>
                  <button 
                    onClick={() => setShowSubModal(false)}
                    className="w-full h-16 bg-white/5 text-gray-400 rounded-2xl font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                  >
                    I'll stick with limited access
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BookCard({ book, variant }: { book: BookRecord, variant: "small" | "large" }) {
  const progress = (book.current_page / book.total_pages) * 100;

  return (
    <motion.div variants={itemVariants}>
    <Link 
      href={`/reader/${book.id}`}
      className={`group bg-[#18181B] border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/[0.02] hover:border-white/20 transition-all flex flex-col h-full hover:shadow-[0_0_40px_rgba(99,102,241,0.1)]`}
    >
      <div className="flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all group-hover:scale-110">
            <BookOpen size={28} />
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-full">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{book.last_read}</span>
          </div>
        </div>
        <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-1 tracking-tight mb-2">{book.title}</h3>
        <p className="text-gray-500 font-bold text-sm mb-6">{book.author}</p>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-end mb-3">
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Efficiency</span>
          <span className="text-sm font-black text-white">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </div>
    </Link>
    </motion.div>
  );
}
