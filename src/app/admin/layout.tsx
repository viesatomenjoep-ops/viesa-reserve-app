import React from 'react';
import Link from 'next/link';
import { Map, Coffee, Users, TrendingUp, Star, LayoutDashboard, Globe } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight">Viesa Admin</h1>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/map" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Map className="w-5 h-5" />
            <span>Map Editor</span>
          </Link>
          <Link href="/admin/pos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Coffee className="w-5 h-5" />
            <span>F&B Orders (POS)</span>
          </Link>
          <Link href="/admin/menu" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Coffee className="w-5 h-5" />
            <span>Menu Beheer</span>
          </Link>
          <Link href="/admin/waitlist" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="w-5 h-5" />
            <span>Smart Waitlist</span>
          </Link>
          <Link href="/admin/yield" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span>Dynamic Pricing</span>
          </Link>
          <Link href="/admin/vip" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Star className="w-5 h-5" />
            <span>VIP Management</span>
          </Link>
        </nav>
        
        {/* Link to Frontend */}
        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors font-bold">
            <Globe className="w-5 h-5" />
            <span>Naar Voorkant (Website)</span>
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
