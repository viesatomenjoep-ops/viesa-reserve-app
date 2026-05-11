"use client";
import React from 'react';
import { Sun, CloudRain, Settings, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminYieldPage() {
  const { t } = useLanguage();
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('adminYieldPageTitle')}</h1>
          <p className="text-slate-500">{t('adminYieldPageDesc')}</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-medium flex items-center gap-2 border border-indigo-100">
          <Settings className="w-4 h-4" /> {t('adminYieldAutopilot')}
        </div>
      </div>

      <div className="space-y-6">
        {/* Rule 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm">
          <div className="flex items-center gap-4 w-full md:w-1/3">
            <div className="p-4 bg-amber-100 text-amber-600 rounded-full">
              <Sun className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{t('adminYieldSunnyWarm')}</p>
              <p className="text-sm text-slate-500">{t('adminYieldSunnyDesc')}</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-slate-300 hidden md:block" />
          <div className="flex-1 w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="font-semibold text-slate-700 mb-2">{t('adminYieldAction')}</p>
            <div className="flex gap-4">
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex-1 text-center">
                <span className="block text-xs text-slate-500">{t('adminYieldBaseBedPrice')}</span>
                <span className="font-bold text-green-600">+ 20%</span>
              </div>
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex-1 text-center">
                <span className="block text-xs text-slate-500">{t('waitlistZone3')}</span>
                <span className="font-bold text-green-600">+ €50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm">
          <div className="flex items-center gap-4 w-full md:w-1/3">
            <div className="p-4 bg-slate-100 text-slate-600 rounded-full">
              <CloudRain className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{t('adminYieldCloudyRain')}</p>
              <p className="text-sm text-slate-500">{t('adminYieldCloudyDesc')}</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-slate-300 hidden md:block" />
          <div className="flex-1 w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="font-semibold text-slate-700 mb-2">{t('adminYieldAction')}</p>
            <div className="flex gap-4">
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex-1 text-center">
                <span className="block text-xs text-slate-500">{t('adminYieldBaseBedPrice')}</span>
                <span className="font-bold text-red-500">- 15%</span>
              </div>
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex-1 text-center">
                <span className="block text-xs text-slate-500">{t('waitlistZone3')}</span>
                <span className="font-bold text-slate-500">{t('adminYieldNoChange')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
          {t('adminYieldAddRule')}
        </button>
      </div>
    </div>
  );
}
