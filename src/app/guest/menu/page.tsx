"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

export default function GuestMenuPage() {
  const [cart, setCart] = useState<{name: string, price: number, qty: number}[]>([]);
  const [menu, setMenu] = useState<{name: string, price: number, img: string}[]>([]);
  const [selectedBed, setSelectedBed] = useState('Bed 42');
  const [isOrdered, setIsOrdered] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('viesa_menu_items');
    if (saved) {
      setMenu(JSON.parse(saved));
    } else {
      setMenu([
        { name: "Aperol Spritz", price: 12.5, img: "🍹" },
        { name: "Mojito", price: 14.0, img: "🌱" },
        { name: "Corona Extra", price: 8.5, img: "🍺" },
        { name: "Calamaris", price: 16.0, img: "🦑" },
        { name: "Nachos Todos", price: 18.5, img: "🧀" },
        { name: "Fruit Platter", price: 24.0, img: "🍉" }
      ]);
    }
  }, []);

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    // Create new order object
    const newOrder = {
      id: "ORD-" + Math.floor(Math.random() * 10000),
      bed: selectedBed,
      items: cart.map(item => `${item.qty}x ${item.name}`),
      time: "Zojuist",
      status: "new"
    };

    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('viesa_pos_orders') || '[]');
    localStorage.setItem('viesa_pos_orders', JSON.stringify([...existingOrders, newOrder]));

    // Clear cart and show success
    setCart([]);
    setIsOrdered(true);
    setTimeout(() => setIsOrdered(false), 3000);
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const ex = prev.find(p => p.name === item.name);
      if (ex) return prev.map(p => p.name === item.name ? {...p, qty: p.qty + 1} : p);
      return [...prev, { name: item.name, price: item.price, qty: 1 }];
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-sand-gradient font-sans pb-32 relative overflow-hidden text-[#3d3935]">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl floating pointer-events-none"></div>

      <div className="p-8 text-center relative z-10 floating">
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-2">Strand Menu</h1>
        <p className="text-stone-500 text-lg mb-6">Bestel direct vanaf je bedje.</p>
        
        <div className="max-w-xs mx-auto">
          <label className="block text-sm font-bold text-stone-500 mb-2 uppercase tracking-wider">Kies je locatie</label>
          <select 
            value={selectedBed}
            onChange={(e) => setSelectedBed(e.target.value)}
            className="w-full p-4 glass-panel rounded-2xl font-serif text-xl font-bold text-stone-900 outline-none text-center appearance-none cursor-pointer"
          >
            <optgroup label="Front Row">
              <option value="Bed 42">Bed 42</option>
              <option value="Bed 43">Bed 43</option>
            </optgroup>
            <optgroup label="VIP Area">
              <option value="VIP Cabana 1">VIP Cabana 1</option>
              <option value="VIP Cabana 2">VIP Cabana 2</option>
              <option value="Beachfront Lounge">Beachfront Lounge</option>
            </optgroup>
          </select>
        </div>
      </div>

      <div className="p-6 max-w-lg mx-auto relative z-20">
        <div className="space-y-6">
          {menu.map((item, i) => (
            <div key={i} className={`glass-panel rounded-3xl p-4 pr-6 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 ${i % 2 === 0 ? 'floating' : 'floating-delayed'}`}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/60 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white/50">{item.img}</div>
                <div>
                  <h3 className="font-bold text-lg font-serif">{item.name}</h3>
                  <p className="text-stone-500 font-medium">€{item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => addToCart(item)} className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center hover:bg-stone-800 transition-colors text-white shadow-md">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isOrdered && (
        <div className="fixed top-10 left-0 right-0 z-50 flex justify-center animate-in slide-in-from-top-10">
          <div className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
            <span>✅</span> Bestelling succesvol geplaatst voor {selectedBed}!
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 glass-panel border-t-0 rounded-t-3xl z-40">
          <div className="max-w-lg mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between text-stone-900 font-bold text-xl px-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                <span>{cart.reduce((acc, curr) => acc + curr.qty, 0)} items</span>
              </div>
              <div className="font-serif">€{cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0).toFixed(2)}</div>
            </div>
            <button 
              onClick={placeOrder}
              className="w-full bg-stone-900 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all shadow-xl hover:-translate-y-1"
            >
              Bestel & Zet op Rekening ({selectedBed})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
