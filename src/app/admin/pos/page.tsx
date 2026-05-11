"use client";
import React, { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

export default function AdminPOSPage() {
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
    <div className="p-8 h-full bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Live Beach Orders</h1>
          <p className="text-slate-500">Kitchen & Bar Display (QR Code bestellingen)</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {orders.length} Open</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nieuw */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-100 p-4 font-bold text-slate-700 flex justify-between">Nieuw <span className="bg-slate-200 px-2 rounded-full">{orders.filter(o => o.status === 'new').length}</span></div>
          <div className="p-4 flex-1 space-y-4">
            {orders.filter(o => o.status === 'new').map(order => (
              <div key={order.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex justify-between font-bold text-amber-900 mb-2">
                  <span>{order.bed}</span>
                  <span className="text-sm font-normal text-amber-600 flex items-center gap-1"><Clock className="w-3 h-3" /> {order.time}</span>
                </div>
                <ul className="text-sm text-amber-800 font-medium mb-4 space-y-1">
                  {order.items.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <button onClick={() => updateStatus(order.id, 'preparing')} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-lg transition-colors">Start Bereiding</button>
              </div>
            ))}
          </div>
        </div>

        {/* In Bereiding */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-100 p-4 font-bold text-slate-700 flex justify-between">Maken <span className="bg-slate-200 px-2 rounded-full">{orders.filter(o => o.status === 'preparing').length}</span></div>
          <div className="p-4 flex-1 space-y-4">
             {orders.filter(o => o.status === 'preparing').map(order => (
              <div key={order.id} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex justify-between font-bold text-blue-900 mb-2">
                  <span>{order.bed}</span>
                  <span className="text-sm font-normal text-blue-600 flex items-center gap-1"><Clock className="w-3 h-3" /> {order.time}</span>
                </div>
                <ul className="text-sm text-blue-800 font-medium mb-4 space-y-1">
                  {order.items.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <button onClick={() => updateStatus(order.id, 'ready')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors">Klaar (Runner ophalen)</button>
              </div>
            ))}
          </div>
        </div>

        {/* Klaar voor Runner */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-100 p-4 font-bold text-slate-700 flex justify-between">Serveren <span className="bg-slate-200 px-2 rounded-full">{orders.filter(o => o.status === 'ready').length}</span></div>
          <div className="p-4 flex-1 space-y-4">
            {orders.filter(o => o.status === 'ready').map(order => (
              <div key={order.id} className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex justify-between font-bold text-green-900 mb-2">
                  <span>{order.bed}</span>
                  <span className="text-sm font-normal text-green-600 flex items-center gap-1"><Clock className="w-3 h-3" /> {order.time}</span>
                </div>
                <ul className="text-sm text-green-800 font-medium mb-4 space-y-1">
                  {order.items.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <button onClick={() => updateStatus(order.id, 'delivered')} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center gap-2"><Check className="w-4 h-4"/> Geleverd</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
