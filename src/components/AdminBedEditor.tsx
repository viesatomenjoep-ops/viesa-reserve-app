"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, GripHorizontal } from 'lucide-react';
import { Area } from './AdminMapEditor';
import { clsx } from 'clsx';

export interface Bed {
  id: string;
  area_id: string;
  name: string;
  price: number;
  status: string;
  pos_x: number;
  pos_y: number;
}

interface AdminBedEditorProps {
  area: Area;
  onBack: () => void;
}

export default function AdminBedEditor({ area, onBack }: AdminBedEditorProps) {
  const [beds, setBeds] = useState<Bed[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBeds();
  }, [area.id]);

  const fetchBeds = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      // Mock beds for this area (Stadium seating style)
      setBeds([
        { id: 'b1', area_id: area.id, name: 'Row 1 - A', price: 50, status: 'AVAILABLE', pos_x: 20, pos_y: 20 },
        { id: 'b2', area_id: area.id, name: 'Row 1 - B', price: 50, status: 'AVAILABLE', pos_x: 50, pos_y: 20 },
        { id: 'b3', area_id: area.id, name: 'Row 1 - C', price: 50, status: 'AVAILABLE', pos_x: 80, pos_y: 20 },
        { id: 'b4', area_id: area.id, name: 'Row 2 - A', price: 40, status: 'AVAILABLE', pos_x: 20, pos_y: 50 },
        { id: 'b5', area_id: area.id, name: 'Row 2 - B', price: 40, status: 'AVAILABLE', pos_x: 50, pos_y: 50 },
        { id: 'b6', area_id: area.id, name: 'Row 2 - C', price: 40, status: 'AVAILABLE', pos_x: 80, pos_y: 50 },
      ]);
      return;
    }

    const { data } = await supabase.from('beds').select('*').eq('area_id', area.id);
    if (data) setBeds(data as Bed[]);
  };

  const handleDragEnd = (id: string, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((info.point.y - rect.top) / rect.height) * 100));

    setBeds(prev => prev.map(bed => bed.id === id ? { ...bed, pos_x: xPct, pos_y: yPct } : bed));
    // TODO: Update Supabase
  };

  const handleAddBed = () => {
    const name = prompt('Bed Name/Number (e.g., A12):');
    if (name) {
      setBeds([...beds, { id: Math.random().toString(), area_id: area.id, name, price: 100, status: 'AVAILABLE', pos_x: 50, pos_y: 50 }]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] font-sans">
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
        
        <button 
          onClick={handleAddBed}
          className="flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add Bed / Seat
        </button>
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
              className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex flex-col items-center justify-center shadow-md cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow group"
            >
              <GripHorizontal className="w-4 h-4 text-emerald-300 absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-bold text-stone-800 text-sm">{bed.name}</span>
              <span className="text-xs text-stone-500">€{bed.price}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
