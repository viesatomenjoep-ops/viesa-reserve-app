"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { clsx } from 'clsx';
import { Info, Map as MapIcon, List, ArrowLeft, ChevronRight, Palmtree, UtensilsCrossed, BedDouble, MapPin } from 'lucide-react';
import { Bed } from './AdminBedEditor';

export interface Location {
  id: string;
  name: string;
  pos_x: number;
  pos_y: number;
  sort_order?: number;
  venue_id?: string;
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
  const [allBeds, setAllBeds] = useState<{area_id: string, status: string}[]>([]);
  const [allVenues, setAllVenues] = useState<{id: string, name: string}[]>([]);
  const [venue, setVenue] = useState<{id?: string, name: string, map_image_url: string} | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  
  // Mobile-first: Default to LIST view. User can toggle to MAP.
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');

  useEffect(() => {
    fetchData();

    // Set up realtime subscriptions
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beds' }, (payload) => {
        setBeds(current => {
          if (payload.eventType === 'UPDATE') return current.map(b => b.id === payload.new.id ? payload.new as Bed : b);
          if (payload.eventType === 'INSERT') return [...current, payload.new as Bed];
          if (payload.eventType === 'DELETE') return current.filter(b => b.id !== payload.old.id);
          return current;
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (activeArea) {
      fetchBedsData(activeArea.id);
    }
  }, [activeArea]);

  const fetchData = async () => {
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
    
    const { data: venuesData } = await supabase.from('venues').select('id, name, map_image_url');
    if (venuesData && venuesData.length > 0) {
      setAllVenues(venuesData);
      if (!venue) setVenue(venuesData[0]);
    }

    const { data: locData } = await supabase.from('locations').select('*');
    const { data: areaData } = await supabase.from('areas').select('*');
    const { data: bedsData } = await supabase.from('beds').select('area_id, status');
    if (bedsData) setAllBeds(bedsData as any);
    if (locData) {
      // Filter by venue_id if it exists, otherwise show all
      const targetVenueId = venue?.id || venuesData?.[0]?.id;
      const filteredLocs = locData.filter(l => l.venue_id === targetVenueId || !l.venue_id);
      filteredLocs.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      setLocations(filteredLocs);

      if (areaData) {
        const validLocationIds = new Set(filteredLocs.map(l => l.id));
        const filteredAreas = areaData.filter(a => validLocationIds.has(a.location_id));
        setAreas(filteredAreas);
      }
    }
  };

  // Re-fetch locations when venue changes
  useEffect(() => {
    if (allVenues.length > 0) {
      fetchData();
    }
  }, [venue?.id]);

  const fetchBedsData = async (areaId: string) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      setBeds([
        { id: 'b1', area_id: areaId, name: 'Row 1 - A', price: 50, min_spend: 100, status: 'AVAILABLE', pos_x: 20, pos_y: 20 },
        { id: 'b2', area_id: areaId, name: 'Row 1 - B', price: 50, min_spend: 100, status: 'AVAILABLE', pos_x: 50, pos_y: 20 },
        { id: 'b3', area_id: areaId, name: 'Row 1 - C', price: 50, min_spend: 100, status: 'PARTIAL', pos_x: 80, pos_y: 20 },
        { id: 'b4', area_id: areaId, name: 'Row 2 - A', price: 40, min_spend: 80, status: 'AVAILABLE', pos_x: 20, pos_y: 50 },
        { id: 'b5', area_id: areaId, name: 'Row 2 - B', price: 40, min_spend: 80, status: 'BOOKED', pos_x: 50, pos_y: 50 },
        { id: 'b6', area_id: areaId, name: 'Row 2 - C', price: 40, min_spend: 80, status: 'AVAILABLE', pos_x: 80, pos_y: 50 },
      ]);
      return;
    }
    const { data } = await supabase.from('beds').select('*').eq('area_id', areaId);
    if (data) setBeds(data as Bed[]);

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'beds' }, (payload) => {
        setBeds(current => current.map(b => b.id === payload.new.id ? { ...b, ...payload.new } : b));
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-50 hover:bg-emerald-100 border-emerald-500 text-emerald-900 shadow-emerald-500/20';
      case 'PARTIAL': return 'bg-orange-50 hover:bg-orange-100 border-orange-400 text-orange-900 shadow-orange-400/20';
      case 'BOOKED': return 'bg-stone-200 border-red-400 text-red-900 opacity-60 cursor-not-allowed';
      default: return 'bg-stone-100 border-stone-300';
    }
  };

  const getAreaIcon = (type: string) => {
    switch (type) {
      case 'RESTAURANT': return <UtensilsCrossed className="w-5 h-5 text-stone-500" />;
      case 'HAMMOCKS': return <Palmtree className="w-5 h-5 text-emerald-600" />;
      case 'BEDS': return <BedDouble className="w-5 h-5 text-blue-600" />;
      default: return <MapPin className="w-5 h-5 text-stone-500" />;
    }
  };

  const getAreaAvailabilityInfo = (areaId: string) => {
    const areaBeds = allBeds.filter(b => b.area_id === areaId);
    if (areaBeds.length === 0) return { color: 'bg-stone-300', pulse: false, title: 'Geen data' };
    
    const available = areaBeds.filter(b => b.status === 'AVAILABLE').length;
    const partial = areaBeds.filter(b => b.status === 'PARTIAL').length;
    
    if (available > 0) return { color: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]', pulse: true, title: 'Plekken beschikbaar' };
    if (partial > 0) return { color: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]', pulse: false, title: 'Gedeeltelijk beschikbaar' };
    return { color: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]', pulse: false, title: 'Volgeboekt' };
  };

  // ---------------------------------------------------------------------------
  // RENDER: STADIUM GRID SELECTION (Once an area is chosen)
  // ---------------------------------------------------------------------------
  if (activeArea) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8 px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setActiveArea(null)}
          className="flex items-center text-stone-500 hover:text-stone-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Zones
        </button>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900">{activeArea.name}</h2>
            <p className="text-stone-500">Select a bed to continue your reservation.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div> {t('available')}</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div> Partial</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div> Booked</div>
          </div>
        </div>

        {/* Responsive Grid Container */}
        <div className="pb-8 w-full">
          <div className="w-full max-w-5xl mx-auto bg-white p-4 sm:p-10 rounded-2xl shadow-xl border border-stone-200">
            <div className="w-full text-center py-2 bg-blue-50 text-blue-800 rounded-xl text-xs font-bold uppercase tracking-widest mb-6 sm:mb-8">
              Water Side (Front)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {beds.map((bed) => (
                <button
                  key={bed.id}
                  onClick={() => (bed.status === 'AVAILABLE' || bed.status === 'PARTIAL') && onBedSelect(bed)}
                  disabled={bed.status === 'BOOKED'}
                  className={clsx(
                    "aspect-square border-2 rounded-2xl flex flex-col items-center justify-center shadow-sm transition-all duration-300 w-full",
                    getStatusColor(bed.status),
                    (bed.status === 'AVAILABLE' || bed.status === 'PARTIAL') && "hover:scale-105 hover:shadow-md active:scale-95"
                  )}
                >
                  <span className="font-bold text-sm sm:text-base text-center px-2">{bed.name}</span>
                  {bed.status === 'PARTIAL' && <span className="text-[0.6rem] font-bold text-orange-600 mt-1">Tot {bed.reserved_until}</span>}
                  <span className="text-xs font-medium opacity-80 mt-1">€{bed.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: ZONE / AREA SELECTION (List or Map)
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4 sm:px-0 relative animate-in fade-in zoom-in-95 duration-500">
      
      {/* Top Toggle Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          {allVenues.length > 1 && (
            <div className="mb-2">
              <select 
                value={venue?.id || ''} 
                onChange={(e) => {
                  const selected = allVenues.find(v => v.id === e.target.value);
                  if (selected) setVenue(selected as any);
                }}
                className="text-emerald-600 font-bold uppercase text-xs tracking-wider bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 cursor-pointer outline-none appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M3%205L6%208L9%205%22%20stroke%3D%22%23059669%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat"
                style={{ backgroundPosition: 'right 8px center' }}
              >
                {allVenues.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">{t('mapSelectLocation')}</h2>
          <p className="text-stone-500 text-sm">{t('mapChoosePreferred')}</p>
        </div>

        <div className="flex bg-white border border-stone-200 p-1 rounded-xl self-stretch sm:self-auto shadow-sm">
          <button 
            onClick={() => setViewMode('LIST')}
            className={clsx("flex-1 sm:flex-none flex justify-center items-center px-6 py-2.5 rounded-lg font-medium transition-all text-sm", viewMode === 'LIST' ? "bg-black text-white shadow-sm" : "text-stone-500 hover:text-black")}
          >
            <List className="w-4 h-4 mr-2" /> List View
          </button>
          <button 
            onClick={() => setViewMode('MAP')}
            className={clsx("flex-1 sm:flex-none flex justify-center items-center px-6 py-2.5 rounded-lg font-medium transition-all text-sm", viewMode === 'MAP' ? "bg-black text-white shadow-sm" : "text-stone-500 hover:text-black")}
          >
            <MapIcon className="w-4 h-4 mr-2" /> Map View
          </button>
        </div>
      </div>

      {viewMode === 'LIST' ? (
        // Mobile-Friendly List View
        <div className="space-y-8">
          {locations.map(loc => {
            const locAreas = areas.filter(a => a.location_id === loc.id);
            if (locAreas.length === 0) return null;
            return (
              <div key={loc.id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
                <h3 className="text-xl font-serif font-bold text-black mb-4">{loc.name.replace('Zone ', 'Zone ')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {locAreas.map(area => (
                    <button
                      key={area.id}
                      onClick={() => setActiveArea(area)}
                      className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 hover:border-black hover:shadow-lg transition-all text-left group bg-white"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="p-3 bg-white border border-stone-100 rounded-xl group-hover:border-black transition-colors">
                            {getAreaIcon(area.type)}
                          </div>
                          {(() => {
                            const info = getAreaAvailabilityInfo(area.id);
                            return (
                              <div 
                                className={clsx("absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white", info.color, info.pulse && "animate-pulse")}
                                title={info.title}
                              />
                            );
                          })()}
                        </div>
                        <div>
                          <p className="font-bold text-black">{area.name}</p>
                          <p className="text-xs text-stone-500 uppercase tracking-wider font-bold">{area.type}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-black transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Desktop-Friendly Interactive Map
        <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50 bg-stone-100"
             style={{ 
               backgroundImage: venue?.map_image_url ? `url('${venue.map_image_url}')` : 'none', 
               backgroundSize: 'cover', 
               backgroundPosition: 'center' 
             }}>
          
          {!venue?.map_image_url && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-stone-300 font-bold text-xl sm:text-3xl opacity-50 uppercase tracking-widest text-center px-4">Map Coming Soon</span>
            </div>
          )}

          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

          {/* Zones */}
          {locations.map((loc) => (
            <div
              key={loc.id}
              onMouseEnter={() => setHoveredLocation(loc.id)}
              onMouseLeave={() => setHoveredLocation(null)}
              style={{ left: `${loc.pos_x}%`, top: `${loc.pos_y}%` }}
              className={clsx(
                "absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer",
                hoveredLocation === loc.id || areas.some(a => a.location_id === loc.id && a.id === hoveredLocation)
                  ? "bg-emerald-500/20 border-4 border-emerald-500/50 z-20 scale-110" 
                  : "bg-transparent z-10"
              )}
            >
              {/* Invisible hotspot for the pre-drawn circles on the map */}
            </div>
          ))}

          {/* Areas */}
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
                {(() => {
                  const info = getAreaAvailabilityInfo(area.id);
                  return (
                    <div className={clsx("w-2 h-2 rounded-full mr-2", info.color, info.pulse && "animate-pulse")} />
                  );
                })()}
                {area.name}
              </button>
            );
          })}
        </div>
      )}
      
      {viewMode === 'MAP' && (
        <div className="mt-6 flex items-start text-stone-600 text-sm bg-white p-5 rounded-2xl shadow-sm border border-stone-100 hidden sm:flex">
          <Info className="w-5 h-5 mr-3 flex-shrink-0 text-stone-400 mt-0.5" />
          <p>{t('mapHoverZone')}</p>
        </div>
      )}
    </div>
  );
}
