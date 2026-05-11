"use client";
import React from 'react';
import Link from 'next/link';
import { Map, Coffee, Users, TrendingUp, Star, LayoutDashboard, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-sand-gradient flex font-sans text-[#3d3935]">
      {/* Sidebar */}
      <aside className="w-72 glass-panel border-r border-white/50 flex flex-col hidden md:flex m-4 rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] z-20">
        <div className="p-8 border-b border-white/40">
          <h1 className="text-2xl font-black font-serif text-[#3d3935] tracking-tight flex flex-col">
            <span className="tracking-widest uppercase text-sm text-stone-500 font-sans mb-1">{t('adminBeheer')}</span>
            VIESA Reserve
          </h1>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all text-stone-600 hover:text-stone-900 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            <span>{t('adminDashboardTitle')}</span>
          </Link>
          <Link href="/admin/map" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all text-stone-600 hover:text-stone-900 font-medium">
            <Map className="w-5 h-5" />
            <span>{t('adminMapEditor')}</span>
          </Link>
          <Link href="/admin/pos" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all text-stone-600 hover:text-stone-900 font-medium">
            <Coffee className="w-5 h-5" />
            <span>{t('adminPOS')}</span>
          </Link>
          <Link href="/admin/menu" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all text-stone-600 hover:text-stone-900 font-medium">
            <Coffee className="w-5 h-5" />
            <span>{t('adminMenu')}</span>
          </Link>
          <Link href="/admin/waitlist" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all text-stone-600 hover:text-stone-900 font-medium">
            <Users className="w-5 h-5" />
            <span>{t('adminWaitlist')}</span>
          </Link>
          <Link href="/admin/yield" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all text-stone-600 hover:text-stone-900 font-medium">
            <TrendingUp className="w-5 h-5" />
            <span>{t('adminYield')}</span>
          </Link>
          <Link href="/admin/vip" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all text-stone-600 hover:text-stone-900 font-medium">
            <Star className="w-5 h-5" />
            <span>{t('adminVIP')}</span>
          </Link>
        </nav>
        
        {/* Link to Frontend */}
        <div className="p-6 border-t border-white/40 bg-white/30">
          <Link href="/" className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 hover:-translate-y-1 hover:shadow-amber-500/40 transition-all font-bold">
            <Globe className="w-5 h-5" />
            <span>{t('adminReturnWeb')}</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
