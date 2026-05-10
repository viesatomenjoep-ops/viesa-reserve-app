"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { clsx } from 'clsx';
import { Info } from 'lucide-react';

export interface Bed {
  id: string;
  name: string;
  zone: string;
  price: number;
  min_spend: number;
  status: 'AVAILABLE' | 'RESERVED' | 'BOOKED';
  pos_x: number; 
  pos_y: number; 
}

interface InteractiveMapProps {
  onBedSelect: (bed: Bed) => void;
}

export default function InteractiveMap({ onBedSelect }: InteractiveMapProps) {
  const [beds, setBeds] = useState<Bed[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    // Fetch initial data
    const fetchBeds = async () => {
      // If we don't have real keys, this will fail gracefully or we can mock it
      if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Load fallback mock data matching our new schema
        setBeds([
          { id: '1', name: '101', zone: 'Zone 1: Front Row', price: 500, min_spend: 1000, status: 'AVAILABLE', pos_x: 20, pos_y: 85 },
          { id: '2', name: '102', zone: 'Zone 1: Front Row', price: 500, min_spend: 1000, status: 'AVAILABLE', pos_x: 40, pos_y: 85 },
          { id: '3', name: '103', zone: 'Zone 1: Front Row', price: 500, min_spend: 1000, status: 'RESERVED', pos_x: 60, pos_y: 85 },
          { id: '4', name: '104', zone: 'Zone 1: Front Row', price: 500, min_spend: 1000, status: 'AVAILABLE', pos_x: 80, pos_y: 85 },
          { id: '5', name: '201', zone: 'Zone 2: Second Row', price: 400, min_spend: 800, status: 'AVAILABLE', pos_x: 25, pos_y: 70 },
          { id: '6', name: '202', zone: 'Zone 2: Second Row', price: 400, min_spend: 800, status: 'BOOKED', pos_x: 45, pos_y: 70 },
          { id: '7', name: '203', zone: 'Zone 2: Second Row', price: 400, min_spend: 800, status: 'AVAILABLE', pos_x: 65, pos_y: 70 },
          { id: '8', name: 'V1', zone: 'Zone 3: VIP Deck', price: 1500, min_spend: 3000, status: 'AVAILABLE', pos_x: 35, pos_y: 50 },
          { id: '9', name: 'V2', zone: 'Zone 3: VIP Deck', price: 1500, min_spend: 3000, status: 'AVAILABLE', pos_x: 65, pos_y: 50 },
          { id: '10', name: 'C1', zone: 'Zone 4: Cabanas', price: 2000, min_spend: 5000, status: 'AVAILABLE', pos_x: 10, pos_y: 40 },
          { id: '11', name: 'C2', zone: 'Zone 4: Cabanas', price: 2000, min_spend: 5000, status: 'AVAILABLE', pos_x: 90, pos_y: 40 },
          { id: '12', name: 'P1', zone: 'Zone 5: Poolside', price: 600, min_spend: 1200, status: 'AVAILABLE', pos_x: 30, pos_y: 30 },
          { id: '13', name: 'P2', zone: 'Zone 5: Poolside', price: 600, min_spend: 1200, status: 'AVAILABLE', pos_x: 50, pos_y: 30 },
          { id: '14', name: 'P3', zone: 'Zone 5: Poolside', price: 600, min_spend: 1200, status: 'RESERVED', pos_x: 70, pos_y: 30 },
          { id: '15', name: 'T1', zone: 'Restaurant', price: 0, min_spend: 500, status: 'AVAILABLE', pos_x: 30, pos_y: 10 },
          { id: '16', name: 'T2', zone: 'Restaurant', price: 0, min_spend: 500, status: 'AVAILABLE', pos_x: 50, pos_y: 10 },
          { id: '17', name: 'T3', zone: 'Restaurant', price: 0, min_spend: 500, status: 'AVAILABLE', pos_x: 70, pos_y: 10 },
        ]);
        return;
      }

      const { data, error } = await supabase.from('beds').select('*');
      if (data && !error) {
        setBeds(data as Bed[]);
      }
    };
    
    fetchBeds();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'beds' },
          (payload) => {
            setBeds(currentBeds => 
              currentBeds.map(bed => 
                bed.id === payload.new.id ? { ...bed, ...payload.new } : bed
              )
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleBedClick = (bed: Bed) => {
    if (bed.status === 'AVAILABLE') {
      onBedSelect(bed);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-white/80 hover:bg-white border-emerald-500 text-emerald-900 shadow-emerald-500/20';
      case 'RESERVED': return 'bg-orange-100/90 border-orange-400 text-orange-900 opacity-80 cursor-not-allowed';
      case 'BOOKED': return 'bg-stone-200/90 border-stone-400 text-stone-500 opacity-60 cursor-not-allowed';
      default: return 'bg-stone-100/80 border-stone-300';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500';
      case 'RESERVED': return 'bg-orange-400';
      case 'BOOKED': return 'bg-stone-400';
      default: return 'bg-stone-300';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 relative">
      <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-medium">
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div> {t('available')}</div>
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm"><div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div> {t('reserved')}</div>
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm"><div className="w-3 h-3 rounded-full bg-stone-400 mr-2"></div> {t('booked')}</div>
      </div>

      <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/10] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50">
        
        {/* Subtle Beach Background Layer */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #f3eee6 0%, #e6dfd1 30%, #d8cfbe 70%, #90b8d4 100%)',
          }}
        >
          {/* Decorative Waves Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
            background: 'radial-gradient(ellipse at top, transparent 50%, rgba(255,255,255,0.3) 100%)',
            borderTopLeftRadius: '50% 20%',
            borderTopRightRadius: '50% 20%',
          }}></div>
        </div>

        {/* Labels for Zones (Background) */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 text-stone-400/50 font-serif text-2xl sm:text-4xl pointer-events-none font-bold uppercase tracking-widest z-0">
          Restaurant
        </div>
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 text-stone-400/50 font-serif text-2xl sm:text-4xl pointer-events-none font-bold uppercase tracking-widest z-0">
          Pool Area
        </div>
        <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 text-blue-100/50 font-serif text-2xl sm:text-4xl pointer-events-none font-bold uppercase tracking-widest z-0">
          Sea Front
        </div>

        {/* The Map grid/beds */}
        {beds.map((bed) => (
          <button
            key={bed.id}
            onClick={() => handleBedClick(bed)}
            disabled={bed.status !== 'AVAILABLE'}
            style={{ left: `${bed.pos_x}%`, top: `${bed.pos_y}%` }}
            className={clsx(
              "absolute transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-lg border-2 backdrop-blur-md z-10 group",
              getStatusColor(bed.status),
              bed.status === 'AVAILABLE' && "hover:scale-110 active:scale-95"
            )}
            title={`${bed.name} - ${bed.zone}`}
            aria-label={`Bed ${bed.name} - ${bed.status}`}
          >
            {/* Status dot indicator */}
            <div className={clsx("absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white", getStatusIndicator(bed.status))} />
            
            <span className="font-bold text-sm sm:text-base md:text-xl drop-shadow-sm">{bed.name}</span>
            <span className="text-[0.6rem] sm:text-xs font-medium opacity-70 truncate w-full px-1">{bed.zone.split(':')[0]}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-6 flex items-start text-stone-600 text-sm bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
        <Info className="w-5 h-5 mr-3 flex-shrink-0 text-stone-400 mt-0.5" />
        <p>Interact with the floorplan to select your preferred location. The layout dynamically loads from our database, allowing the management to fully customize zones, coordinates, and pricing in real-time.</p>
      </div>
    </div>
  );
}
