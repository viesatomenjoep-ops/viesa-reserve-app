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
    <div className="min-h-screen bg-sand-gradient text-[#3d3935] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl floating pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#efe9db]/50 rounded-full blur-3xl floating-delayed pointer-events-none"></div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-16">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/80 shadow-lg border border-white/50 flex items-center justify-center">
             <span className="text-4xl font-black text-stone-900 font-serif">VR</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 font-serif text-[#3d3935] tracking-tight">Viesa Beach Experience</h1>
          <p className="text-stone-500 text-xl font-medium">Interactieve demo portal voor de gast-voorkant. Kies wat je wilt testen.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp, i) => (
            <Link key={i} href={exp.href} className="group relative glass-panel p-8 rounded-3xl hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="relative z-10 flex gap-6 items-start">
                <div className="bg-white/60 shadow-sm border border-white/50 p-5 rounded-2xl group-hover:bg-white transition-colors">
                  {exp.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2 font-serif">{exp.title}</h3>
                  <p className="text-stone-500 text-base">{exp.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
