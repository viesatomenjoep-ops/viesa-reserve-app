"use client";
import React, { useState, useEffect } from 'react';
import { Star, Shield, Euro, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminVIPPage() {
  const { t } = useLanguage();
  const [zones, setZones] = useState<{name: string, capacity: string, minSpend: number}[]>([]);
  const [bottles, setBottles] = useState<{name: string, price: number, img: string}[]>([]);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneSpend, setNewZoneSpend] = useState('');
  const [newBottleName, setNewBottleName] = useState('');
  const [newBottlePrice, setNewBottlePrice] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const savedZones = localStorage.getItem('viesa_vip_zones');
    if (savedZones) {
      setZones(JSON.parse(savedZones));
    } else {
      setZones([
        { name: "Poolside VIP Cabanas", capacity: "4 Cabanas beschikbaar (Max 8 pers.)", minSpend: 500 },
        { name: "Beachfront Lounge", capacity: "2 Lounges beschikbaar (Max 12 pers.)", minSpend: 1000 }
      ]);
    }

    const savedBottles = localStorage.getItem('viesa_vip_bottles');
    if (savedBottles) {
      setBottles(JSON.parse(savedBottles));
    } else {
      setBottles([
        { name: "Moët & Chandon Ice Impérial", price: 140, img: "🍾" },
        { name: "Dom Pérignon Luminous (0.75L)", price: 350, img: "🥂" },
        { name: "Grey Goose Vodka (1.5L)", price: 380, img: "🍸" },
        { name: "Don Julio 1942", price: 450, img: "🥃" },
      ]);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (zones.length > 0) localStorage.setItem('viesa_vip_zones', JSON.stringify(zones));
  }, [zones]);

  useEffect(() => {
    if (bottles.length > 0) localStorage.setItem('viesa_vip_bottles', JSON.stringify(bottles));
  }, [bottles]);

  const addZone = () => {
    if (newZoneName && newZoneSpend) {
      setZones([...zones, { name: newZoneName, capacity: "Nieuwe Zone", minSpend: Number(newZoneSpend) }]);
      setNewZoneName('');
      setNewZoneSpend('');
    }
  };

  const addBottle = () => {
    if (newBottleName && newBottlePrice) {
      setBottles([...bottles, { name: newBottleName, price: Number(newBottlePrice), img: "🍾" }]);
      setNewBottleName('');
      setNewBottlePrice('');
    }
  };

  const removeBottle = (idx: number) => {
    setBottles(bottles.filter((_, i) => i !== idx));
  };

  const removeZone = (idx: number) => {
    setZones(zones.filter((_, i) => i !== idx));
  };
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t('adminVipManagementTitle')}</h1>
        <p className="text-slate-500">{t('adminVipManagementDesc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cabana Configuratie */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-bold text-xl mb-6 flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /> {t('adminVipCabanaZones')}</h2>
          
          <div className="space-y-4">
            {zones.map((zone, i) => (
             <div key={i} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-colors cursor-pointer relative group">
               <button onClick={() => removeZone(i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Trash2 className="w-4 h-4" />
               </button>
               <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-lg text-slate-900 pr-8">{zone.name}</h3>
                 <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold">{t('adminVipActive')}</span>
               </div>
               <p className="text-slate-500 text-sm mb-4">
                 {zone.capacity === "4 Cabanas beschikbaar (Max 8 pers.)" ? t('adminVipMockCapacity1') : 
                  zone.capacity === "2 Lounges beschikbaar (Max 12 pers.)" ? t('adminVipMockCapacity2') : 
                  zone.capacity === "Nieuwe Zone" ? t('adminVipNewZoneDefault') : zone.capacity}
               </p>
               <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center border border-slate-100">
                 <span className="text-sm font-medium text-slate-700">{t('adminVipMinSpend')}</span>
                 <span className="font-bold text-indigo-600">€ {zone.minSpend.toFixed(2)}</span>
               </div>
             </div>
            ))}
          </div>

          <div className="mt-6 border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50">
            <h4 className="font-semibold text-sm mb-3">{t('adminVipNewZone')}</h4>
            <div className="flex gap-2">
              <input type="text" placeholder={t('adminVipZoneName')} value={newZoneName} onChange={e => setNewZoneName(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
              <input type="number" placeholder={t('adminVipMinSpendPlaceholder')} value={newZoneSpend} onChange={e => setNewZoneSpend(e.target.value)} className="w-32 px-3 py-2 border rounded-lg text-sm" />
              <button onClick={addZone} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"><Plus className="w-4 h-4"/></button>
            </div>
          </div>
        </div>

        {/* Flessen Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
           <h2 className="font-bold text-xl mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-indigo-500" /> {t('adminVipPreOrderMenu')}</h2>
           <p className="text-sm text-slate-500 mb-6">{t('adminVipPreOrderDesc')}</p>
           
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-slate-200 text-slate-500 text-sm">
                 <th className="pb-3 font-medium">{t('name')}</th>
                 <th className="pb-3 font-medium">{t('price')}</th>
                 <th className="pb-3 font-medium text-right">{t('adminVipAction')}</th>
               </tr>
             </thead>
             <tbody className="text-sm">
               {bottles.map((bottle, i) => (
                 <tr key={i} className="border-b border-slate-100 group">
                   <td className="py-3 font-medium text-slate-900 flex items-center gap-2"><span>{bottle.img}</span> {bottle.name}</td>
                   <td className="py-3 text-slate-600">€ {bottle.price.toFixed(2)}</td>
                   <td className="py-3 text-right">
                     <button onClick={() => removeBottle(i)} className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 ml-auto"/></button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
           
           <div className="mt-6 border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50">
            <h4 className="font-semibold text-sm mb-3">{t('adminVipNewBottle')}</h4>
            <div className="flex gap-2">
              <input type="text" placeholder={t('adminVipBottleName')} value={newBottleName} onChange={e => setNewBottleName(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
              <input type="number" placeholder={t('price')} value={newBottlePrice} onChange={e => setNewBottlePrice(e.target.value)} className="w-32 px-3 py-2 border rounded-lg text-sm" />
              <button onClick={addBottle} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"><Plus className="w-4 h-4"/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
