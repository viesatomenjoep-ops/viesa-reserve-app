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
  x?: number; // Logical or percentage-based X position
  y?: number; // Logical or percentage-based Y position
}

// Initial mock data with positions
const initialBeds: Bed[] = [
  { id: '1', name: 'F1', zone: 'Front Row', price: 500, min_spend: 1000, status: 'AVAILABLE', x: 20, y: 80 },
  { id: '2', name: 'F2', zone: 'Front Row', price: 500, min_spend: 1000, status: 'BOOKED', x: 50, y: 80 },
  { id: '3', name: 'F3', zone: 'Front Row', price: 500, min_spend: 1000, status: 'AVAILABLE', x: 80, y: 80 },
  { id: '4', name: 'C1', zone: 'VIP Cabanas', price: 1500, min_spend: 3000, status: 'AVAILABLE', x: 30, y: 50 },
  { id: '5', name: 'C2', zone: 'VIP Cabanas', price: 1500, min_spend: 3000, status: 'AVAILABLE', x: 70, y: 50 },
  { id: '6', name: 'T1', zone: 'Restaurant', price: 200, min_spend: 500, status: 'AVAILABLE', x: 40, y: 20 },
  { id: '7', name: 'T2', zone: 'Restaurant', price: 200, min_spend: 500, status: 'RESERVED', x: 60, y: 20 },
];

interface InteractiveMapProps {
  onBedSelect: (bed: Bed) => void;
}

export default function InteractiveMap({ onBedSelect }: InteractiveMapProps) {
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const { t } = useLanguage();

  useEffect(() => {
    // Note: If you don't have the SUPABASE_URL configured yet, 
    // this won't connect and will just use the mock data above.
    
    // Fetch initial data
    const fetchBeds = async () => {
      const { data, error } = await supabase.from('beds').select('*');
      if (data && !error) {
        // Merge fetched data with positions based on names (since our DB might not have x/y initially)
        const updatedBeds = beds.map(mockBed => {
          const dbBed = data.find(b => b.name === mockBed.name);
          return dbBed ? { ...dbBed, x: mockBed.x, y: mockBed.y } : mockBed;
        });
        setBeds(updatedBeds);
      }
    };
    
    // Try to fetch, but fail gracefully if not configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      fetchBeds();

      // Subscribe to real-time changes
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
      case 'AVAILABLE': return 'bg-emerald-500 hover:bg-emerald-400 border-emerald-600 shadow-emerald-500/30';
      case 'RESERVED': return 'bg-orange-400 border-orange-500 opacity-80 cursor-not-allowed';
      case 'BOOKED': return 'bg-rose-500 border-rose-600 opacity-80 cursor-not-allowed';
      default: return 'bg-stone-300';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 relative">
      <div className="flex justify-center space-x-6 mb-6 text-sm">
        <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-emerald-500 mr-2"></div> {t('available')}</div>
        <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-orange-400 mr-2"></div> {t('reserved')}</div>
        <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-rose-500 mr-2"></div> {t('booked')}</div>
      </div>

      <div className="relative w-full aspect-[4/3] bg-stone-100 rounded-3xl overflow-hidden shadow-inner border border-stone-200 p-4">
        {/* Decorative elements representing the beach/water */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-blue-100 to-transparent opacity-50 pointer-events-none rounded-b-3xl" />
        <div className="absolute top-4 left-4 text-stone-400 font-serif italic text-lg pointer-events-none">VIESA Club</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-blue-300 font-serif italic text-lg pointer-events-none">Beach Area</div>

        {/* The Map grid/beds */}
        {beds.map((bed) => (
          <button
            key={bed.id}
            onClick={() => handleBedClick(bed)}
            disabled={bed.status !== 'AVAILABLE'}
            style={{ left: `${bed.x}%`, top: `${bed.y}%` }}
            className={clsx(
              "absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-lg border-2 backdrop-blur-sm group",
              getStatusColor(bed.status),
              bed.status === 'AVAILABLE' && "hover:scale-110 active:scale-95"
            )}
            aria-label={`Bed ${bed.name} - ${bed.status}`}
          >
            <span className="text-white font-bold text-lg sm:text-xl drop-shadow-md">{bed.name}</span>
            <span className="text-white/90 text-xs font-medium drop-shadow-md truncate w-full px-1">{bed.zone}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-4 flex items-start text-stone-500 text-sm bg-stone-50 p-4 rounded-xl border border-stone-100">
        <Info className="w-5 h-5 mr-3 flex-shrink-0 text-stone-400" />
        <p>Interact with the floorplan to select your preferred location. Green beds are instantly available for booking.</p>
      </div>
    </div>
  );
}
