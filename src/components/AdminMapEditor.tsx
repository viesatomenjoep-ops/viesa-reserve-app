"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Plus, Move, MapPin, Grid } from 'lucide-react';
import { clsx } from 'clsx';
import AdminBedEditor from './AdminBedEditor';

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
  const [editMode, setEditMode] = useState<'LOCATIONS' | 'AREAS'>('LOCATIONS');
  
  // State to handle switching to the Bed Editor for a specific Area
  const [activeArea, setActiveArea] = useState<Area | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

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
      ]);
      return;
    }

    const { data: locData } = await supabase.from('locations').select('*');
    const { data: areaData } = await supabase.from('areas').select('*');
    if (locData) setLocations(locData);
    if (areaData) setAreas(areaData);
  };

  // Convert dragged pixels to percentages
  const handleDragEnd = (id: string, type: 'LOCATION' | 'AREA', info: any) => {
    if (!containerRef.current) return;
    
    // Get container dimensions to convert pixels to percentage
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (info.point.x - rect.left) / rect.width * 100;
    const yPct = (info.point.y - rect.top) / rect.height * 100;

    // Ensure it stays between 0 and 100
    const finalX = Math.max(0, Math.min(100, xPct));
    const finalY = Math.max(0, Math.min(100, yPct));

    if (type === 'LOCATION') {
      setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, pos_x: finalX, pos_y: finalY } : loc));
      // TODO: Save to Supabase -> supabase.from('locations').update({pos_x: finalX, pos_y: finalY}).eq('id', id)
    } else {
      setAreas(prev => prev.map(area => area.id === id ? { ...area, pos_x: finalX, pos_y: finalY } : area));
    }
  };

  const handleAddClick = () => {
    if (editMode === 'LOCATIONS') {
      const name = prompt('Name of the new Zone?');
      if (name) setLocations([...locations, { id: Math.random().toString(), name, pos_x: 50, pos_y: 50 }]);
    } else if (editMode === 'AREAS' && selectedLocation) {
      const name = prompt('Name of the new Area?');
      if (name) setAreas([...areas, { id: Math.random().toString(), location_id: selectedLocation.id, name, type: 'BEDS', pos_x: 50, pos_y: 50 }]);
    }
  };

  if (activeArea) {
    return <AdminBedEditor area={activeArea} onBack={() => setActiveArea(null)} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] font-sans">
      
      {/* Control Panel */}
      <div className="bg-white border-b border-stone-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center">
            <MapPin className="mr-2 text-emerald-600" /> CBbC Layout Editor
          </h1>
          <p className="text-stone-500 text-sm mt-1">Drag and drop zones to reposition them. Ensure the map image is saved as public/calabassa-map.jpg</p>
        </div>
        
        <div className="flex bg-stone-100 p-1 rounded-xl">
          <button 
            onClick={() => { setEditMode('LOCATIONS'); setSelectedLocation(null); }}
            className={clsx("px-6 py-2.5 rounded-lg font-medium transition-all", editMode === 'LOCATIONS' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700")}
          >
            1. Move Zones
          </button>
          <button 
            onClick={() => setEditMode('AREAS')}
            disabled={!selectedLocation}
            className={clsx("px-6 py-2.5 rounded-lg font-medium transition-all", editMode === 'AREAS' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700 disabled:opacity-30")}
          >
            2. Move Sub-Areas
          </button>
        </div>

        <button 
          onClick={handleAddClick}
          className="flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add {editMode === 'LOCATIONS' ? 'Zone' : 'Area'}
        </button>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 bg-stone-200 p-4 sm:p-8 overflow-hidden flex justify-center items-center">
        
        <div 
          ref={containerRef}
          className="relative w-full max-w-7xl aspect-[16/9] bg-stone-300 rounded-2xl shadow-2xl border-4 border-white overflow-hidden"
          style={{
            backgroundImage: "url('/calabassa-map.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Missing Image Placeholder Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

          {/* Zones (Locations) */}
          {locations.map((loc) => (
            <motion.div
              key={`loc-${loc.id}`}
              drag
              dragConstraints={containerRef}
              dragMomentum={false}
              onDragEnd={(e, info) => handleDragEnd(loc.id, 'LOCATION', info)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLocation(loc);
                setEditMode('AREAS');
              }}
              style={{ left: `${loc.pos_x}%`, top: `${loc.pos_y}%`, position: 'absolute', x: '-50%', y: '-50%' }}
              className={clsx(
                "w-16 h-16 rounded-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all",
                selectedLocation?.id === loc.id 
                  ? "bg-emerald-500/30 border-4 border-emerald-500 z-30 scale-110" 
                  : "bg-transparent border-2 border-dashed border-stone-800/50 z-20 hover:bg-white/20"
              )}
            >
              <Move className="w-4 h-4 opacity-0 hover:opacity-100 absolute" />
            </motion.div>
          ))}

          {/* Sub-Areas */}
          {areas.filter(a => selectedLocation ? a.location_id === selectedLocation.id : true).map((area) => (
            <motion.div
              key={`area-${area.id}`}
              drag={editMode === 'AREAS' && selectedLocation?.id === area.location_id}
              dragConstraints={containerRef}
              dragMomentum={false}
              onDragEnd={(e, info) => handleDragEnd(area.id, 'AREA', info)}
              style={{ left: `${area.pos_x}%`, top: `${area.pos_y}%`, position: 'absolute', x: '-50%', y: '-50%' }}
              className={clsx(
                "px-4 py-2 rounded-xl text-sm font-bold shadow-xl border-2 whitespace-nowrap flex items-center gap-2 transition-colors",
                editMode === 'AREAS' && selectedLocation?.id === area.location_id
                  ? "bg-stone-900 text-white border-stone-700 z-40 cursor-grab active:cursor-grabbing hover:bg-stone-800" 
                  : "bg-stone-900/40 text-white/80 border-transparent z-10 pointer-events-none"
              )}
            >
              {area.name}
              {editMode === 'AREAS' && selectedLocation?.id === area.location_id && (
                <>
                  <Move className="w-3 h-3 text-stone-400" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveArea(area); }}
                    className="ml-2 bg-emerald-500 hover:bg-emerald-400 text-white p-1 rounded-md"
                    title="Edit Beds"
                  >
                    <Grid className="w-3 h-3" />
                  </button>
                </>
              )}
            </motion.div>
          ))}

        </div>
      </div>
    </div>
  );
}
