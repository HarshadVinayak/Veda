import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AudioPlayer from "@/components/AudioPlayer";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veda | Knowledge in your Language",
  description: "Advanced AI-powered reading and listening platform for global and regional literature.",
  applicationName: "Veda",
  keywords: ["reading", "ai", "study", "regional languages", "audiobooks"],
  authors: [{ name: "Harish Ramamoorthy" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0E10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

/**
 * RootLayout Component
 * Clean, production-ready entry point for Veda.
 * Includes Inter and Outfit typography for a premium look.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0E0E10] text-[#E4E4E6] selection:bg-indigo-500/30 selection:text-white overflow-x-hidden font-sans">
        <Suspense fallback={<div className="fixed inset-0 bg-[#0E0E10] flex items-center justify-center">
          <div className="w-10 h-10 border-t-2 border-indigo-500 rounded-full animate-spin" />
        </div>}>
          <main className="flex-1 flex flex-col relative z-10">
            {children}
          </main>
        </Suspense>
        
        {/* Global UI Components */}
        <AudioPlayer />
        
        {/* Cinematic Backdrop Pattern */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
           <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
           <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </body>
    </html>
  );
}
