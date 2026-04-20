"use client";

import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, CheckCircle, X, Sparkles, Loader2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CameraScan({ onComplete }: { onComplete: (text: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      setError("Camera access denied or not available.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      stopCamera();
    }
  }, [stream]);

  const processOCR = async () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    try {
      // Send to our api/ocr route
      const resp = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: capturedImage })
      });
      const data = await resp.json();
      if (data.text) {
        onComplete(data.text);
      }
    } catch (err) {
      setError("OCR processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#131316] border border-white/5 rounded-3xl overflow-hidden flex flex-col items-center">
      <div className="relative w-full aspect-[3/4] bg-black group">
        {!capturedImage && (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={startCamera}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 flex items-center gap-3 transition-all"
                >
                  <Camera size={24} /> Enable Camera Scan
                </button>
              </div>
            )}
            {stream && (
              <button 
                onClick={capture}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-indigo-500 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20"
              >
                <div className="w-16 h-16 rounded-full border-2 border-black/10" />
              </button>
            )}
          </>
        )}

        {capturedImage && (
          <img src={capturedImage} className="w-full h-full object-contain" />
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => { setCapturedImage(null); startCamera(); }} className="p-3 bg-black/50 text-white rounded-xl backdrop-blur-md">
              <RefreshCw size={20} />
            </button>
        </div>
      </div>

      <div className="p-8 w-full">
        {error && <p className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>}
        
        {!capturedImage ? (
          <p className="text-gray-500 text-sm text-center">Position the book page clearly within the frame for best OCR results.</p>
        ) : (
          <div className="flex gap-4">
            <button 
              onClick={() => setCapturedImage(null)}
              className="flex-1 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold hover:bg-white/5"
            >
              Retake
            </button>
            <button 
              onClick={processOCR}
              disabled={isProcessing}
              className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {isProcessing ? 'Analyzing...' : 'Process Text'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
