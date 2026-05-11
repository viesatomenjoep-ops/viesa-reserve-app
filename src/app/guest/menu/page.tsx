"use client";
import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

export default function GuestMenuPage() {
  const [cart, setCart] = useState<{name: string, price: number, qty: number}[]>([]);

  const menu = [
    { name: "Aperol Spritz", price: 12.5, img: "🍹" },
    { name: "Mojito", price: 14.0, img: "🌱" },
    { name: "Corona Extra", price: 8.5, img: "🍺" },
    { name: "Calamaris", price: 16.0, img: "🦑" },
    { name: "Nachos Todos", price: 18.5, img: "🧀" },
    { name: "Fruit Platter", price: 24.0, img: "🍉" }
  ];

  const addToCart = (item: any) => {
    setCart(prev => {
      const ex = prev.find(p => p.name === item.name);
      if (ex) return prev.map(p => p.name === item.name ? {...p, qty: p.qty + 1} : p);
      return [...prev, { name: item.name, price: item.price, qty: 1 }];
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      <div className="bg-slate-900 text-white p-6 pt-12 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-amber-400 font-bold text-sm tracking-wider uppercase mb-1">Je bestelt voor</p>
            <h1 className="text-3xl font-black">Bed 42</h1>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
            <span className="text-xl">🏖️</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Populair op het strand</h2>
        <div className="grid grid-cols-2 gap-4">
          {menu.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-3">{item.img}</div>
                <h3 className="font-bold text-slate-800 leading-tight mb-1">{item.name}</h3>
                <p className="text-slate-500 text-sm">€{item.price.toFixed(2)}</p>
              </div>
              <button onClick={() => addToCart(item)} className="mt-4 w-full py-2 bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-700 rounded-xl font-medium transition-colors flex justify-center items-center gap-1">
                <Plus className="w-4 h-4" /> Toevoegen
              </button>
            </div>
          ))}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom">
          <div className="flex justify-between items-center mb-4">
             <div className="font-bold text-slate-800 flex items-center gap-2">
               <ShoppingBag className="w-5 h-5 text-amber-500" />
               Jouw Bestelling
             </div>
             <div className="font-black text-xl text-slate-900">€{total.toFixed(2)}</div>
          </div>
          <button className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl shadow-xl hover:bg-slate-800 transition-colors">
            Bestel & Zet op Rekening
          </button>
        </div>
      )}
    </div>
  );
}
