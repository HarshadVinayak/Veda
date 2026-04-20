"use client";

import React, { useState } from 'react';
import pdfToText from 'react-pdftotext';
import { Upload, FileText, CheckCircle, Loader2, Database, BookOpen, Globe, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import CameraScan from '@/components/scanner/CameraScan';

interface BookMetadata {
  title: string;
  author: string;
  publisher: string;
  grade: string;
  subject: string;
  content: string;
}

export default function AdminUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ name: string; status: 'success' | 'error' }[]>([]);
  const [metadata, setMetadata] = useState<Partial<BookMetadata>>({
    title: '',
    author: '',
    publisher: '',
    grade: '',
    subject: '',
    content: ''
  });

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const processAndUpload = async () => {
    setUploading(true);
    const newResults = [];

    for (const file of files) {
      try {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("File too large (>5MB)");
        }
        // Step 9: Extract text from PDF
        const text = await pdfToText(file);
        
        // Mock metadata extraction (in real case, send first few pages to Cerebras/Groq)
        const metadata: BookMetadata = {
          title: file.name.replace('.pdf', ''),
          author: 'Extracted Author',
          publisher: 'NCERT', // Default for now
          grade: 'Class 10',
          subject: 'General',
          content: text
        };

        // Upload to Supabase
        const { error } = await (supabase.from('books') as any).insert([{
          title: metadata.title,
          author: metadata.author,
          content_text: metadata.content,
          publisher_name: metadata.publisher,
          grade_level: metadata.grade,
          academic_category: metadata.subject,
          is_study_book: true
        }]);

        if (error) throw error;
        newResults.push({ name: file.name, status: 'success' as const });
      } catch (err) {
        console.error("Upload failed for", file.name, err);
        newResults.push({ name: file.name, status: 'error' as const });
      }
    }

    setResults(newResults);
    setUploading(false);
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-200">
      <Navbar tier="ROOT_USER" isLoggedIn={true} />
      
      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-red-500/20 p-3 rounded-2xl">
            <Database size={24} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Bulk Book Ingestor</h1>
            <p className="text-gray-500 text-sm">Upload academic PDFs (NCERT, Macmillan) to auto-extract text and metadata.</p>
          </div>
        </div>

        <div className="bg-[#18181B] border border-white/5 rounded-3xl p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe size={20} className="text-emerald-400" /> NCERT Meta-Scraper
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input 
              id="ncert-subject"
              type="text" 
              placeholder="Subject (e.g. Science)" 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500/50 outline-none"
            />
            <input 
              id="ncert-grade"
              type="text" 
              placeholder="Grade (e.g. Class 10)" 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500/50 outline-none"
            />
          </div>
          <button
            onClick={async () => {
              const subj = (document.getElementById('ncert-subject') as HTMLInputElement).value;
              const grade = (document.getElementById('ncert-grade') as HTMLInputElement).value;
              if (!subj || !grade) return;
              setUploading(true);
              const { fetchNcertBooks } = await import('@/lib/actions/fetch-ncert');
              const res = await fetchNcertBooks(subj, grade);
              setResults([{ name: `${subj} (${grade})`, status: res.success ? 'success' : 'error' }]);
              setUploading(false);
            }}
            disabled={uploading}
            className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-4 rounded-xl font-bold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-3"
          >
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <Globe size={20} />}
            Fetch from Open Library & NCERT
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#18181B] border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Camera className="text-blue-400" size={20} /> Live Camera Scan
            </h2>
            <CameraScan onComplete={(text) => {
              setMetadata({ ...metadata, content: text });
              alert("Text captured successfully!");
            }} />
          </div>

          <div className="bg-[#18181B] border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText size={20} className="text-indigo-400" /> Manual PDF Ingestion
            </h2>
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center hover:border-indigo-500/50 transition-all cursor-pointer bg-white/[0.02]"
            >
              <Upload size={48} className="text-gray-700 mb-4" />
              <p className="text-gray-400 font-medium">Drop educational PDF here</p>
              <p className="text-gray-600 text-xs mt-2">Max size: 5MB for academic usage</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-[#18181B] border border-white/5 rounded-3xl p-8">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-12 hover:border-indigo-500/30 transition-all cursor-pointer group mb-8">
            <Upload size={40} className="text-gray-600 group-hover:text-indigo-400 mb-4 transition-colors" />
            <p className="text-gray-400 font-medium">{files.length > 0 ? `${files.length} files selected` : 'Drop PDFs here or click to browse'}</p>
            <p className="text-xs text-gray-600 mt-2">Max 5MB per book (Free Tier limit)</p>
            <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFileChange} />
          </label>

          {files.length > 0 && (
            <div className="space-y-3 mb-8">
              {files.map(f => (
                <div key={f.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-sm">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-indigo-400" />
                    <span>{f.name}</span>
                  </div>
                  <span className="text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={processAndUpload}
            disabled={uploading || files.length === 0}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {uploading ? (
              <><Loader2 size={20} className="animate-spin" /> Processing AI Ingestion...</>
            ) : (
              <><BookOpen size={20} /> Process & Upload to Supabase</>
            )}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-10 space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Upload Results</h3>
            {results.map(r => (
              <div key={r.name} className={`p-4 rounded-2xl border flex items-center gap-3 ${r.status === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                <CheckCircle size={18} />
                <span className="text-sm font-medium">{r.name} — {r.status === 'success' ? 'Ready for Students' : 'Failed'}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
