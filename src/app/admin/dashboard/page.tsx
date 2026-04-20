"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/useStore';
import Navbar from '@/components/Navbar';
import { Profile } from '@/types/database';
import { Users, ShieldCheck, Database, Upload, Trash2, Search, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
  const { tier, id: userId } = useUserStore();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0, booksUploaded: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tier === 'SUPER') {
      fetchAdminData();
    }
  }, [tier]);

  const fetchAdminData = async () => {
    const [profilesRes, booksRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('books').select('id', { count: 'exact' })
    ]);

    if (profilesRes.data) {
      setProfiles(profilesRes.data);
      setStats({
        totalUsers: profilesRes.data.length,
        premiumUsers: profilesRes.data.filter(p => p.tier === 'PREMIUM' || p.tier === 'SUPER').length,
        booksUploaded: booksRes.count || 0
      });
    }
    setLoading(false);
  };

  if (tier !== 'SUPER') {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Access Denied</h1>
          <p className="text-gray-500">Only Super Admins can access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-200">
      <Navbar isLoggedIn={true} tier={tier} />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
            <ShieldCheck className="text-emerald-400" size={32} /> Command Center
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Manage the Veda global library and user subscriptions.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<Users className="text-blue-400" />} label="Total Members" value={stats.totalUsers} />
          <StatCard icon={<ShieldCheck className="text-emerald-400" />} label="Active Subscriptions" value={stats.premiumUsers} />
          <StatCard icon={<Database className="text-purple-400" />} label="Library Index" value={stats.booksUploaded} />
        </div>

        {/* User Table */}
        <div className="bg-[#131316] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">User Management</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-600" size={18} />
              <input 
                placeholder="Search users..."
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-gray-600 uppercase font-black tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">User Identity</th>
                  <th className="px-6 py-4">Tier Status</th>
                  <th className="px-6 py-4">Joined At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">{profile.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                        profile.tier === 'FREE' ? 'bg-gray-500/10 text-gray-500' : 
                        profile.tier === 'STUDENT' ? 'bg-blue-500/10 text-blue-400' : 
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {profile.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors"><ExternalLink size={16} /></button>
                       <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-[#131316] border border-white/5 p-6 rounded-3xl shadow-xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-white/5 p-3 rounded-2xl">{icon}</div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-4xl font-black text-white tracking-tighter">{value.toLocaleString()}</p>
    </div>
  );
}
