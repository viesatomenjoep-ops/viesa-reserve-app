"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Coffee, Users, TrendingUp, Star } from 'lucide-react';

export default function AdminDashboard() {
  const modules = [
    { title: "F&B Orders (POS)", desc: "Live bestellingen vanaf de strandbedjes", icon: <Coffee className="w-8 h-8 text-amber-500" />, href: "/admin/pos" },
    { title: "Smart Waitlist", desc: "Beheer de wachtlijst en no-shows", icon: <Users className="w-8 h-8 text-blue-500" />, href: "/admin/waitlist" },
    { title: "Dynamic Pricing", desc: "Regels voor prijsaanpassingen o.b.v. weer", icon: <TrendingUp className="w-8 h-8 text-emerald-500" />, href: "/admin/yield" },
    { title: "VIP Management", desc: "Minimum spends & Cabana beheer", icon: <Star className="w-8 h-8 text-purple-500" />, href: "/admin/vip" },
  ];

  return (
    <div className="p-10 relative overflow-hidden h-full">
      {/* Decorative Orbs */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-white/40 rounded-full blur-3xl floating pointer-events-none"></div>

      <div className="relative z-10 floating">
        <h1 className="text-4xl font-black font-serif text-[#3d3935] mb-2">Admin Dashboard</h1>
        <p className="text-stone-500 mb-10 text-lg">Kies een module om te beheren.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {modules.map((m, i) => (
          <Link key={i} href={m.href} className={`glass-panel p-8 rounded-3xl hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group ${i % 2 === 0 ? 'floating' : 'floating-delayed'}`}>
            <div className="flex items-start justify-between">
              <div className="flex gap-5">
                <div className="p-4 bg-white/60 shadow-sm rounded-2xl group-hover:bg-white transition-colors border border-white/50">
                  {m.icon}
                </div>
                <div>
                  <h3 className="font-bold font-serif text-2xl text-stone-900">{m.title}</h3>
                  <p className="text-stone-500 text-md mt-1">{m.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-stone-300 group-hover:text-amber-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
