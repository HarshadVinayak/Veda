"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#0E0E10] text-white flex flex-col items-center justify-center min-h-screen p-6 font-sans">
        <h1 className="text-4xl font-black mb-4">Critical Error</h1>
        <p className="text-gray-400 mb-8 max-w-md text-center">
          Veda encountered a system-level failure. Our AI is working to stabilize the platform.
        </p>
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all"
        >
          Recover System
        </button>
      </body>
    </html>
  );
}
