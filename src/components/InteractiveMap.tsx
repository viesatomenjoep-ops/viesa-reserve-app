"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { clsx } from 'clsx';
import { Info, Umbrella } from 'lucide-react';

export interface Zone {
  id: string;
  name: string;
}

export interface Bed {
  id: string;
  zone_id: string;
  name: string;
  item_type: 'sunbed' | 'cabana' | 'restaurant_table' | 'lounge';
  price: number;
  min_spend: number;
  status: 'AVAILABLE' | 'RESERVED' | 'BOOKED';
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  rotation: number;
}

// Logical Fallback Data (In case Supabase is not connected yet)
const fallbackZones: Zone[] = [
  { id: '1', name: 'Zone 1: Front Row' },
  { id: '2', name: 'Zone 2: Second Row' },
  { id: '3', name: 'VIP Cabanas' },
  { id: '4', name: 'Restaurant' }
];

const fallbackBeds: Bed[] = [
  { id: '1', zone_id: '1', name: '1A', item_type: 'sunbed', price: 500, min_spend: 1000, status: 'AVAILABLE', x_position: 20, y_position: 85, width: 8, height: 12, rotation: 0 },
  { id: '2', zone_id: '1', name: '1B', item_type: 'sunbed', price: 500, min_spend: 1000, status: 'AVAILABLE', x_position: 40, y_position: 85, width: 8, height: 12, rotation: 0 },
  { id: '3', zone_id: '1', name: '1C', item_type: 'sunbed', price: 500, min_spend: 1000, status: 'AVAILABLE', x_position: 60, y_position: 85, width: 8, height: 12, rotation: 0 },
  { id: '4', zone_id: '1', name: '1D', item_type: 'sunbed', price: 500, min_spend: 1000, status: 'BOOKED', x_position: 80, y_position: 85, width: 8, height: 12, rotation: 0 },
  { id: '5', zone_id: '2', name: '2A', item_type: 'sunbed', price: 300, min_spend: 600, status: 'AVAILABLE', x_position: 30, y_position: 65, width: 8, height: 12, rotation: 0 },
  { id: '6', zone_id: '2', name: '2B', item_type: 'sunbed', price: 300, min_spend: 600, status: 'RESERVED', x_position: 50, y_position: 65, width: 8, height: 12, rotation: 0 },
  { id: '7', zone_id: '2', name: '2C', item_type: 'sunbed', price: 300, min_spend: 600, status: 'AVAILABLE', x_position: 70, y_position: 65, width: 8, height: 12, rotation: 0 },
  { id: '8', zone_id: '3', name: 'VIP-1', item_type: 'cabana', price: 1500, min_spend: 3000, status: 'AVAILABLE', x_position: 15, y_position: 30, width: 15, height: 15, rotation: 0 },
  { id: '9', zone_id: '3', name: 'VIP-2', item_type: 'cabana', price: 1500, min_spend: 3000, status: 'AVAILABLE', x_position: 85, y_position: 30, width: 15, height: 15, rotation: 0 },
  { id: '10', zone_id: '4', name: 'T1', item_type: 'restaurant_table', price: 100, min_spend: 250, status: 'AVAILABLE', x_position: 40, y_position: 15, width: 8, height: 8, rotation: 0 },
  { id: '11', zone_id: '4', name: 'T2', item_type: 'restaurant_table', price: 100, min_spend: 250, status: 'AVAILABLE', x_position: 50, y_position: 15, width: 8, height: 8, rotation: 0 },
  { id: '12', zone_id: '4', name: 'T3', item_type: 'restaurant_table', price: 100, min_spend: 250, status: 'AVAILABLE', x_position: 60, y_position: 15, width: 8, height: 8, rotation: 0 },
];

export interface InteractiveMapProps {
  onBedSelect: (bed: Bed & { zone_name?: string }) => void;
}

