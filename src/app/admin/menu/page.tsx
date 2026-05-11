"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Utensils } from 'lucide-react';

export default function AdminMenuPage() {
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">QR Menu Beheer</h1>
        <p className="text-slate-500">Beheer de gerechten en drankjes voor de strandbed bestellingen.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-xl mb-6 flex items-center gap-2"><Utensils className="w-5 h-5 text-amber-500" /> Strand Menu</h2>
        
        <table className="w-full text-left border-collapse mb-8">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm">
              <th className="pb-3 font-medium">Item</th>
              <th className="pb-3 font-medium">Prijs</th>
              <th className="pb-3 font-medium text-right">Actie</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {menuItems.map((item, i) => (
              <tr key={i} className="border-b border-slate-100 group">
                <td className="py-3 font-medium text-slate-900 flex items-center gap-2 text-lg"><span>{item.img}</span> <span className="text-sm">{item.name}</span></td>
                <td className="py-3 text-slate-600">€ {item.price.toFixed(2)}</td>
                <td className="py-3 text-right">
                  <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 ml-auto"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50">
          <h4 className="font-semibold text-sm mb-3">Nieuw Menu Item Toevoegen</h4>
          <div className="flex gap-2">
            <input type="text" placeholder="Emoji (bijv. 🍔)" value={newItemEmoji} onChange={e => setNewItemEmoji(e.target.value)} className="w-20 px-3 py-2 border rounded-lg text-sm text-center" />
            <input type="text" placeholder="Item naam" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
            <input type="number" placeholder="Prijs (€)" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-32 px-3 py-2 border rounded-lg text-sm" />
            <button onClick={addItem} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"><Plus className="w-4 h-4"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
