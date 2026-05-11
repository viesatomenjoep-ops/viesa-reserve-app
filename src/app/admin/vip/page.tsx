"use client";
import React from 'react';
import { Star, Shield, Euro } from 'lucide-react';

export default function AdminVIPPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">VIP & Minimum Spend</h1>
        <p className="text-slate-500">Beheer VIP zones en fles-reserveringen.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cabana Configuratie */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-bold text-xl mb-6 flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /> Cabana Zones</h2>
          
          <div className="space-y-4">
             <div className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-colors cursor-pointer">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-lg text-slate-900">Poolside VIP Cabanas</h3>
                 <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold">Actief</span>
               </div>
               <p className="text-slate-500 text-sm mb-4">4 Cabanas beschikbaar (Max 8 pers.)</p>
               <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center border border-slate-100">
                 <span className="text-sm font-medium text-slate-700">Minimum Spend</span>
                 <span className="font-bold text-indigo-600">€ 500,00</span>
               </div>
             </div>

             <div className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-colors cursor-pointer">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-lg text-slate-900">Beachfront Lounge</h3>
                 <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold">Actief</span>
               </div>
               <p className="text-slate-500 text-sm mb-4">2 Lounges beschikbaar (Max 12 pers.)</p>
               <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center border border-slate-100">
                 <span className="text-sm font-medium text-slate-700">Minimum Spend</span>
                 <span className="font-bold text-indigo-600">€ 1.000,00</span>
               </div>
             </div>
          </div>
          <button className="w-full mt-6 py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-700 transition-colors">
            + Nieuwe VIP Zone Toevoegen
          </button>
        </div>

        {/* Flessen Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
           <h2 className="font-bold text-xl mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-indigo-500" /> Pre-Order Flessen Menu</h2>
           <p className="text-sm text-slate-500 mb-6">Deze flessen worden aangeboden tijdens het boeken om de minimum spend te halen.</p>
           
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-slate-200 text-slate-500 text-sm">
                 <th className="pb-3 font-medium">Naam</th>
                 <th className="pb-3 font-medium">Prijs</th>
                 <th className="pb-3 font-medium text-right">Actie</th>
               </tr>
             </thead>
             <tbody className="text-sm">
               <tr className="border-b border-slate-100">
                 <td className="py-3 font-medium text-slate-900">Moët & Chandon Ice Impérial</td>
                 <td className="py-3 text-slate-600">€ 140,00</td>
                 <td className="py-3 text-right"><button className="text-indigo-600 hover:underline">Bewerk</button></td>
               </tr>
               <tr className="border-b border-slate-100">
                 <td className="py-3 font-medium text-slate-900">Dom Pérignon Luminous (0.75L)</td>
                 <td className="py-3 text-slate-600">€ 350,00</td>
                 <td className="py-3 text-right"><button className="text-indigo-600 hover:underline">Bewerk</button></td>
               </tr>
               <tr className="border-b border-slate-100">
                 <td className="py-3 font-medium text-slate-900">Grey Goose Vodka (1.5L)</td>
                 <td className="py-3 text-slate-600">€ 380,00</td>
                 <td className="py-3 text-right"><button className="text-indigo-600 hover:underline">Bewerk</button></td>
               </tr>
               <tr className="border-b border-slate-100">
                 <td className="py-3 font-medium text-slate-900">Don Julio 1942</td>
                 <td className="py-3 text-slate-600">€ 450,00</td>
                 <td className="py-3 text-right"><button className="text-indigo-600 hover:underline">Bewerk</button></td>
               </tr>
             </tbody>
           </table>
           <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors">
            Fles Toevoegen
          </button>
        </div>
      </div>
    </div>
  );
}
