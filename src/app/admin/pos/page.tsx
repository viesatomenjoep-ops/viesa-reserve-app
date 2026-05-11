"use client";
import React, { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminPOSPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<{id: string, bed: string, items: string[], time: string, status: string}[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('viesa_pos_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      setOrders([
        { id: "ORD-001", bed: "Cabana 4", items: ["2x Aperol Spritz", "1x Calamaris"], time: "2 min geleden", status: "new" },
        { id: "ORD-002", bed: "Bed 12", items: ["1x Corona", "1x Nachos"], time: "5 min geleden", status: "preparing" },
        { id: "ORD-003", bed: "Bed 42", items: ["1x Bottle Whispering Angel", "Ice Bucket"], time: "12 min geleden", status: "ready" },
      ]);
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('viesa_pos_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const updateStatus = (id: string, newStatus: string) => {
    if (newStatus === 'delivered') {
      setOrders(orders.filter(o => o.id !== id));
    } else {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  return (
    <div className="p-8 min-h-screen bg-sand-gradient relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl floating pointer-events-none"></div>

      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold font-serif text-[#3d3935]">{t('adminPosTitle')}</h1>
        <p className="text-stone-500">{t('adminPosPageDesc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] relative z-10">
        
        {/* Nieuw */}
        <div className="glass-panel rounded-3xl shadow-sm border border-white/50 overflow-hidden flex flex-col">
          <div className="bg-white/50 backdrop-blur-md p-4 font-bold text-stone-700 flex justify-between items-center border-b border-white/30">
            {t('adminPosNew')} 
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs shadow-sm">{orders.filter(o => o.status === 'new').length}</span>
          </div>
          <div className="p-4 flex-1 space-y-4 overflow-auto">
            {orders.filter(o => o.status === 'new').map(order => (
              <div key={order.id} className="bg-white/60 border border-white/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold font-serif text-lg text-stone-900">
                    {order.bed === "Cabana 4" ? t('adminPosBed4') : order.bed === "Bed 12" ? t('adminPosBed12') : order.bed === "Bed 42" ? t('adminPosBed42') : order.bed}
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-stone-500 bg-white/80 px-2 py-1 rounded-lg">
                    <Clock className="w-3 h-3"/> 
                    {order.time === "2 min geleden" ? t('adminPosTime2') : order.time === "5 min geleden" ? t('adminPosTime5') : order.time === "12 min geleden" ? t('adminPosTime12') : order.time}
                  </span>
                </div>
                <ul className="text-sm text-stone-700 font-medium mb-4 space-y-1">
                  {order.items.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <button onClick={() => updateStatus(order.id, 'preparing')} className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 rounded-xl transition-all shadow-lg">{t('adminPosStartPrep')}</button>
              </div>
            ))}
          </div>
        </div>

        {/* In Bereiding */}
        <div className="glass-panel rounded-3xl shadow-sm border border-white/50 overflow-hidden flex flex-col">
          <div className="bg-white/50 backdrop-blur-md p-4 font-bold text-stone-700 flex justify-between items-center border-b border-white/30">
            {t('adminPosPrep')} 
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs shadow-sm">{orders.filter(o => o.status === 'preparing').length}</span>
          </div>
          <div className="p-4 flex-1 space-y-4 overflow-auto">
             {orders.filter(o => o.status === 'preparing').map(order => (
              <div key={order.id} className="bg-blue-50/80 border border-blue-200/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold font-serif text-lg text-blue-900">
                    {order.bed === "Cabana 4" ? t('adminPosBed4') : order.bed === "Bed 12" ? t('adminPosBed12') : order.bed === "Bed 42" ? t('adminPosBed42') : order.bed}
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-blue-700 bg-white/80 px-2 py-1 rounded-lg">
                    <Clock className="w-3 h-3"/> 
                    {order.time === "2 min geleden" ? t('adminPosTime2') : order.time === "5 min geleden" ? t('adminPosTime5') : order.time === "12 min geleden" ? t('adminPosTime12') : order.time}
                  </span>
                </div>
                <ul className="text-sm text-blue-800 font-medium mb-4 space-y-1">
                  {order.items.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <button onClick={() => updateStatus(order.id, 'ready')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg">{t('adminPosReady')}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Klaar voor Runner */}
        <div className="glass-panel rounded-3xl shadow-sm border border-white/50 overflow-hidden flex flex-col">
          <div className="bg-white/50 backdrop-blur-md p-4 font-bold text-stone-700 flex justify-between items-center border-b border-white/30">
            {t('adminPosServe')} 
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs shadow-sm">{orders.filter(o => o.status === 'ready').length}</span>
          </div>
          <div className="p-4 flex-1 space-y-4 overflow-auto">
            {orders.filter(o => o.status === 'ready').map(order => (
              <div key={order.id} className="bg-emerald-50/80 border border-emerald-200/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold font-serif text-lg text-emerald-900">
                    {order.bed === "Cabana 4" ? t('adminPosBed4') : order.bed === "Bed 12" ? t('adminPosBed12') : order.bed === "Bed 42" ? t('adminPosBed42') : order.bed}
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-emerald-700 bg-white/80 px-2 py-1 rounded-lg">
                    <Clock className="w-3 h-3"/> 
                    {order.time === "2 min geleden" ? t('adminPosTime2') : order.time === "5 min geleden" ? t('adminPosTime5') : order.time === "12 min geleden" ? t('adminPosTime12') : order.time}
                  </span>
                </div>
                <ul className="text-sm text-emerald-800 font-medium mb-4 space-y-1">
                  {order.items.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <button onClick={() => updateStatus(order.id, 'delivered')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg"><Check className="w-4 h-4"/> {t('adminPosDelivered')}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
