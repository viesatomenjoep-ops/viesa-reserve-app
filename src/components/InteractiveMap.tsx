"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { clsx } from 'clsx';
import { Info, MapPin, ArrowLeft } from 'lucide-react';
import { Bed } from './AdminBedEditor';

export interface Location {
  id: string;
  name: string;
  pos_x: number;
  pos_y: number;
}

export interface Area {
  id: string;
  location_id: string;
  name: string;
  type: string;
  pos_x: number;
  pos_y: number;
}

interface InteractiveMapProps {
  onBedSelect: (bed: Bed) => void;
}

export default function InteractiveMap({ onBedSelect }: InteractiveMapProps) {
  const { t } = useLanguage();
  const [locations, setLocations] = useState<Location[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [activeArea, setActiveArea] = useState<Area | null>(null);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  useEffect(() => {
    fetchMapData();
  }, []);

  useEffect(() => {
    if (activeArea) fetchBedsData(activeArea.id);
  }, [activeArea]);

  const fetchMapData = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      setLocations([
        { id: '1', name: 'Zone 1', pos_x: 15, pos_y: 50 },
        { id: '2', name: 'Zone 2', pos_x: 30, pos_y: 25 },
        { id: '3', name: 'Zone 3', pos_x: 65, pos_y: 25 },
        { id: '4', name: 'Zone 4', pos_x: 85, pos_y: 45 },
        { id: '5', name: 'Zone 5', pos_x: 90, pos_y: 75 },
      ]);
      setAreas([
        { id: 'a1', location_id: '1', name: 'Restaurante Chiringo', type: 'RESTAURANT', pos_x: 5, pos_y: 40 },
        { id: 'a2', location_id: '1', name: 'Camas Chiringo', type: 'BEDS', pos_x: 18, pos_y: 38 },
        { id: 'a3', location_id: '1', name: 'Hamacas Chiringo', type: 'HAMMOCKS', pos_x: 15, pos_y: 60 },
        { id: 'a4', location_id: '2', name: 'Hamacas Mumm', type: 'HAMMOCKS', pos_x: 35, pos_y: 20 },
        { id: 'a5', location_id: '2', name: 'Camas Mumm', type: 'BEDS', pos_x: 38, pos_y: 35 },
      ]);
      return;
    }
    const { data: locData } = await supabase.from('locations').select('*');
    const { data: areaData } = await supabase.from('areas').select('*');
    if (locData) setLocations(locData);
    if (areaData) setAreas(areaData);
  };

  const fetchBedsData = async (areaId: string) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      setBeds([
        { id: 'b1', area_id: areaId, name: 'Row 1 - A', price: 50, status: 'AVAILABLE', pos_x: 20, pos_y: 20 },
        { id: 'b2', area_id: areaId, name: 'Row 1 - B', price: 50, status: 'AVAILABLE', pos_x: 50, pos_y: 20 },
        { id: 'b3', area_id: areaId, name: 'Row 1 - C', price: 50, status: 'RESERVED', pos_x: 80, pos_y: 20 },
        { id: 'b4', area_id: areaId, name: 'Row 2 - A', price: 40, status: 'AVAILABLE', pos_x: 20, pos_y: 50 },
        { id: 'b5', area_id: areaId, name: 'Row 2 - B', price: 40, status: 'BOOKED', pos_x: 50, pos_y: 50 },
        { id: 'b6', area_id: areaId, name: 'Row 2 - C', price: 40, status: 'AVAILABLE', pos_x: 80, pos_y: 50 },
      ]);
      return;
    }
    const { data } = await supabase.from('beds').select('*').eq('area_id', areaId);
    if (data) setBeds(data as Bed[]);

    // Subscribe to beds changes for realtime green/orange/red updates
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'beds' }, (payload) => {
        setBeds(current => current.map(b => b.id === payload.new.id ? { ...b, ...payload.new } : b));
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-50 hover:bg-emerald-100 border-emerald-500 text-emerald-900 shadow-emerald-500/20';
      case 'RESERVED': return 'bg-orange-100 border-orange-400 text-orange-900 opacity-80 cursor-not-allowed';
      case 'BOOKED': return 'bg-stone-200 border-stone-400 text-stone-500 opacity-60 cursor-not-allowed';
      default: return 'bg-stone-100 border-stone-300';
    }
  };

  if (activeArea) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setActiveArea(null)}
          className="flex items-center text-stone-500 hover:text-stone-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Map
        </button>

        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900">{activeArea.name}</h2>
            <p className="text-stone-500">Select a bed to continue your reservation.</p>
          </div>
          <div className="flex gap-4 text-sm font-medium">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div> {t('available')}</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div> {t('reserved')}</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-stone-400 mr-2"></div> {t('booked')}</div>
          </div>
        </div>

        <div 
          className="relative w-full aspect-[4/3] bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200"
          style={{ backgroundImage: "linear-gradient(#f5f5f4 1px, transparent 1px), linear-gradient(90deg, #f5f5f4 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold uppercase tracking-widest pointer-events-none">
            Water Side (Front)
          </div>

          {beds.map((bed) => (
            <button
              key={bed.id}
              onClick={() => bed.status === 'AVAILABLE' && onBedSelect(bed)}
              disabled={bed.status !== 'AVAILABLE'}
              style={{ left: `${bed.pos_x}%`, top: `${bed.pos_y}%`, position: 'absolute', transform: 'translate(-50%, -50%)' }}
              className={clsx(
                "w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-2xl flex flex-col items-center justify-center shadow-md transition-all duration-300",
                getStatusColor(bed.status),
                bed.status === 'AVAILABLE' && "hover:scale-110 active:scale-95"
              )}
            >
              <span className="font-bold text-lg">{bed.name}</span>
              <span className="text-xs font-medium opacity-80">€{bed.price}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-8 relative animate-in fade-in zoom-in-95 duration-500">
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50 bg-stone-300"
           style={{ backgroundImage: "url('/calabassa-map.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        
        {/* Missing Image Placeholder Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

        {/* Zones (Locations) */}
        {locations.map((loc) => (
          <div
            key={loc.id}
            onMouseEnter={() => setHoveredLocation(loc.id)}
            onMouseLeave={() => setHoveredLocation(null)}
            style={{ left: `${loc.pos_x}%`, top: `${loc.pos_y}%` }}
            className={clsx(
              "absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 border-4 cursor-default",
              hoveredLocation === loc.id || areas.some(a => a.location_id === loc.id && a.id === hoveredLocation)
                ? "bg-stone-900 border-white text-white z-20 scale-110" 
                : "bg-white/90 border-stone-800 text-stone-900 z-10"
            )}
          >
            <span className="font-serif text-xl font-bold">{loc.name.replace('Zone ', '')}</span>
          </div>
        ))}

        {/* Sub-Areas */}
        {areas.map((area) => {
          const isHovered = hoveredLocation === area.location_id || hoveredLocation === area.id;
          return (
            <button
              key={area.id}
              onMouseEnter={() => setHoveredLocation(area.id)}
              onMouseLeave={() => setHoveredLocation(null)}
              onClick={() => setActiveArea(area)}
              style={{ left: `${area.pos_x}%`, top: `${area.pos_y}%` }}
              className={clsx(
                "absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-sm font-bold shadow-xl border-2 whitespace-nowrap transition-all duration-300 flex items-center",
                isHovered
                  ? "bg-emerald-600 text-white border-white z-40 scale-110 hover:bg-emerald-500" 
                  : "bg-stone-900/80 text-white/90 border-transparent z-30 hover:scale-105"
              )}
            >
              {area.name}
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 flex items-start text-stone-600 text-sm bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
        <Info className="w-5 h-5 mr-3 flex-shrink-0 text-stone-400 mt-0.5" />
        <p>Explore the beach club map. Hover over a zone to highlight it, and click on any specific area (e.g. "Camas Chiringo") to view the available beds and make a reservation.</p>
      </div>
    </div>
  );
}
