"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { Language } from '../lib/translations';

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="font-serif text-2xl tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">VIESA</span>
            <span className="ml-2 font-sans text-sm tracking-widest text-stone-400 uppercase mt-1">Reserve</span>
          </div>

          {/* Navigation Links & Language Selector */}
          <div className="flex items-center space-x-6">
            {pathname === '/admin' ? (
              <Link href="/" className="text-sm font-bold text-stone-400 hover:text-emerald-400 transition-colors">
                View as Customer &rarr;
              </Link>
            ) : (
              <Link href="/admin" className="text-sm font-bold text-stone-400 hover:text-blue-400 transition-colors">
                Admin Dashboard &rarr;
              </Link>
            )}

            <div className="flex items-center space-x-2 border-l border-white/10 pl-6">
              <Globe className="w-4 h-4 text-stone-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-sm font-medium text-stone-200 focus:outline-none cursor-pointer uppercase [&>option]:bg-stone-900"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="nl">NL</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
