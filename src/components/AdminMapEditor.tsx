"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Move, MapPin, Grid, X, Settings2, Trash2 } from 'lucide-react';
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
  
  const [activeArea, setActiveArea] = useState<Area | null>(null);
  
  // Modals state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'BEDS' });

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

  const handleDragEnd = async (id: string, type: 'LOCATION' | 'AREA', info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((info.point.y - rect.top) / rect.height) * 100));

    if (type === 'LOCATION') {
      setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, pos_x: xPct, pos_y: yPct } : loc));
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        await supabase.from('locations').update({ pos_x: xPct, pos_y: yPct }).eq('id', id);
      }
    } else {
      setAreas(prev => prev.map(area => area.id === id ? { ...area, pos_x: xPct, pos_y: yPct } : area));
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        await supabase.from('areas').update({ pos_x: xPct, pos_y: yPct }).eq('id', id);
      }
    }
  };

  const handleSaveLocation = async () => {
    if (!formData.name) return;
    const newLoc: Omit<Location, 'id'> = { name: formData.name, pos_x: 50, pos_y: 50 };
    
    // Mock update
    setLocations([...locations, { ...newLoc, id: Math.random().toString() }]);
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const { data } = await supabase.from('locations').insert([newLoc]).select().single();
      if (data) fetchData();
    }
    setShowLocationModal(false);
    setFormData({ name: '', type: 'BEDS' });
  };

  const handleSaveArea = async () => {
    if (!formData.name || !selectedLocation) return;
    const newArea: Omit<Area, 'id'> = { location_id: selectedLocation.id, name: formData.name, type: formData.type, pos_x: 50, pos_y: 50 };
    
    // Mock update
    setAreas([...areas, { ...newArea, id: Math.random().toString() }]);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const { data } = await supabase.from('areas').insert([newArea]).select().single();
      if (data) fetchData();
    }
    setShowAreaModal(false);
    setFormData({ name: '', type: 'BEDS' });
  };

  if (activeArea) {
    return <AdminBedEditor area={activeArea} onBack={() => setActiveArea(null)} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] font-sans relative">
      
      {/* Control Panel */}
      <div className="bg-white border-b border-stone-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center">
            <Settings2 className="mr-2 text-emerald-600" /> Admin Map Builder
          </h1>
          <p className="text-stone-500 text-sm mt-1">Create unlimited zones and sub-areas. Drag them onto the physical locations of the map.</p>
        </div>
        
        <div className="flex bg-stone-100 p-1 rounded-xl">
          <button 
            onClick={() => { setEditMode('LOCATIONS'); setSelectedLocation(null); }}
            className={clsx("px-6 py-2.5 rounded-lg font-medium transition-all", editMode === 'LOCATIONS' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700")}
          >
            1. Edit Main Zones
          </button>
          <button 
            onClick={() => setEditMode('AREAS')}
            disabled={!selectedLocation}
            className={clsx("px-6 py-2.5 rounded-lg font-medium transition-all", editMode === 'AREAS' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700 disabled:opacity-30")}
          >
            2. Edit Areas {selectedLocation && `(${selectedLocation.name})`}
          </button>
        </div>

        <button 
          onClick={() => editMode === 'LOCATIONS' ? setShowLocationModal(true) : setShowAreaModal(true)}
          disabled={editMode === 'AREAS' && !selectedLocation}
          className="flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add {editMode === 'LOCATIONS' ? 'Main Zone' : 'Sub-Area'}
        </button>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 bg-stone-200 p-4 sm:p-8 overflow-hidden flex justify-center items-center">
        <div 
          ref={containerRef}
          className="relative w-full max-w-7xl aspect-[16/9] bg-stone-300 rounded-2xl shadow-2xl border-4 border-white overflow-hidden"
          style={{ backgroundImage: "url('/calabassa-map.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
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
                "w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all",
                selectedLocation?.id === loc.id 
                  ? "bg-emerald-500/30 border-4 border-emerald-500 z-30 scale-110" 
                  : "bg-transparent border-2 border-dashed border-stone-800/50 z-20 hover:bg-white/20"
              )}
            >
              <Move className="w-5 h-5 opacity-0 hover:opacity-100 absolute text-stone-900" />
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
                    className="ml-2 bg-emerald-500 hover:bg-emerald-400 text-white p-1 rounded-md transition-colors"
                    title="Edit Beds (Stadium Planner)"
                  >
                    <Grid className="w-3 h-3" />
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add Main Zone</h3>
                <button onClick={() => setShowLocationModal(false)} className="text-stone-400 hover:text-stone-900"><X /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Zone Name</label>
                  <input type="text" placeholder="e.g. Zone 6" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <button onClick={handleSaveLocation} className="w-full mt-6 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors">Create Zone</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Sub-Area Modal */}
      <AnimatePresence>
        {showAreaModal && selectedLocation && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add Sub-Area</h3>
                <button onClick={() => setShowAreaModal(false)} className="text-stone-400 hover:text-stone-900"><X /></button>
              </div>
              <p className="text-sm text-stone-500 mb-4">Adding into: <strong className="text-stone-900">{selectedLocation.name}</strong></p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Area Name</label>
                  <input type="text" placeholder="e.g. VIP Cabanas" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Type of Area</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="BEDS">Beds</option>
                    <option value="HAMMOCKS">Hammocks</option>
                    <option value="VIP">VIP Lounge</option>
                    <option value="RESTAURANT">Restaurant Tables</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSaveArea} className="w-full mt-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">Create & Place Area</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
