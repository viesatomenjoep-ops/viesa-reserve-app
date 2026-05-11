"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Utensils, Sparkles, UploadCloud, Loader2, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';

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
  const [isScanning, setIsScanning] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [magicUrl, setMagicUrl] = useState('');

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

  const handleMagicScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsScanning(true);
    
    // Simulate AI scanning delay
    setTimeout(() => {
      const scannedItems = [
        { name: "Dom Pérignon Vintage", price: 350.0, img: "🍾" },
        { name: "Wagyu Beef Sliders", price: 45.0, img: "🍔" },
        { name: "Fresh Oysters (1/2 Dozen)", price: 32.0, img: "🦪" },
        { name: "Truffle Fries", price: 14.5, img: "🍟" },
        { name: "Pina Colada", price: 16.0, img: "🥥" }
      ];
      setMenuItems([...menuItems, ...scannedItems]);
      setIsScanning(false);
      setShowScannerModal(false);
      alert("AI Scan Complete: 5 new items detected and added!");
    }, 3500);
  };

  const handleUrlScan = () => {
    if (!magicUrl) return;
    setIsScanning(true);
    
    // Simulate AI scanning delay for URL
    setTimeout(() => {
      const scannedItems = [
        { name: "Spicy Tuna Roll", price: 22.0, img: "🍣" },
        { name: "Lychee Martini", price: 18.0, img: "🍸" },
        { name: "Burrata Salad", price: 24.0, img: "🥗" },
        { name: "Ceviche Mixto", price: 26.0, img: "🦐" },
        { name: "Sangria Pitcher", price: 35.0, img: "🍷" }
      ];
      setMenuItems([...menuItems, ...scannedItems]);
      setIsScanning(false);
      setShowScannerModal(false);
      setMagicUrl('');
      alert(`AI Scan Complete: 5 items extracted from ${magicUrl}`);
    }, 4000);
  };

  return (
    <div className="p-10 relative overflow-hidden min-h-screen text-[#3d3935]">
      {/* Decorative Orbs */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-white/40 rounded-full blur-3xl pointer-events-none z-0"></div>

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
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-lg font-serif text-stone-800">{t('adminMenuAddNew')}</h4>
            <button 
              onClick={() => setShowScannerModal(true)}
              className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border border-indigo-200"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              AI Magic Scanner
            </button>
          </div>
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

      {/* AI Scanner Modal */}
      <AnimatePresence>
        {showScannerModal && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
              <button onClick={() => !isScanning && setShowScannerModal(false)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900"><X className="w-6 h-6" /></button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><Sparkles className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold font-serif text-stone-900">AI Magic Scanner</h3>
              </div>
              <p className="text-stone-500 mb-8">Upload a photo or PDF of your menu. Our AI will automatically detect dishes, prices, and assign the correct icons.</p>
              
              {isScanning ? (
                <div className="flex flex-col items-center justify-center py-10 bg-indigo-50/50 rounded-2xl border-2 border-indigo-100 border-dashed">
                  <div className="relative mb-6">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <Sparkles className="w-5 h-5 text-amber-400 absolute -top-2 -right-2 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-lg text-indigo-900 mb-1">Scanning Menu...</h4>
                  <p className="text-sm text-indigo-600/70">Extracting prices and mapping emojis</p>
                  
                  {/* Fake progress bar */}
                  <div className="w-48 h-1.5 bg-indigo-100 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '75%' }}></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <label className="flex flex-col items-center justify-center py-8 bg-stone-50 hover:bg-stone-100 rounded-2xl border-2 border-stone-200 border-dashed cursor-pointer transition-colors group">
                    <UploadCloud className="w-10 h-10 text-stone-400 group-hover:text-indigo-500 mb-3 transition-colors" />
                    <span className="font-bold text-stone-700 mb-1">Upload Menu File</span>
                    <span className="text-sm text-stone-400">Supports PDF, JPG, PNG</span>
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleMagicScan} />
                  </label>
                  
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-stone-200"></div>
                    <span className="flex-shrink-0 mx-4 text-stone-400 text-sm font-medium uppercase tracking-wider">or paste URL</span>
                    <div className="flex-grow border-t border-stone-200"></div>
                  </div>
                  
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      placeholder="https://example.com/menu" 
                      value={magicUrl}
                      onChange={e => setMagicUrl(e.target.value)}
                      className="flex-1 px-4 py-3 border border-stone-200 bg-stone-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <button 
                      onClick={handleUrlScan}
                      disabled={!magicUrl}
                      className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      Scan URL
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
