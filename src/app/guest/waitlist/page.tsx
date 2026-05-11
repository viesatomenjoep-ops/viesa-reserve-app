"use client";
import React, { useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GuestWaitlistPage() {
  const { t } = useLanguage();
  const [joined, setJoined] = useState(false);

  return (
    <div className="min-h-screen bg-sand-gradient text-[#3d3935] flex flex-col justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#efe9db]/50 rounded-full blur-3xl pointer-events-none z-0"></div>
      
      <div className="relative z-10 max-w-md w-full mx-auto">
        {!joined ? (
          <div className="glass-panel p-10 rounded-3xl shadow-xl border border-white/50 relative">
            <div className="w-20 h-20 bg-white/70 rounded-full flex items-center justify-center mb-6 mx-auto border border-white/80 shadow-sm">
              <Bell className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-black font-serif text-center mb-3 text-stone-900">{t('waitlistFull')}</h1>
            <p className="text-stone-500 text-center mb-8 font-medium">{t('waitlistDesc')}</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-stone-500 mb-2 uppercase tracking-wider">{t('name')}</label>
                <input type="text" placeholder={t('waitlistNamePlaceholder')} className="w-full bg-white/70 border border-white/80 rounded-2xl px-5 py-4 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-500 mb-2 uppercase tracking-wider">{t('phone')}</label>
                <input type="tel" placeholder="+31 6 12345678" className="w-full bg-white/70 border border-white/80 rounded-2xl px-5 py-4 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-500 mb-2 uppercase tracking-wider">{t('waitlistDesiredZone')}</label>
                <select className="w-full bg-white/70 border border-white/80 rounded-2xl px-5 py-4 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none shadow-sm cursor-pointer">
                  <option>{t('waitlistZone1')}</option>
                  <option>{t('waitlistZone2')}</option>
                  <option>{t('waitlistZone3')}</option>
                </select>
              </div>
            </div>
            
            <button onClick={() => setJoined(true)} className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xl py-5 rounded-2xl shadow-xl mt-10 transition-all hover:-translate-y-1">
              {t('waitlistBtn')}
            </button>
          </div>
        ) : (
          <div className="glass-panel p-10 rounded-3xl shadow-xl border border-white/50 text-center relative">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 mx-auto border border-emerald-100 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-black font-serif text-stone-900 mb-4">{t('waitlistSuccess')}</h1>
            <p className="text-stone-500 font-medium mb-8 text-lg">{t('waitlistSuccessDesc')}</p>
            <button onClick={() => setJoined(false)} className="text-stone-400 font-bold hover:text-stone-900 transition-colors uppercase tracking-wider text-sm">{t('waitlistBack')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
