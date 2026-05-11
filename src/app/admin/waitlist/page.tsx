"use client";
import React from 'react';
import { Send, UserMinus } from 'lucide-react';

export default function AdminWaitlistPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Smart Waitlist</h1>
        <p className="text-slate-500">Automatische opvulling van geannuleerde bedden & no-shows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Actieve Reserveringen - Om te annuleren */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-lg mb-4 flex justify-between items-center">
            Zaterdag 18 Juli - Volgeboekt
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">100% Bezettingsgraad</span>
          </h2>
          
          <div className="space-y-3">
            <div className="border border-slate-100 p-4 rounded-xl flex justify-between items-center hover:bg-slate-50">
              <div>
                <p className="font-bold">Bed 12 - Front Row</p>
                <p className="text-sm text-slate-500">M. de Vries (+31612345678)</p>
              </div>
              <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Markeer als No-Show">
                <UserMinus className="w-5 h-5" />
              </button>
            </div>
            <div className="border border-slate-100 p-4 rounded-xl flex justify-between items-center hover:bg-slate-50">
              <div>
                <p className="font-bold">Bed 14 - Front Row</p>
                <p className="text-sm text-slate-500">J. Pietersen (+31687654321)</p>
              </div>
              <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Markeer als No-Show">
                <UserMinus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Wachtlijst */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white">
          <h2 className="font-bold text-lg mb-4 text-slate-200">Wachtlijst voor Front Row</h2>
          <p className="text-sm text-slate-400 mb-6">Als je een bedje hiernaast annuleert, krijgt de eerste persoon automatisch een SMS.</p>
          
          <div className="space-y-3 relative">
            <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-700"></div>
            
            <div className="relative flex gap-4 items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm z-10 shrink-0">1</div>
              <div className="flex-1">
                <p className="font-bold">S. Bakker</p>
                <p className="text-sm text-slate-400">+31 6 11 22 33 44</p>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Send className="w-4 h-4" /> SMS Nu
              </button>
            </div>

            <div className="relative flex gap-4 items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm z-10 shrink-0">2</div>
              <div className="flex-1">
                <p className="font-bold">A. Jansen</p>
                <p className="text-sm text-slate-400">+31 6 99 88 77 66</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
