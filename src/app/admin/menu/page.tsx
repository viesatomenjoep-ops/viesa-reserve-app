"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Utensils } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const EMOJI_OPTIONS = {
  Drankjes: ["🍹", "🍸", "🥂", "🍺", "🍷", "🍾", "🥃", "🧊", "🥤", "☕"],
  Fruit: ["🍉", "🍓", "🍒", "🍇", "🍍", "🥥", "🍋", "🍌", "🍎"],
  Food: ["🍔", "🍕", "🌮", "🦑", "🦐", "🥩", "🍟", "🥗", "🧀", "🌭", "🥪"]
};

export default function AdminMenuPage() {
  const { t } = useLanguage();
  const [menuItems, setMenuItems] = useState<{name: string, price: number, img: string}[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemEmoji, setNewItemEmoji] = useState('🍹');

  useEffect(() => {
    const saved = localStorage.getItem('viesa_menu_items');
    if (saved) {
      setMenuItems(JSON.parse(saved));
    } else {
      setMenuItems([
        { name: "Aperol Spritz", price: 12.5, img: "🍹" },
        { name: "Mojito", price: 14.0, img: "🌱" },
        { name: "Corona Extra", price: 8.5, img: "🍺" },
        { name: "Calamaris", price: 16.0, img: "🦑" },
        { name: "Nachos Todos", price: 18.5, img: "🧀" },
        { name: "Fruit Platter", price: 24.0, img: "🍉" }
      ]);
    }
  }, []);

  useEffect(() => {
    if (menuItems.length > 0) {
      localStorage.setItem('viesa_menu_items', JSON.stringify(menuItems));
    }
  }, [menuItems]);

  const addItem = () => {
    if (newItemName && newItemPrice) {
      setMenuItems([...menuItems, { name: newItemName, price: Number(newItemPrice), img: newItemEmoji }]);
      setNewItemName('');
      setNewItemPrice('');
    }
  };

  const removeItem = (idx: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-10 relative overflow-hidden min-h-screen text-[#3d3935]">
      {/* Decorative Orbs */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-white/40 rounded-full blur-3xl floating pointer-events-none z-0"></div>

      <div className="mb-10 relative z-10">
        <h1 className="text-4xl font-black font-serif text-[#3d3935] mb-2">{t('adminMenuTitle')}</h1>
        <p className="text-stone-500 text-lg">{t('adminMenuDesc')}</p>
      </div>

      <div className="glass-panel rounded-3xl p-8 shadow-sm relative z-10">
        <h2 className="font-bold font-serif text-2xl mb-8 flex items-center gap-3"><Utensils className="w-6 h-6 text-amber-500" /> {t('guestMenuTitle')}</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse mb-10">
            <thead>
              <tr className="border-b border-white/40 text-stone-500 text-sm tracking-wider uppercase">
                <th className="pb-4 font-bold">{t('adminMenuTableItem')}</th>
                <th className="pb-4 font-bold">{t('adminMenuTablePrice')}</th>
                <th className="pb-4 font-bold text-right">{t('adminMenuTableAction')}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {menuItems.map((item, i) => (
                <tr key={i} className="border-b border-white/20 group hover:bg-white/30 transition-colors">
                  <td className="py-4 font-medium text-stone-900 flex items-center gap-3 text-lg font-serif">
                    <span className="bg-white/50 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-2xl border border-white/60">{item.img}</span> 
                    <span className="text-lg">{item.name}</span>
                  </td>
                  <td className="py-4 text-stone-600 font-medium text-base">€ {item.price.toFixed(2)}</td>
                  <td className="py-4 text-right">
                    <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all p-2 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 className="w-5 h-5 ml-auto"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-white/60 rounded-2xl p-6 bg-white/40 shadow-sm">
          <h4 className="font-bold text-lg mb-4 font-serif text-stone-800">{t('adminMenuAddNew')}</h4>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            {/* EMOJI SELECTOR */}
            <div className="relative">
              <select 
                value={newItemEmoji} 
                onChange={e => setNewItemEmoji(e.target.value)} 
                className="w-24 px-4 py-3 border border-white/80 bg-white/70 rounded-xl text-2xl text-center appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
              >
                {Object.entries(EMOJI_OPTIONS).map(([category, emojis]) => (
                  <optgroup key={category} label={category}>
                    {emojis.map(emoji => (
                      <option key={emoji} value={emoji}>{emoji}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs opacity-50">▼</div>
            </div>

            <input 
              type="text" 
              placeholder="Item naam (bijv. Watermeloen)" 
              value={newItemName} 
              onChange={e => setNewItemName(e.target.value)} 
              className="flex-1 px-4 py-3 border border-white/80 bg-white/70 rounded-xl text-base font-medium outline-none focus:ring-2 focus:ring-amber-500 shadow-sm w-full" 
            />
            
            <div className="relative w-full md:w-32">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold">€</span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={newItemPrice} 
                onChange={e => setNewItemPrice(e.target.value)} 
                className="w-full pl-8 pr-4 py-3 border border-white/80 bg-white/70 rounded-xl text-base font-medium outline-none focus:ring-2 focus:ring-amber-500 shadow-sm" 
              />
            </div>
            
            <button 
              onClick={addItem} 
              className="w-full md:w-auto bg-stone-900 text-white px-8 py-3 rounded-xl text-base font-bold hover:bg-stone-800 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5"/> {t('adminMenuSave')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
