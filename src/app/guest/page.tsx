"use client";
import React from 'react';
import Link from 'next/link';
import { QrCode, Clock, Umbrella, Gem } from 'lucide-react';

export default function GuestPortal() {
  const experiences = [
    { title: "Bed Service (QR Menu)", desc: "Bestel drankjes direct vanaf je strandbed.", icon: <QrCode className="w-8 h-8 text-amber-500" />, href: "/guest/menu" },
    { title: "Smart Waitlist", desc: "Krijg een seintje als er een bedje vrijkomt.", icon: <Clock className="w-8 h-8 text-blue-500" />, href: "/guest/waitlist" },
    { title: "Live Availability", desc: "Boek met live weer-gebaseerde prijzen.", icon: <Umbrella className="w-8 h-8 text-emerald-500" />, href: "/" },
    { title: "VIP Cabana Booking", desc: "Reserveer een cabana met pre-order flessen.", icon: <Gem className="w-8 h-8 text-purple-500" />, href: "/guest/vip" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
             <span className="text-3xl font-black text-white">VA</span>
          </div>
          <h1 className="text-4xl font-black mb-4">Viesa Beach Experience</h1>
          <p className="text-slate-400 text-lg">Interactieve demo portal voor de gast-voorkant. Kies wat je wilt testen.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp, i) => (
            <Link key={i} href={exp.href} className="group relative bg-slate-900 border border-white/10 p-6 rounded-2xl hover:bg-slate-800 transition-colors overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
                  {exp.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{exp.title}</h3>
                  <p className="text-slate-400 text-sm">{exp.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
