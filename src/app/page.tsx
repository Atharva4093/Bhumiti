"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  LayoutDashboard, Map as MapIcon, Bot, Cpu, History, Droplets, Calendar, 
  ShieldCheck, XCircle, Activity, Sparkles, Search, Trees, Building2, Waves, Globe2, Lock, User, KeyRound, BookOpen
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { LAND_DATABASE, AI_RESPONSES, YEAR_TIMELINE } from "./lib/mockData";
import ResearchRepositoryView from "./components/ResearchRepositoryView";

const MapVisualizer = dynamic(() => import("./components/MapVisualizer"), { 
  ssr: false, 
  loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-100 text-emerald-700 font-bold">Loading Spatial Engine...</div>
});

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("officer@bhumiti.gov.in");
  const [password, setPassword] = useState("••••••••");

  const [activeNav, setActiveNav] = useState("Overview");
  const [selectedZone, setSelectedZone] = useState<string | null>("hadapsar_01");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentYear, setCurrentYear] = useState<number>(2025);
  
  const [simulatedConversion, setSimulatedConversion] = useState(25);
  const [permitStatus, setPermitStatus] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [activeLayer, setActiveLayer] = useState<"satellite" | "thermal" | "moisture">("satellite");

  const [rightTab, setRightTab] = useState<"data" | "ai">("data");
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([]);

  const activeData = selectedZone ? LAND_DATABASE[selectedZone] : null;

  const timelineStats = YEAR_TIMELINE[currentYear] || { agri: 20, trees: 15, built: 55, water: 10 };
  const currentPieData = [
    { name: 'Agriculture', value: Math.max(10, timelineStats.agri - Math.floor(simulatedConversion / 2)), color: '#10B981' },
    { name: 'Forest / Trees', value: timelineStats.trees, color: '#059669' },
    { name: 'Built-up Area', value: timelineStats.built + simulatedConversion, color: '#EF4444' },
    { name: 'Water Bodies', value: timelineStats.water, color: '#3B82F6' }
  ];

  const healthScore = activeData ? Math.max(35, 92 - (currentYear - 2015) * 3 - simulatedConversion).toFixed(0) : "0";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    const lowerVal = val.toLowerCase();
    
    if (lowerVal.includes("hadap")) setSelectedZone("hadapsar_01");
    else if (lowerVal.includes("lohe") || lowerVal.includes("ady")) setSelectedZone("lohegaon_02");
    else setSelectedZone(null);
  };

  const handleAiPrompt = (key: string, promptText: string) => {
    setChatMessages(prev => [...prev, { role: "user", text: promptText }]);
    setTimeout(() => {
      const responseItem = AI_RESPONSES[key];
      const responseText = responseItem ? responseItem.text : "Analysis complete.";
      setChatMessages(prev => [...prev, { role: "ai", text: responseText }]);
    }, 800);
  };

  // ---------------------------------------------------------------------------
  // SECURE LOGIN SCREEN VIEW (Split Screen: Live Land Use Visual & Credentials)
  // ---------------------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full flex bg-slate-950 font-sans text-slate-100 overflow-hidden">
        {/* Left Side: Dynamic Visual Showcase of Urbanization, Forest & Water Bodies */}
        <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
          <div 
            className="absolute inset-0 bg-cover bg-center filter brightness-90 contrast-105 scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2500&auto=format&fit=crop')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/60 to-emerald-950/40" />

          {/* Top Brand Banner */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-3 bg-emerald-600/90 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-500/30 text-white">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-black tracking-widest text-white">BHUMITI OS</span>
              <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Spatial Intelligence Platform</p>
            </div>
          </div>

          {/* Bottom Interactive Feature Cards showcasing project themes */}
          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[11px] font-bold text-emerald-300 uppercase tracking-widest backdrop-blur-md">
              Ecosystem & Urban Dynamics Monitor
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">
              Tracking Land Use Overuse, Canopy Loss, & Hydrological Stress.
            </h2>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-emerald-950/80 backdrop-blur-md border border-emerald-700/40 p-4 rounded-2xl shadow-lg space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Trees className="w-4 h-4" /> Forest
                </div>
                <p className="text-[11px] text-slate-300">Canopy preservation & green cover tracking.</p>
              </div>
              <div className="bg-rose-950/80 backdrop-blur-md border border-rose-700/40 p-4 rounded-2xl shadow-lg space-y-1">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-4 h-4" /> Urban
                </div>
                <p className="text-[11px] text-slate-300">Unchecked expansion & built-up density limits.</p>
              </div>
              <div className="bg-blue-950/80 backdrop-blur-md border border-blue-700/40 p-4 rounded-2xl shadow-lg space-y-1">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <Waves className="w-4 h-4" /> Water
                </div>
                <p className="text-[11px] text-slate-300">Hydrological basin flow & groundwater stress.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Secure Login Form */}
        <div className="w-full lg:w-5/12 flex items-center justify-center p-8 bg-slate-900/90 relative z-10">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-wider text-white">Officer Portal</h1>
              <p className="text-xs text-slate-400 font-medium">Authenticate to access municipal spatial zoning logs and AI simulation engines.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Officer Email</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Security Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 mt-2"
              >
                <Lock className="w-4 h-4" /> Authenticate OS
              </button>
            </form>

            <p className="text-[10px] text-center text-slate-500 font-medium">
              Authorized municipal personnel & hackathon evaluators only. Secure ArcGIS Node 14.2.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN DASHBOARD VIEW
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen text-slate-800 font-sans flex overflow-hidden relative bg-slate-100 selection:bg-emerald-500 selection:text-white">
      
      <aside className="w-68 bg-white h-screen flex flex-col border-r border-slate-200 shrink-0 z-20 shadow-sm">
        <div className="p-6 flex items-center gap-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 p-2.5 rounded-xl shadow-md shadow-emerald-600/20">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-widest text-slate-900">BHUMITI</h1>
            <p className="text-[0.6rem] uppercase tracking-widest text-emerald-600 font-bold">Land Intelligence OS</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {[
            { name: "Overview", icon: LayoutDashboard }, 
            { name: "Explore Map", icon: MapIcon }, 
            { name: "Policy Simulator", icon: Cpu },
            { name: "Research AI", icon: Bot },
            { name: "Research Repository", icon: BookOpen }
          ].map((item) => (
            <button 
              key={item.name} 
              onClick={() => setActiveNav(item.name)} 
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${ 
                activeNav === item.name 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-extrabold" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 m-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2 shadow-inner">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            <span>Biosphere Index</span>
            <span className="text-emerald-600 font-black">OPTIMAL</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden p-0.5">
            <div className="bg-emerald-500 h-full rounded-full w-[84%]" />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto z-10">
        
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200 bg-white shrink-0 shadow-sm">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              list="location-options"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search 'Hadapsar' or 'Lohegaon'..." 
              className="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400 transition shadow-inner"
            />
            <datalist id="location-options">
              <option value="Hadapsar Peri-Urban" />
              <option value="Lohegaon (ADYPSOE)" />
            </datalist>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-inner">
              <button onClick={() => setActiveLayer("satellite")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeLayer === 'satellite' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}>RGB Sat</button>
              <button onClick={() => setActiveLayer("thermal")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeLayer === 'thermal' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}>Thermal</button>
              <button onClick={() => setActiveLayer("moisture")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeLayer === 'moisture' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}>Moisture</button>
            </div>

            <select 
              value={selectedZone || ""} 
              onChange={(e) => { setSelectedZone(e.target.value); setSearchTerm(""); }} 
              className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-inner"
            >
              <option value="">Select Region</option>
              {Object.values(LAND_DATABASE).map(zone => (
                <option key={zone.id} value={zone.id}>{zone.name}</option>
              ))}
            </select>
          </div>
        </header>

        <div className="p-8 w-full space-y-6 max-w-[1450px] mx-auto flex-1 flex flex-col">
          
          {activeNav === "Research Repository" ? (
            <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <ResearchRepositoryView />
            </div>
          ) : activeNav === "Policy Simulator" ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 relative overflow-hidden">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <Cpu className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-wide">AI Land Conversion & Zoning Simulator</h2>
                  <p className="text-xs text-slate-500">Simulate structural growth impacts on trees, buildings, and hydrological networks.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">Target Zone: <span className="text-emerald-600 font-black">{activeData?.name}</span></label>
                    <p className="text-[11px] text-slate-400">Active Baseline Classification: {activeData?.currentZoning}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">Commercial Rezoning Index:</span>
                      <span className="text-rose-600 font-black">{simulatedConversion}% of Sector</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="60" 
                      value={simulatedConversion}
                      onChange={(e) => setSimulatedConversion(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg shadow-inner"
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3 shadow-inner">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Predictive Stress Metrics</h4>
                    <div className="flex justify-between text-xs font-semibold"><span className="text-slate-600">Canopy Loss Projection:</span><span className="font-bold text-rose-600">-{(simulatedConversion * 0.4).toFixed(1)} Hectares</span></div>
                    <div className="flex justify-between text-xs font-semibold"><span className="text-slate-600">Groundwater Stress Delta:</span><span className="font-bold text-amber-600">{(2.4 + (simulatedConversion * 0.05)).toFixed(1)}m</span></div>
                  </div>
                </div>

                <div className="h-72 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-center items-center shadow-inner">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Projected Land Shift</h4>
                  <div className="w-full h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={currentPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={6} cornerRadius={6} dataKey="value" stroke="none">
                          {currentPieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 flex flex-col gap-6">
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
                      <Trees className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Forest & Trees</p>
                      <p className="text-base font-black text-slate-900 mt-0.5">{timelineStats.trees}% <span className="text-[10px] text-emerald-600 font-bold">Canopy</span></p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm relative overflow-hidden group hover:border-rose-300 transition">
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-600">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Built Structures</p>
                      <p className="text-base font-black text-slate-900 mt-0.5">{timelineStats.built + simulatedConversion}% <span className="text-[10px] text-rose-600 font-bold">Density</span></p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm relative overflow-hidden group hover:border-blue-300 transition">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-600">
                      <Waves className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Water Resources</p>
                      <p className="text-base font-black text-slate-900 mt-0.5">{timelineStats.water}% <span className="text-[10px] text-blue-600 font-bold">Flow</span></p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[440px] relative">
                  <div className="flex justify-between items-center mb-3 px-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <MapIcon className="w-4 h-4 text-emerald-600" /> 
                        {activeData ? activeData.name : "Explore Map"}
                      </h3>
                      <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase font-black">
                        Sensor: {activeLayer}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Timeline: {currentYear}
                    </div>
                  </div>

                  <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
                    <MapVisualizer selectedZone={selectedZone} year={currentYear} layerMode={activeLayer} />
                  </div>

                  <div className="px-4 pt-4 pb-1 bg-transparent flex flex-col gap-1.5">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <span>2015 (Agri Focus)</span>
                      <span>2020 (Transition)</span>
                      <span>2025 (Urbanized)</span>
                    </div>
                    <input 
                      type="range" 
                      min="2015" 
                      max="2025" 
                      step="5"
                      value={currentYear}
                      onChange={(e) => setCurrentYear(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg shadow-inner"
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-56">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" /> Land Classification Breakdown ({currentYear})
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={currentPieData} cx="50%" cy="45%" innerRadius={40} outerRadius={60} paddingAngle={6} cornerRadius={8} stroke="none" dataKey="value">
                        {currentPieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }}/>
                      <Legend verticalAlign="middle" layout="vertical" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="col-span-4 bg-white border border-slate-200 rounded-2xl flex flex-col h-full overflow-hidden shadow-sm">
                
                <div className="flex border-b border-slate-200 bg-slate-50">
                  <button onClick={() => setRightTab("data")} className={`flex-1 py-4 text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 transition ${rightTab === "data" ? "text-emerald-700 border-b-2 border-emerald-600 bg-white" : "text-slate-500 hover:text-slate-900"}`}>
                    <Cpu className="w-4 h-4" /> Parcel Intel
                  </button>
                  <button onClick={() => setRightTab("ai")} className={`flex-1 py-4 text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 transition ${rightTab === "ai" ? "text-emerald-700 border-b-2 border-emerald-600 bg-white" : "text-slate-500 hover:text-slate-900"}`}>
                    <Bot className="w-4 h-4" /> Evidence AI
                  </button>
                </div>

                {rightTab === "data" && (
                  <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                    {activeData ? (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-black text-sm uppercase tracking-wide text-slate-900">{activeData.name}</h3>
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border ${
                            permitStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            permitStatus === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {permitStatus}
                          </span>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold">Eco-Index Health Score</p>
                            <p className="text-3xl font-black text-slate-900 mt-0.5 tracking-tight">{healthScore} <span className="text-xs font-semibold text-slate-500">/ 100</span></p>
                          </div>
                          <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-200 shadow-sm">
                            <Sparkles className="w-5 h-5 text-emerald-600" />
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-inner">
                          <div className="flex items-center gap-2.5 text-emerald-600"><History className="w-4 h-4" /><h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Zoning Evolution</h4></div>
                          <div className="space-y-1.5 text-xs font-medium">
                            <div className="flex justify-between"><span className="text-slate-500">2015 State:</span><span className="text-slate-700">{activeData.historicalData.useIn2015}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">2020 State:</span><span className="text-slate-700">{activeData.historicalData.useIn2020}</span></div>
                            <div className="flex justify-between border-t border-slate-200 pt-2"><span className="text-slate-900 font-bold">Current Zoning:</span><span className="text-rose-600 font-black">{activeData.currentZoning}</span></div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-inner">
                          <div className="flex items-center gap-2.5 text-blue-600"><Droplets className="w-4 h-4" /><h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Hydrology & Risks</h4></div>
                          <div className="space-y-1.5 text-xs font-medium">
                            <div className="flex justify-between"><span className="text-slate-500">Groundwater Stress:</span><span className="text-rose-600 font-bold">{activeData.historicalData.groundwaterDepletion}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Flood Susceptibility:</span><span className="text-slate-900 font-bold">{activeData.riskFactors.floodRisk}</span></div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-inner">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Official Permit Authorization</h4>
                          <div className="flex gap-2.5">
                            <button onClick={() => setPermitStatus("Approved")} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm">
                              <ShieldCheck className="w-4 h-4" /> Approve
                            </button>
                            <button onClick={() => setPermitStatus("Rejected")} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm">
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-20">
                        <MapIcon className="w-10 h-10 mb-3 opacity-40 text-emerald-600" />
                        <p className="text-xs uppercase tracking-wider font-bold">Select a sector to analyze metrics.</p>
                      </div>
                    )}
                  </div>
                )}

                {rightTab === "ai" && (
                  <div className="flex flex-col h-full bg-white">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-xs font-bold text-slate-600 mb-3">Execute Evidence Query:</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleAiPrompt("flood", "Assess flood risks for this zone.")} className="flex-1 text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 hover:bg-blue-100 py-2.5 px-3 rounded-lg border border-blue-200 transition">Flood Risk</button>
                        <button onClick={() => handleAiPrompt("agri", "What is the agricultural loss rate?")} className="flex-1 text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-2.5 px-3 rounded-lg border border-emerald-200 transition">Agri Loss</button>
                      </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {chatMessages.length === 0 && (
                        <p className="text-xs text-center text-slate-400 mt-10 font-semibold">Select a prompt above for generative insights.</p>
                      )}
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`p-3.5 rounded-xl text-xs leading-relaxed w-11/12 ${msg.role === 'user' ? 'bg-emerald-600 text-white font-bold ml-auto shadow-sm' : 'bg-slate-100 text-slate-800 border border-slate-200 mr-auto'}`}>
                          {msg.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}