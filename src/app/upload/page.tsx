"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Upload as UploadIcon, FileText, X, CheckCircle, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isStudyBook, setIsStudyBook] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // Simulate upload delay
    await new Promise(r => setTimeout(r, 1500));

    // In production: save to Supabase books table
    setUploading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setTitle('');
      setAuthor('');
      setContent('');
      setIsStudyBook(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#E4E4E6] font-sans">
      <Navbar tier="PREMIUM" isLoggedIn={true} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Upload a Book</h1>
          <p className="text-gray-500">Add your own stories, documents, or study materials.</p>
        </div>

        {success && (
          <div className="mb-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
            <CheckCircle size={22} className="text-emerald-400" />
            <p className="text-emerald-400 font-medium text-sm">Book uploaded successfully! It's now available in your library.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#18181B] border border-white/5 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Book Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. The Art of Learning"
                className="w-full bg-[#0E0E10] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                placeholder="e.g. Josh Waitzkin"
                className="w-full bg-[#0E0E10] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={12}
                placeholder="Paste the book content here, or upload a file below..."
                className="w-full bg-[#0E0E10] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm resize-none"
              />
            </div>

            {/* File Upload Zone */}
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-indigo-500/30 transition-colors cursor-pointer">
              <UploadIcon size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-1">Drag & drop a file here, or click to browse</p>
              <p className="text-xs text-gray-600">Supports .txt, .pdf, .epub (max 10MB)</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="studyBook"
                checked={isStudyBook}
                onChange={(e) => setIsStudyBook(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-[#0E0E10] text-indigo-500 focus:ring-indigo-500/30"
              />
              <label htmlFor="studyBook" className="text-sm text-gray-400">
                This is a study/educational book (visible to Student tier users)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !title || !author}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-sm hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileText size={18} />
                Upload Book
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
