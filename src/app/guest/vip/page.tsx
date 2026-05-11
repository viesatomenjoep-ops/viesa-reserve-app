"use client";
import React, { useState, useEffect } from 'react';
import { Star, Plus, Minus, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GuestVIPPage() {
  const { t } = useLanguage();
  const [selectedBottles, setSelectedBottles] = useState<{name: string, price: number, qty: number}[]>([]);
  const [bottles, setBottles] = useState<{name: string, price: number, img: string}[]>([]);
  const minSpend = 500;

  useEffect(() => {
    const saved = localStorage.getItem('viesa_vip_bottles');
    if (saved) {
      setBottles(JSON.parse(saved));
    } else {
      setBottles([
        { name: "Moët & Chandon Ice", price: 140, img: "🍾" },
        { name: "Dom Pérignon Luminous", price: 350, img: "🥂" },
        { name: "Grey Goose (1.5L)", price: 380, img: "🍸" },
        { name: "Don Julio 1942", price: 450, img: "🥃" },
      ]);
    }
  }, []);

  const updateQty = (bottle: any, delta: number) => {
    setSelectedBottles(prev => {
      const ex = prev.find(p => p.name === bottle.name);
      if (ex) {
        const newQty = ex.qty + delta;
        if (newQty <= 0) return prev.filter(p => p.name !== bottle.name);
        return prev.map(p => p.name === bottle.name ? {...p, qty: newQty} : p);
      }
      if (delta > 0) return [...prev, { name: bottle.name, price: bottle.price, qty: 1 }];
      return prev;
    });
  };

  const getQty = (name: string) => selectedBottles.find(b => b.name === name)?.qty || 0;
  const currentSpend = selectedBottles.reduce((acc, b) => acc + (b.price * b.qty), 0);
  const remaining = Math.max(0, minSpend - currentSpend);
  const progress = Math.min(100, (currentSpend / minSpend) * 100);

  return (
    <div className="min-h-screen bg-sand-gradient font-sans pb-32 relative overflow-hidden text-[#3d3935]">
      {/* Decorative floating orbs for anti-gravity effect */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-white/40 rounded-full blur-3xl floating pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#efe9db]/50 rounded-full blur-3xl floating-delayed pointer-events-none"></div>

      <div className="p-8 text-center relative z-10">
        <Star className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-2">{t('vipTitle')}</h1>
        <p className="text-stone-500 text-lg">{t('vipDesc')}</p>
      </div>

      <div className="p-6 max-w-lg mx-auto relative z-20">
        <div className="glass-panel rounded-3xl p-6 mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-stone-500 text-sm mb-1 uppercase tracking-wider font-semibold">{t('vipMinSpendTarget')}</p>
              <p className="text-3xl font-bold font-serif">€{currentSpend.toFixed(2)} <span className="text-stone-400 text-xl">/ €{minSpend}</span></p>
            </div>
            {remaining === 0 ? (
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm"><Check className="w-4 h-4"/> {t('vipReached')}</span>
            ) : (
              <span className="text-amber-600 text-sm font-medium bg-amber-50 px-3 py-1 rounded-full border border-amber-100">€{remaining.toFixed(2)} {t('vipToGo')}</span>
            )}
          </div>
          <div className="w-full bg-white rounded-full h-4 overflow-hidden border border-stone-200 shadow-inner">
            <div className={`h-full transition-all duration-1000 ease-out ${remaining === 0 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-300 to-amber-500'}`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <h2 className="text-xl font-bold font-serif mb-6 text-center">{t('vipPreOrderMenu')}</h2>
        <div className="space-y-6">
          {bottles.map((b, i) => (
            <div key={i} className="glass-panel rounded-3xl p-4 pr-6 flex items-center justify-between hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/60 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white/50">{b.img}</div>
                <div>
                  <h3 className="font-bold text-lg font-serif">{b.name}</h3>
                  <p className="text-stone-500 font-medium">€{b.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQty(b, -1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-600 border border-stone-200">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="font-bold text-xl w-6 text-center font-serif">{getQty(b.name)}</span>
                <button onClick={() => updateQty(b, 1)} className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-stone-800 transition-colors text-white shadow-md">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 glass-panel border-t-0 rounded-t-3xl z-50">
        <button 
          disabled={remaining > 0} 
          className={`w-full max-w-lg mx-auto block py-5 rounded-2xl font-bold text-xl transition-all shadow-xl ${remaining === 0 ? 'bg-stone-900 text-white hover:bg-stone-800 hover:-translate-y-1' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
        >
          {remaining === 0 ? t('vipCheckoutBtn') : t('vipNeedSpendBtn')}
        </button>
      </div>
    </div>
  );
}
