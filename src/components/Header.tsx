"use client";

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { Language } from '../lib/translations';

export default function Header() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="font-serif text-2xl tracking-widest text-stone-900">VIESA</span>
            <span className="ml-2 font-sans text-sm tracking-widest text-stone-500 uppercase mt-1">Reserve</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-stone-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-sm font-medium text-stone-700 focus:outline-none cursor-pointer uppercase"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="nl">NL</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