export default function InteractiveMap({ onBedSelect }: InteractiveMapProps) {
  const [beds, setBeds] = useState<Bed[]>(fallbackBeds);
  const [zones, setZones] = useState<Zone[]>(fallbackZones);
  const { t } = useLanguage();

  useEffect(() => {
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
    
    if (isConfigured) {
      const fetchData = async () => {
        const [zonesResponse, bedsResponse] = await Promise.all([
          supabase.from('zones').select('*'),
          supabase.from('beds').select('*')
        ]);
        
        if (zonesResponse.data) setZones(zonesResponse.data);
        if (bedsResponse.data) setBeds(bedsResponse.data);
      };

      fetchData();

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
      const zoneName = zones.find(z => z.id === bed.zone_id)?.name || 'Unknown Zone';
      onBedSelect({ ...bed, zone_name: zoneName });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500/90 hover:bg-emerald-400 border-emerald-600 shadow-emerald-500/30';
      case 'RESERVED': return 'bg-orange-400/90 border-orange-500 opacity-80 cursor-not-allowed';
      case 'BOOKED': return 'bg-rose-500/90 border-rose-600 opacity-80 cursor-not-allowed';
      default: return 'bg-stone-300/90';
    }
  };

  const getItemShape = (type: string) => {
    switch (type) {
      case 'cabana': return 'rounded-sm';
      case 'restaurant_table': return 'rounded-full';
      case 'sunbed':
      default: return 'rounded-xl sm:rounded-2xl';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 relative">
      <div className="flex justify-center space-x-6 mb-6 text-sm">
        <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-emerald-500 mr-2"></div> {t('available')}</div>
        <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-orange-400 mr-2"></div> {t('reserved')}</div>
        <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-rose-500 mr-2"></div> {t('booked')}</div>
      </div>

      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
        
        {/* Beautiful, light, subtle beach background via CSS overlay + Unsplash image */}
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000')" }}
        />
        
        {/* Sand to Water Gradient Overlay to make it very light and functional */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-stone-100/90 via-stone-50/70 to-blue-50/80 pointer-events-none" />

        {/* Decorative elements representing the beach/water */}
        <div className="absolute top-4 left-4 z-10 text-stone-500 font-serif italic text-xl pointer-events-none drop-shadow-md">VIESA Club</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-stone-400 font-serif uppercase tracking-widest text-sm pointer-events-none">Sea / Ocean</div>

        {/* The Map grid/beds */}
        <div className="absolute inset-0 z-10 p-4">
          {beds.map((bed) => (
            <button
              key={bed.id}
              onClick={() => handleBedClick(bed)}
              disabled={bed.status !== 'AVAILABLE'}
              style={{ 
                left: `${bed.x_position}%`, 
                top: `${bed.y_position}%`,
                width: `${bed.width}%`,
                height: `${bed.height}%`,
                transform: `translate(-50%, -50%) rotate(${bed.rotation}deg)`
              }}
              className={clsx(
                "absolute flex flex-col items-center justify-center transition-all duration-300 shadow-lg border-2 backdrop-blur-md group",
                getStatusColor(bed.status),
                getItemShape(bed.item_type),
                bed.status === 'AVAILABLE' && "hover:scale-110 active:scale-95 hover:z-20 hover:shadow-xl"
              )}
              aria-label={`Bed ${bed.name} - ${bed.status}`}
            >
              {bed.item_type === 'cabana' && <Umbrella className="w-4 h-4 sm:w-6 sm:h-6 text-white mb-1 opacity-80" />}
              <span className="text-white font-bold text-xs sm:text-lg drop-shadow-md">{bed.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex items-start text-stone-500 text-sm bg-stone-50 p-4 rounded-xl border border-stone-100">
        <Info className="w-5 h-5 mr-3 flex-shrink-0 text-stone-400" />
        <p>Interact with the floorplan to select your preferred location. Green beds are instantly available for booking. The layout is fully customizable from the database.</p>
      </div>
    </div>
  );
}
