"use client";
import React, { useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function GuestWaitlistPage() {
  const [joined, setJoined] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-950 to-indigo-900/40 z-0"></div>
      
      <div className="relative z-10 max-w-md w-full mx-auto">
        {!joined ? (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-blue-500/30">
              <Bell className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Zaterdag is Volgeboekt</h1>
            <p className="text-slate-400 text-center mb-8">Zet jezelf op de Smart Waitlist. Zodra er iemand annuleert, krijg je als eerste een SMS om het bedje te claimen.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Naam</label>
                <input type="text" placeholder="Jouw naam" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Telefoonnummer</label>
                <input type="tel" placeholder="+31 6 12345678" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Gewenste Zone</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none">
                  <option>Front Row (Eerste rij)</option>
                  <option>Standard Beach Bed</option>
                  <option>VIP Cabana</option>
                </select>
              </div>
            </div>
            
            <button onClick={() => setJoined(true)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg mt-8 transition-colors">
              Zet mij op de wachtlijst
            </button>
          </div>
        ) : (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Je staat op de lijst!</h1>
            <p className="text-slate-400 mb-6">Houd je telefoon in de gaten. Als er een plekje vrijkomt, heb je 10 minuten de tijd om de betaling te voltooien via de geheime link.</p>
            <button onClick={() => setJoined(false)} className="text-blue-400 font-medium hover:text-blue-300">Terug</button>
          </div>
        )}
      </div>
    </div>
  );
}
