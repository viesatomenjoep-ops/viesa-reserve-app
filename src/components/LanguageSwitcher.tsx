"use client";
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../lib/translations';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-6 right-6 z-50 glass-panel rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
      <Globe className="w-5 h-5 text-amber-500" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent text-sm font-bold text-stone-900 focus:outline-none cursor-pointer uppercase appearance-none"
      >
        <option value="nl">NL</option>
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
      <div className="pointer-events-none text-xs text-stone-400">▼</div>
    </div>
  );
}
