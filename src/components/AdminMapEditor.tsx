"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Move, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

// Using types that match our new schema
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

export default function AdminMapEditor() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [editMode, setEditMode] = useState<'LOCATIONS' | 'AREAS' | 'BEDS'>('LOCATIONS');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Mock Data if Supabase is not connected
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

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (editMode === 'LOCATIONS') {
      const newName = prompt('Enter new Zone name (e.g. Zone 6):');
      if (newName) {
        const newLoc = { id: Math.random().toString(), name: newName, pos_x: x, pos_y: y };
        setLocations([...locations, newLoc]);
        // Here you would save to Supabase
      }
    } else if (editMode === 'AREAS' && selectedLocation) {
      const newName = prompt('Enter new Area name (e.g. Camas Chiringo):');
      if (newName) {
        const newArea = { id: Math.random().toString(), location_id: selectedLocation.id, name: newName, type: 'BEDS', pos_x: x, pos_y: y };
        setAreas([...areas, newArea]);
        // Here you would save to Supabase
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Top Bar Admin Controls */}
      <div className="bg-white border-b border-stone-200 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">CBbC Layout Editor</h1>
          <p className="text-stone-500 text-sm">Click on the map to place items.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => { setEditMode('LOCATIONS'); setSelectedLocation(null); }}
            className={clsx("px-4 py-2 rounded-lg font-medium", editMode === 'LOCATIONS' ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-700")}
          >
            1. Edit Zones
          </button>
          <button 
            onClick={() => setEditMode('AREAS')}
            disabled={!selectedLocation}
            className={clsx("px-4 py-2 rounded-lg font-medium", editMode === 'AREAS' ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-700 disabled:opacity-50")}
          >
            2. Edit Areas {selectedLocation && `(${selectedLocation.name})`}
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-stone-100 p-8 overflow-hidden flex justify-center items-center">
        <div 
          className="relative w-full max-w-6xl aspect-[16/9] bg-white rounded-xl shadow-2xl overflow-hidden cursor-crosshair border-4 border-stone-300"
          onClick={handleMapClick}
          style={{
            // This expects the user to upload 'calabassa-map.jpg' into the /public folder
            backgroundImage: "url('/calabassa-map.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#e6dfd1' // Fallback color if image is missing
          }}
        >
          {/* Render Locations (Zones) */}
          {locations.map((loc) => (
            <div
              key={loc.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLocation(loc);
                setEditMode('AREAS');
              }}
              style={{ left: `${loc.pos_x}%`, top: `${loc.pos_y}%` }}
              className={clsx(
                "absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center font-serif text-2xl font-bold shadow-lg transition-transform cursor-pointer border-4",
                selectedLocation?.id === loc.id ? "bg-emerald-500 border-white text-white scale-125 z-20" : "bg-white border-stone-900 text-stone-900 hover:scale-110 z-10"
              )}
            >
              {loc.name.replace('Zone ', '')}
            </div>
          ))}

          {/* Render Areas if a location is selected OR if in Locations mode show all lightly */}
          {areas.filter(a => selectedLocation ? a.location_id === selectedLocation.id : true).map((area) => (
            <div
              key={area.id}
              style={{ left: `${area.pos_x}%`, top: `${area.pos_y}%` }}
              className={clsx(
                "absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-bold shadow-md cursor-pointer whitespace-nowrap",
                selectedLocation ? "bg-stone-900/80 text-white z-10 hover:bg-emerald-600" : "bg-stone-900/40 text-white/80 z-0 pointer-events-none"
              )}
            >
              {area.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
