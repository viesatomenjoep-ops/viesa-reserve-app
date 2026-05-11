"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CloudRain, Sun, Wind, AlertTriangle, TrendingUp, Users, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminOperationsPage() {
  const { t } = useLanguage();
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string>('');
  const [weatherStatus, setWeatherStatus] = useState('SUNNY');
  const [weatherMessage, setWeatherMessage] = useState('');
  const [isClosed, setIsClosed] = useState(false);
  const [pricingMultiplier, setPricingMultiplier] = useState(1.0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const { data } = await supabase.from('venues').select('*');
      if (data && data.length > 0) {
        setVenues(data);
        const venue = data[0];
        setSelectedVenueId(venue.id);
        setWeatherStatus(venue.weather_status || 'SUNNY');
        setWeatherMessage(venue.weather_alert_message || '');
        setIsClosed(venue.is_closed_due_to_weather || false);
        setPricingMultiplier(venue.dynamic_pricing_multiplier || 1.0);
      }
    } else {
      // Mock Data
      setVenues([{ id: 'mock', name: 'Mock Beach Club' }]);
      setSelectedVenueId('mock');
    }
  };

  const handleSave = async () => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const { error } = await supabase.from('venues').update({
        weather_status: weatherStatus,
        weather_alert_message: weatherMessage,
        is_closed_due_to_weather: isClosed,
        dynamic_pricing_multiplier: pricingMultiplier
      }).eq('id', selectedVenueId);

      if (error) {
        alert("Fout bij opslaan: " + error.message);
      } else {
        alert("Operations instellingen succesvol opgeslagen! De gasten app is direct geüpdatet.");
      }
    } else {
      alert("Opgeslagen! (Mock mode)");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto pb-32">
      <div className="mb-8">
        <h1 className="text-4xl font-black font-serif text-[#3d3935] mb-2">Live Operations & Veiligheid</h1>
        <p className="text-stone-500 text-lg">Beheer het weer, veiligheidswaarschuwingen en yield pricing voor het hotel of de beachclub.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weer & Veiligheid */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8">
          <h2 className="font-bold text-2xl font-serif mb-6 flex items-center text-stone-900">
            <ShieldAlert className="w-6 h-6 text-red-500 mr-3" /> 
            Weer & Veiligheid
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-3">Huidige Weerstatus</label>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setWeatherStatus('SUNNY')}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${weatherStatus === 'SUNNY' ? 'border-amber-400 bg-amber-50 text-amber-600' : 'border-stone-200 bg-white hover:bg-stone-50'}`}
                >
                  <Sun className="w-8 h-8 mb-2" />
                  <span className="font-bold text-sm">Zonnig</span>
                </button>
                <button 
                  onClick={() => setWeatherStatus('WIND')}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${weatherStatus === 'WIND' ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-stone-200 bg-white hover:bg-stone-50'}`}
                >
                  <Wind className="w-8 h-8 mb-2" />
                  <span className="font-bold text-sm">Harde Wind</span>
                </button>
                <button 
                  onClick={() => setWeatherStatus('RAIN')}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${weatherStatus === 'RAIN' ? 'border-stone-400 bg-stone-100 text-stone-600' : 'border-stone-200 bg-white hover:bg-stone-50'}`}
                >
                  <CloudRain className="w-8 h-8 mb-2" />
                  <span className="font-bold text-sm">Regen</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Publieke Waarschuwing (Zichtbaar voor gasten)</label>
              <textarea 
                value={weatherMessage}
                onChange={(e) => setWeatherMessage(e.target.value)}
                placeholder="Bijv: 'I.v.m. harde wind zijn de parasols momenteel gesloten voor uw veiligheid.'"
                className="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-stone-700 resize-none h-24"
              />
            </div>

            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
              <input 
                type="checkbox" 
                id="closed-toggle" 
                checked={isClosed}
                onChange={(e) => setIsClosed(e.target.checked)}
                className="w-6 h-6 text-red-600 rounded focus:ring-red-500 border-red-300"
              />
              <label htmlFor="closed-toggle" className="ml-3 font-bold text-red-800 cursor-pointer">
                Noodsluiting (Reserveringen pauzeren)
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Pricing / Yield */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8">
          <h2 className="font-bold text-2xl font-serif mb-6 flex items-center text-stone-900">
            <TrendingUp className="w-6 h-6 text-emerald-500 mr-3" /> 
            Dynamic Pricing (Surge)
          </h2>
          <p className="text-stone-500 text-sm mb-6">Vermenigvuldig alle bed- en VIP-prijzen direct op drukke dagen. 1.00 is normaal, 1.50 is 50% duurder.</p>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-black text-stone-900">{pricingMultiplier.toFixed(2)}x</span>
              <div className="flex gap-2">
                <button onClick={() => setPricingMultiplier(Math.max(0.5, pricingMultiplier - 0.1))} className="w-12 h-12 rounded-xl bg-stone-100 hover:bg-stone-200 font-bold text-xl flex items-center justify-center">-</button>
                <button onClick={() => setPricingMultiplier(pricingMultiplier + 0.1)} className="w-12 h-12 rounded-xl bg-stone-100 hover:bg-stone-200 font-bold text-xl flex items-center justify-center">+</button>
              </div>
            </div>

            <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full ${pricingMultiplier > 1.2 ? 'bg-orange-500' : pricingMultiplier < 1.0 ? 'bg-blue-400' : 'bg-emerald-500'} transition-all`} 
                style={{ width: `${Math.min(100, Math.max(0, (pricingMultiplier / 2) * 100))}%` }}
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <h4 className="font-bold text-emerald-800 mb-1">Rekenvoorbeeld:</h4>
              <p className="text-sm text-emerald-700">Een bed van €100,- kost nu <strong>€{(100 * pricingMultiplier).toFixed(2)}</strong> op de gastenwebsite.</p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/30 hover:-translate-y-1 transition-all"
        >
          Operations Opslaan & Live Zetten
        </button>
      </div>

    </div>
  );
}
