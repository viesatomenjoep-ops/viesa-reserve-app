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
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
      <p className="text-slate-500 mb-8">Kies een module om te beheren.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((m, i) => (
          <Link key={i} href={m.href} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                  {m.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{m.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{m.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
