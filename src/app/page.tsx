"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import InteractiveMap from '@/components/InteractiveMap';
import type { Bed } from '@/components/AdminBedEditor';
import CheckoutDrawer from '@/components/CheckoutDrawer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  return (
    <main className="min-h-screen pb-24 relative overflow-hidden bg-black">
      {/* Premium Dark Mode Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />
      
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white mb-6 leading-tight drop-shadow-sm">
            {t('tagline')}
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed max-w-2xl mx-auto">
            {t('welcomeText')}
          </p>
        </div>

        <InteractiveMap onBedSelect={setSelectedBed} />
      </div>

      <CheckoutDrawer 
        bed={selectedBed} 
        onClose={() => setSelectedBed(null)} 
      />
    </main>
  );
}
