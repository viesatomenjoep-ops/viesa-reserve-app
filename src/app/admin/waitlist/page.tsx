"use client";
import React, { useState } from 'react';
import { Send, UserMinus, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminWaitlistPage() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([
    { id: 1, bed: "Bed 12 - Front Row", name: "M. de Vries", phone: "+31612345678" },
    { id: 2, bed: "Bed 14 - Front Row", name: "J. Pietersen", phone: "+31687654321" }
  ]);
  
  const [waitlist, setWaitlist] = useState([
    { id: 1, name: "S. Bakker", phone: "+31 6 11 22 33 44", notified: false },
    { id: 2, name: "A. Jansen", phone: "+31 6 99 88 77 66", notified: false }
  ]);

  const markNoShow = (id: number) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const sendSms = (id: number) => {
    setWaitlist(waitlist.map(w => w.id === id ? { ...w, notified: true } : w));
  };
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t('adminWaitlistPageTitle')}</h1>
        <p className="text-slate-500">{t('adminWaitlistPageDesc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Actieve Reserveringen - Om te annuleren */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-lg mb-4 flex justify-between items-center">
            {t('adminWaitlistBooked')}
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">{t('adminWaitlistOccupancy')}</span>
          </h2>
          
          <div className="space-y-3">
            {bookings.length === 0 && <p className="text-sm text-slate-500 italic p-4">{t('adminWaitlistNoActive')}</p>}
            {bookings.map(booking => (
              <div key={booking.id} className="border border-slate-100 p-4 rounded-xl flex justify-between items-center hover:bg-slate-50">
                <div>
                  <p className="font-bold">{booking.bed === "Bed 12 - Front Row" ? t('adminWaitlistMockBed12') : booking.bed === "Bed 14 - Front Row" ? t('adminWaitlistMockBed14') : booking.bed}</p>
                  <p className="text-sm text-slate-500">{booking.name} ({booking.phone})</p>
                </div>
                <button onClick={() => markNoShow(booking.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Markeer als No-Show">
                  <UserMinus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Wachtlijst */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white">
          <h2 className="font-bold text-lg mb-4 text-slate-200">{t('adminWaitlistListFor')}</h2>
          <p className="text-sm text-slate-400 mb-6">{t('adminWaitlistInfoSms')}</p>
          
          <div className="space-y-3 relative">
            <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-700"></div>
            
            {waitlist.length === 0 && <p className="text-sm text-slate-500 italic p-4 ml-6">{t('adminWaitlistEmpty')}</p>}
            {waitlist.map((person, index) => (
              <div key={person.id} className="relative flex gap-4 items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 shrink-0 ${person.notified ? 'bg-green-500 text-white' : index === 0 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {person.notified ? <CheckCircle2 className="w-4 h-4"/> : index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{person.name}</p>
                  <p className="text-sm text-slate-400">{person.phone}</p>
                </div>
                {!person.notified ? (
                  <button onClick={() => sendSms(person.id)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <Send className="w-4 h-4" /> {t('adminWaitlistSmsNow')}
                  </button>
                ) : (
                  <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                    {t('adminWaitlistSmsSent')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
