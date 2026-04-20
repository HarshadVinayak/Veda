"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle, 
  Loader2, 
  Camera, 
  Sparkles, 
  Search, 
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * UploadPage Component
 * Cinematic upload and camera scan interface.
 * Implements Tier-based checks and OCR teaser.
 */
export default function UploadPage() {
  const [tab, setTab] = useState<'upload' | 'scan'>('upload');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isStudyBook, setIsStudyBook] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // OCR Scan state
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    await new Promise(r => setTimeout(r, 1500));
    setUploading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setTitle('');
      setAuthor('');
      setContent('');
    }, 3000);
  };

  const handleScan = async () => {
    setScanning(true);
    // In production: call Google Vision API or internal OCR endpoint
    await new Promise(r => setTimeout(r, 2000));
    setScanResult("Captured Text: 'The philosophy of learning is not just about memorization but about building mental models that allow for rapid pattern recognition...'");
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#E4E4E6] font-sans overflow-x-hidden">
      <Navbar tier="ROOT_USER" isLoggedIn={true} />

      <main className="max-w-3xl mx-auto px-6 py-16 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -z-10" />

        <div className="mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4 italic">Ingest Knowledge.</h1>
          <p className="text-gray-500 font-medium">Add digital PDFs or scan physical book pages with AI.</p>
        </div>

        {/* Tab System */}
        <div className="flex gap-1 bg-[#18181B] p-1.5 rounded-2xl mb-8 border border-white/5 max-w-sm">
           <button 
            onClick={() => setTab('upload')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${tab === 'upload' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:text-white'}`}
           >
             Digital PDF
           </button>
           <button 
            onClick={() => setTab('scan')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${tab === 'scan' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-white'}`}
           >
             Camera Scan
           </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'upload' ? (
            <motion.form 
              key="upload-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div className="bg-[#18181B] border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <FileText size={120} className="text-white" />
                </div>

                {success && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3"
                  >
                    <CheckCircle size={22} className="text-emerald-400" />
                    <p className="text-emerald-400 font-bold text-sm">Transmission complete. Book indexed.</p>
                  </motion.div>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Book Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Enter title"
                      className="w-full bg-[#0E0E10] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                      placeholder="Enter author"
                      className="w-full bg-[#0E0E10] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Raw Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={8}
                    placeholder="Paste text contents for AI indexing..."
                    className="w-full bg-[#0E0E10] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 transition-all font-bold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading || !title || !author}
                  className="w-full h-16 bg-white text-black rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={24} className="animate-spin" /> : <><UploadIcon size={20} /> Index to Library</>}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="scan-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="aspect-video bg-[#18181B] border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-purple-500/30 transition-all">
                {scanning ? (
                   <div className="text-center space-y-4">
                      <Loader2 size={48} className="animate-spin text-purple-500 mx-auto" />
                      <p className="text-sm font-black text-purple-400 uppercase tracking-widest animate-pulse">Running Vision AI...</p>
                   </div>
                ) : scanResult ? (
                   <div className="p-12 text-center">
                      <div className="mb-6 p-4 bg-emerald-500/10 rounded-full inline-flex">
                        <CheckCircle size={32} className="text-emerald-400" />
                      </div>
                      <p className="text-gray-400 font-medium italic mb-6">"{scanResult}"</p>
                      <button onClick={() => setScanResult(null)} className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Capture Again</button>
                   </div>
                ) : (
                  <>
                    <Camera size={64} className="text-gray-700 mb-6 group-hover:scale-110 group-hover:text-purple-500 transition-all" />
                    <button 
                      onClick={handleScan}
                      className="bg-white text-black px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
                    >
                      <Sparkles size={20} /> Activate Vision OCR
                    </button>
                  </>
                )}
                
                {/* Decorative UI elements */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10 rounded-tl-2xl" />
                <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/10 rounded-tr-2xl" />
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/10 rounded-bl-2xl" />
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10 rounded-br-2xl" />
              </div>
              
              <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={16} className="text-indigo-400" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">AI Tip</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Camera scans are handled by our Ultra-Fast OCR engine. Free users get 2 scans/day. Root Users have unlimited access.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
