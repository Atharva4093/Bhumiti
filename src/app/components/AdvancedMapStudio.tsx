"use client";

import { useState } from "react";
import { Search, Sparkles, Sliders, Layers, MapPin, Building2, Droplets, AlertTriangle, ChevronRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const trendData = [
  { year: '2018', urban: 15, agri: 70, risk: 10 },
  { year: '2020', urban: 22, agri: 62, risk: 15 },
  { year: '2022', urban: 30, agri: 52, risk: 22 },
  { year: '2024', urban: 42, agri: 40, risk: 35 },
  { year: '2026', urban: 58, agri: 25, risk: 50 },
];

export default function AdvancedMapStudio() {
  const [activeTab, setActiveTab] = useState("Land Use Change");
  const [urbanSlider, setUrbanSlider] = useState(35);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 h-full overflow-hidden font-sans">

      {/* Top Government Navbar */}
      <header className="h-14 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg text-white font-black text-xs">GOI</div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-white">BHUMITI</h1>
            <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold">National Land Intelligence Platform</p>
          </div>
        </div>
        <nav className="flex items-center gap-6 text-xs font-bold text-slate-300">
          <button className="text-emerald-400 hover:text-white transition">Explore</button>
          <button className="hover:text-white transition">Research</button>
          <button className="hover:text-white transition">Policy Lab</button>
          <button className="hover:text-white transition">Insights</button>
          <button className="hover:text-white transition">Evidence</button>
        </nav>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span>Government of India</span>
        </div>
      </header>

      {/* Main Interface Workspace */}
      <div className="flex-1 flex relative overflow-hidden">

        {/* Central Map Canvas Area */}
        <div className="flex-1 relative flex flex-col bg-slate-900">
          <div 
            className="absolute inset-0 bg-cover bg-center filter contrast-125 opacity-80"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

          {/* Floating Survey Parcel Card */}
          <div className="absolute top-8 left-8 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 p-4 rounded-2xl shadow-2xl w-72 space-y-2 z-10">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Survey No. 123/4</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">Pune, MH</span>
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-[11px] text-slate-300">
              <span className="text-slate-400">Land Use:</span> <span className="font-bold text-white">Agricultural</span>
              <span className="text-slate-400">Area:</span> <span className="font-bold text-white">2.84 ha</span>
              <span className="text-slate-400">Risk Level:</span> <span className="font-bold text-amber-400">Moderate</span>
              <span className="text-slate-400">Pressure:</span> <span className="font-bold text-rose-400">+18% urban</span>
              <span className="text-slate-400">Confidence:</span> <span className="font-bold text-emerald-400">94%</span>
            </div>
          </div>

          {/* Bottom Analysis Filters & Timeline Drawer */}
          <div className="mt-auto relative z-10 p-6 space-y-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
            <div className="flex items-center gap-3">
              {['Land Use Change', 'Urban Expansion', 'Environmental Risk', 'Policy Scenarios', 'Research Evidence'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer backdrop-blur-md ${
                    activeTab === tab 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500' 
                      : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Trend Chart Drawer */}
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 h-36 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">{activeTab} Multi-Year Vector Stream</span>
                <span className="text-[10px] text-emerald-400 font-mono">Real-time ArcGIS Node 14</span>
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorUrb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="urban" stroke="#10B981" fillOpacity={1} fill="url(#colorUrb)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Intelligence Panel */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col gap-6 shrink-0 overflow-y-auto">
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Land Intelligence
            </h3>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-inner flex items-center justify-between">
                <span className="text-slate-300">Urban expansion detected around parcel</span>
                <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-inner flex items-center justify-between">
                <span className="text-slate-300">Waterbody proximity risk: <strong className="text-amber-400">240 m</strong></span>
                <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-inner flex items-center justify-between">
                <span className="text-slate-300">Agricultural land conversion pressure increasing</span>
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-inner flex items-center justify-between">
                <span className="text-slate-300">Recommended policy: controlled development buffer</span>
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            </div>

            <button className="w-full bg-slate-950 border border-slate-700 hover:border-emerald-500 py-3 px-4 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-between transition cursor-pointer shadow-inner">
              <span>Ask Bhumiti AI Assistant</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* Policy Simulation Control Card */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-4 shadow-xl mt-auto">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
              <Sliders className="w-4 h-4 text-emerald-400" /> Policy Simulation
            </div>
            <p className="text-[11px] font-bold text-slate-300">Controlled Urban Expansion</p>

            <input 
              type="range" 
              min="0" 
              max="100" 
              value={urbanSlider}
              onChange={(e) => setUrbanSlider(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="space-y-1.5 text-xs font-semibold pt-1 border-t border-slate-800">
              <div className="flex justify-between"><span className="text-slate-400">Agricultural Land</span><span className="text-rose-400 font-bold">-6%</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Urban Pressure</span><span className="text-rose-400 font-bold">-14%</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Water Risk</span><span className="text-rose-400 font-bold">-9%</span></div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5"><span className="text-white font-bold">Development Efficiency</span><span className="text-emerald-400 font-black">+11%</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}