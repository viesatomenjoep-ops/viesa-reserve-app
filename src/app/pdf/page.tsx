import React from 'react';
import Image from 'next/image';
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`rounded-xl border shadow-sm ${className || ''}`}>{children}</div>
);
const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`p-6 ${className || ''}`}>{children}</div>
);

import { Check, Euro, BarChart, Server, Globe, Shield, Play } from 'lucide-react';

export default function BusinessPlanPDF() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32">
      {/* 1. COVER PAGE / INTRODUCTION */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-emerald-900/40 z-0"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay z-0"></div>
        <div className="z-10 max-w-4xl">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.3)]">
            <span className="text-4xl font-black text-white tracking-tighter">VA</span>
          </div>
          <h1 className="text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            VIESA AUTOMATION
          </h1>
          <h2 className="text-3xl font-light text-slate-300 mb-8">
            Business Plan: Viesa Reserve Pro
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The Next-Generation White-Label Reservation & Venue Management Platform for Premium Beach Clubs and Hospitality Concepts.
          </p>
        </div>
      </section>

      {/* 2. THE STORY OF VIESA AUTOMATION */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-indigo-400 font-semibold tracking-wider text-sm mb-3 uppercase">Wie wij zijn</h3>
            <h2 className="text-4xl font-bold mb-6 text-white">The Story of Viesa Automation</h2>
            <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
              <p>
                Bij <strong>Viesa Automation</strong> geloven we dat high-end hospitality niet gehinderd mag worden door trage, verouderde software. Wij zijn opgericht met een duidelijke missie: het digitaliseren en automatiseren van operationele workflows voor premium locaties.
              </p>
              <p>
                We bouwen maatwerk oplossingen die de kloof dichten tussen traditionele service en moderne technologie. Geen logge systemen meer, maar naadloze, white-label integraties die voelen alsof ze in-house zijn ontwikkeld door onze klanten zelf.
              </p>
              <p>
                Van intelligente reserveringswidgets tot complexe POS integraties en real-time data dashboards—wij nemen de techniek uit handen zodat de locatie zich 100% kan focussen op de ultieme gastbeleving.
              </p>
            </div>
          </div>
          <div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50 shadow-2xl flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="flex flex-col items-center justify-center text-center p-8 z-10">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md mb-6 border border-white/20 hover:scale-110 transition-transform cursor-pointer shadow-lg">
                 <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Viesa Automation in Actie</h3>
              <p className="text-slate-300">Bekijk onze introductievideo (Concept)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SCREENSHOTS / SLIDESHOW (Voor- en Achterkant) */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h3 className="text-emerald-400 font-semibold tracking-wider text-sm mb-3 uppercase">Platform Overzicht</h3>
          <h2 className="text-4xl font-bold text-white">Viesa Reserve Pro in Beeld</h2>
          <p className="text-slate-400 mt-4 text-lg">Een blik op de frontend voor de gast, en de krachtige backend voor het management.</p>
        </div>

        <div className="space-y-24">
          {/* Frontend */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl opacity-20 blur-xl group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
              <div className="bg-slate-800/80 p-4 border-b border-white/10 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-slate-400 font-medium tracking-wide">Gast Frontend - Beach Club Widget</span>
              </div>
              <div className="relative aspect-[16/9] w-full bg-black">
                {/* Fallback color if image is not ready yet */}
                <img src="/screenshots/frontend.png" alt="Frontend App" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                   <p className="text-slate-500">Generating Frontend Screenshot...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Backend */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl opacity-20 blur-xl group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
              <div className="bg-slate-800/80 p-4 border-b border-white/10 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-slate-400 font-medium tracking-wide">Management Backend - Admin Dashboard</span>
              </div>
              <div className="relative aspect-[16/9] w-full bg-black">
                <img src="/screenshots/backend.png" alt="Backend App" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                   <p className="text-slate-500">Generating Backend Screenshot...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING STRATEGY */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h3 className="text-indigo-400 font-semibold tracking-wider text-sm mb-3 uppercase">Verdienmodel</h3>
          <h2 className="text-4xl font-bold text-white">Pricing Strategy & Concurrentie</h2>
          <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">
            We positioneren ons strategisch sterk ten opzichte van de concurrentie (Formitable, TheFork, Resengo) door een transparant "Fair & Scalable" model.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Onze Pricing */}
          <Card className="bg-gradient-to-b from-indigo-950/50 to-slate-900 border-indigo-500/30">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Become a Member</h3>
                  <p className="text-indigo-300">Viesa Reserve Pro Licentie</p>
                </div>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm font-semibold rounded-full border border-indigo-500/30">Onze Prijs</span>
              </div>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-black text-white">€99</span>
                <span className="text-slate-400 ml-2">/ maand</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-slate-300"><Check className="w-5 h-5 text-emerald-400 mr-3" /> Volledige White-label integratie</li>
                <li className="flex items-center text-slate-300"><Check className="w-5 h-5 text-emerald-400 mr-3" /> Interactieve 3D Map & Layouts</li>
                <li className="flex items-center text-slate-300"><Check className="w-5 h-5 text-emerald-400 mr-3" /> Ongelimiteerde Admin accounts</li>
                <li className="flex items-center text-slate-300"><Check className="w-5 h-5 text-emerald-400 mr-3" /> Real-time Dashboard & Analytics</li>
              </ul>
              
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Transactiekosten</span>
                  <span className="text-2xl font-bold text-white">€0.29 <span className="text-sm font-normal text-slate-400">/ boeking</span></span>
                </div>
                <p className="text-sm text-slate-500 mt-2">Dekt alle SMS/Email automatiseringen & infrastructuur.</p>
              </div>
            </CardContent>
          </Card>

          {/* Concurrentie */}
          <Card className="bg-slate-900/50 border-white/10 opacity-80">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">De Concurrentie</h3>
                  <p className="text-slate-400">Gemiddelde marktprijzen</p>
                </div>
              </div>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-black text-white">€150+</span>
                <span className="text-slate-400 ml-2">/ maand</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-slate-400"><Euro className="w-5 h-5 text-slate-600 mr-3" /> Dure onboarding kosten</li>
                <li className="flex items-center text-slate-400"><Euro className="w-5 h-5 text-slate-600 mr-3" /> Geen echte white-label (Branding van TheFork/etc)</li>
                <li className="flex items-center text-slate-400"><Euro className="w-5 h-5 text-slate-600 mr-3" /> Beperkte maatwerk opties</li>
                <li className="flex items-center text-slate-400"><Euro className="w-5 h-5 text-slate-600 mr-3" /> Verouderde interfaces</li>
              </ul>
              
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Transactiekosten</span>
                  <span className="text-2xl font-bold text-white">€1.50 - €2.50 <span className="text-sm font-normal text-slate-400">/ cover</span></span>
                </div>
                <p className="text-sm text-slate-500 mt-2">Extreem duur voor high-volume beach clubs.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Waarom dit werkt */}
        <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-2xl p-8">
          <h4 className="text-xl font-bold text-white mb-4">De Business Case</h4>
          <p className="text-slate-300 leading-relaxed mb-6">
            Door de maandelijkse fee <strong>onder de €100</strong> te houden, verlagen we de drempel voor beach clubs en premium locaties om over te stappen. We snijden direct in hun kosten (die bij TheFork in de duizenden euro's per maand kunnen lopen door de per-cover fee). 
            <br/><br/>
            Onze fee van <strong>€0.29 per boeking</strong> is onzichtbaar voor de ondernemer, dekt onze server/automatisering kosten, en schaalt exponentieel mee in het hoogseizoen wanneer er duizenden bedjes per week worden verhuurd.
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 text-center text-slate-500 border-t border-white/5">
        <p>© 2026 Viesa Automation. Confidentieel Business Plan.</p>
      </footer>
    </div>
  );
}
