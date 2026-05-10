"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, GripHorizontal, Edit3, X } from 'lucide-react';
import { Area } from './AdminMapEditor';
import { clsx } from 'clsx';

export interface Bed {
  id: string;
  area_id: string;
  name: string;
  price: number;
  min_spend: number;
  status: 'AVAILABLE' | 'PARTIAL' | 'BOOKED';
  reserved_until?: string | null;
  pos_x: number;
  pos_y: number;
}

interface AdminBedEditorProps {
  area: Area;
  onBack: () => void;
}

export default function AdminBedEditor({ area, onBack }: AdminBedEditorProps) {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBeds();
  }, [area.id]);

  const fetchBeds = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      setBeds([
        { id: 'b1', area_id: area.id, name: 'Row 1 - A', price: 500, min_spend: 1000, status: 'BOOKED', pos_x: 20, pos_y: 20 },
        { id: 'b2', area_id: area.id, name: 'Row 1 - B', price: 500, min_spend: 1000, status: 'BOOKED', pos_x: 50, pos_y: 20 },
        { id: 'b3', area_id: area.id, name: 'Row 1 - C', price: 500, min_spend: 1000, status: 'AVAILABLE', pos_x: 80, pos_y: 20 },
        { id: 'b4', area_id: area.id, name: 'Row 2 - A', price: 200, min_spend: 500, status: 'PARTIAL', reserved_until: '14:30', pos_x: 20, pos_y: 50 },
        { id: 'b5', area_id: area.id, name: 'Row 2 - B', price: 200, min_spend: 500, status: 'AVAILABLE', pos_x: 50, pos_y: 50 },
        { id: 'b6', area_id: area.id, name: 'Row 2 - C', price: 200, min_spend: 500, status: 'PARTIAL', reserved_until: '13:00', pos_x: 80, pos_y: 50 },
      ]);
      return;
    }

    const { data } = await supabase.from('beds').select('*').eq('area_id', area.id);
    if (data) setBeds(data as Bed[]);
  };

  const handleDragEnd = async (id: string, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((info.point.y - rect.top) / rect.height) * 100));

    setBeds(prev => prev.map(bed => bed.id === id ? { ...bed, pos_x: xPct, pos_y: yPct } : bed));
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      await supabase.from('beds').update({ pos_x: xPct, pos_y: yPct }).eq('id', id);
    }
  };

  const handleAddBed = async () => {
    const newBed: Omit<Bed, 'id'> = {
      area_id: area.id,
      name: 'New Bed',
      price: 100,
      min_spend: 250,
      status: 'AVAILABLE',
      pos_x: 50,
      pos_y: 50
    };
    
    // Optimistic UI for mock
    setBeds([...beds, { ...newBed, id: Math.random().toString() }]);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const { data } = await supabase.from('beds').insert([newBed]).select().single();
      if (data) fetchBeds(); // refresh to get real ID
    }
  };

  const saveBedDetails = async () => {
    if (!editingBed) return;
    
    setBeds(prev => prev.map(b => b.id === editingBed.id ? editingBed : b));
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      await supabase.from('beds').update({
        name: editingBed.name,
        price: editingBed.price,
        min_spend: editingBed.min_spend,
        status: editingBed.status,
        reserved_until: editingBed.status === 'PARTIAL' ? editingBed.reserved_until : null
      }).eq('id', editingBed.id);
    }
    
    setEditingBed(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-50 border-emerald-400 text-emerald-900';
      case 'PARTIAL': return 'bg-orange-50 border-orange-400 text-orange-900';
      case 'BOOKED': return 'bg-red-50 border-red-400 text-red-900';
      default: return 'bg-stone-50 border-stone-300';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] font-sans relative">
      <div className="bg-white border-b border-stone-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 p-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Bed Layout Editor</h1>
            <p className="text-stone-500 text-sm mt-1">Editing seating/beds for: <strong className="text-emerald-700">{area.name}</strong></p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex gap-3 text-xs font-bold mr-4">
             <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-1" /> Vrij</div>
             <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-400 mr-1" /> Tot tijdstip</div>
             <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-1" /> Bezet (Hele dag)</div>
          </div>
          <button 
            onClick={handleAddBed}
            className="flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Bed
          </button>
        </div>
      </div>

      <div className="flex-1 bg-stone-100 p-8 overflow-hidden flex justify-center items-center">
        {/* Stadium Grid Container */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-4xl aspect-[4/3] bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-stone-200"
          style={{
            backgroundImage: "linear-gradient(#f5f5f4 1px, transparent 1px), linear-gradient(90deg, #f5f5f4 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold uppercase tracking-widest pointer-events-none">
            Water Side (Front)
          </div>

          {beds.map((bed) => (
            <motion.div
              key={bed.id}
              drag
              dragConstraints={containerRef}
              dragMomentum={false}
              onDragEnd={(e, info) => handleDragEnd(bed.id, info)}
              style={{ left: `${bed.pos_x}%`, top: `${bed.pos_y}%`, position: 'absolute', x: '-50%', y: '-50%' }}
              className={clsx(
                "w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-xl flex flex-col items-center justify-center shadow-md cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow group",
                getStatusColor(bed.status)
              )}
            >
              <GripHorizontal className="w-4 h-4 text-stone-300 absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={(e) => { e.stopPropagation(); setEditingBed(bed); }}
                className="absolute -right-2 -top-2 bg-stone-900 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-600"
              >
                <Edit3 className="w-3 h-3" />
              </button>

              <span className="font-bold text-sm truncate w-full text-center px-1">{bed.name}</span>
              {bed.status === 'PARTIAL' && <span className="text-[0.6rem] font-bold text-orange-600">Tot {bed.reserved_until}</span>}
              <span className="text-xs opacity-70">€{bed.price}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Bed Modal */}
      {editingBed && (
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit Bed</h3>
              <button onClick={() => setEditingBed(null)} className="text-stone-400 hover:text-stone-900"><X /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={editingBed.name} 
                  onChange={(e) => setEditingBed({...editingBed, name: e.target.value})}
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-stone-700 mb-1">Price (€)</label>
                  <input 
                    type="number" 
                    value={editingBed.price} 
                    onChange={(e) => setEditingBed({...editingBed, price: parseFloat(e.target.value)})}
                    className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-stone-700 mb-1">Min Spend (€)</label>
                  <input 
                    type="number" 
                    value={editingBed.min_spend} 
                    onChange={(e) => setEditingBed({...editingBed, min_spend: parseFloat(e.target.value)})}
                    className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Status</label>
                <select 
                  value={editingBed.status}
                  onChange={(e) => setEditingBed({...editingBed, status: e.target.value as any})}
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="AVAILABLE">AVAILABLE (Green)</option>
                  <option value="PARTIAL">PARTIALLY BOOKED (Orange)</option>
                  <option value="BOOKED">BOOKED ALL DAY (Red)</option>
                </select>
              </div>

              {editingBed.status === 'PARTIAL' && (
                <div>
                  <label className="block text-sm font-bold text-orange-700 mb-1">Reserved Until (e.g. 14:00)</label>
                  <input 
                    type="time" 
                    value={editingBed.reserved_until || ''} 
                    onChange={(e) => setEditingBed({...editingBed, reserved_until: e.target.value})}
                    className="w-full p-2 border border-orange-300 bg-orange-50 rounded-lg outline-none"
                  />
                </div>
              )}
            </div>

            <button 
              onClick={saveBedDetails}
              className="w-full mt-6 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
