"use client";
import React, { useState } from 'react';
import { Star, Plus, Minus, Check } from 'lucide-react';

export default function GuestVIPPage() {
  const [selectedBottles, setSelectedBottles] = useState<{name: string, price: number, qty: number}[]>([]);
  const minSpend = 500;

  const bottles = [
    { name: "Moët & Chandon Ice", price: 140, img: "🍾" },
    { name: "Dom Pérignon Luminous", price: 350, img: "🥂" },
    { name: "Grey Goose (1.5L)", price: 380, img: "🍸" },
    { name: "Don Julio 1942", price: 450, img: "🥃" },
  ];

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
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-32">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 text-center rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <Star className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-3xl font-black tracking-tight mb-2">VIP Cabana Reservering</h1>
          <p className="text-indigo-200">Kies flessen om je minimum spend te behalen.</p>
        </div>
      </div>

      <div className="p-6 max-w-lg mx-auto -mt-6 relative z-20">
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Minimum Spend Doel</p>
              <p className="text-2xl font-bold">€{currentSpend} <span className="text-slate-500 text-lg">/ €{minSpend}</span></p>
            </div>
            {remaining === 0 ? (
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><Check className="w-4 h-4"/> Gehaald</span>
            ) : (
              <span className="text-amber-400 text-sm font-medium">Nog €{remaining} te gaan</span>
            )}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div className={`h-full transition-all duration-500 ${remaining === 0 ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Pre-Order Flessen Menu</h2>
        <div className="space-y-4">
          {bottles.map((b, i) => (
            <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl">{b.img}</div>
                <div>
                  <h3 className="font-bold">{b.name}</h3>
                  <p className="text-slate-400 text-sm">€{b.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQty(b, -1)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-4 text-center">{getQty(b.name)}</span>
                <button onClick={() => updateQty(b, 1)} className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-500 transition-colors text-white">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-xl border-t border-white/10">
        <button 
          disabled={remaining > 0} 
          className={`w-full max-w-lg mx-auto block py-4 rounded-xl font-bold text-lg transition-all ${remaining === 0 ? 'bg-white text-slate-950 hover:bg-slate-200' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
        >
          {remaining === 0 ? "Afrekenen & Bevestigen" : "Haal minimum spend om te boeken"}
        </button>
      </div>
    </div>
  );
}
