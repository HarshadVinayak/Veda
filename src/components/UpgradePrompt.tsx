"use client";

import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface UpgradePromptProps {
  feature: string;
  targetTier: 'PREMIUM' | 'STUDENT';
}

export default function UpgradePrompt({ feature, targetTier }: UpgradePromptProps) {
  const price = targetTier === 'PREMIUM' ? '₹150' : '₹100';
  const gradient = targetTier === 'PREMIUM' 
    ? 'from-amber-500 to-orange-600' 
    : 'from-emerald-500 to-teal-600';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#18181B] p-8 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
          <Lock size={28} className="text-gray-500" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Unlock {feature}
        </h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          Upgrade to {targetTier} tier for just {price}/month to access this feature and much more.
        </p>

        <Link
          href="/login"
          className={`inline-flex items-center gap-2 bg-gradient-to-r ${gradient} text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all`}
        >
          <Sparkles size={16} />
          Upgrade to {targetTier} — {price}
        </Link>
      </div>
    </div>
  );
}
