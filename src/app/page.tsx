"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { 
  Compass, MapPin, Search, Layers, BarChart3, FileText, Settings, 
  Building2, Droplets, AlertTriangle, ChevronRight, Sliders, Play, ArrowUpRight, Sparkles, Sprout, Trees, Waves,
  LayoutDashboard, Map as MapIcon, Bot, Cpu, History, Calendar, ShieldCheck, XCircle, Activity, BookOpen, Plus, Minus, Navigation, Crosshair, X, ShieldAlert, CheckCircle2, Lock, Send, CornerDownLeft, MessageSquareText, Database, Sparkle, RefreshCw, Check
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { LAND_DATABASE, YEAR_TIMELINE } from "./lib/mockData";
import ResearchRepositoryView from "./components/ResearchRepositoryView";

const MapVisualizer = dynamic(() => import("./components/MapVisualizer"), { 
  ssr: false, 
  loading: () => <div className="w-full h-full flex items-center justify-center bg-[#FDFBF7] text-emerald-800 font-bold">Loading National Geospatial Engine...</div>
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
  const [showParcelCard, setShowParcelCard] = useState(true);

  // Policy Simulator States
  const [simStep, setSimStep] = useState<number>(1);
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState("Pune");
  const [selectedTaluka, setSelectedTaluka] = useState("Haveli (Hadapsar Corridor)");
  const [selectedPolicyType, setSelectedPolicyType] = useState("Agricultural Protection Zone");
  const [protectedAreaPct, setProtectedAreaPct] = useState(25);
  const [bufferDistance, setBufferDistance] = useState(500);
  const [timeHorizon, setTimeHorizon] = useState("10 years");
  const [enforcementLevel, setEnforcementLevel] = useState("High");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simMode, setSimMode] = useState<"current" | "simulated">("current");

  // Bhumi Assistant State
  const [chatMessages, setChatMessages] = useState<{role: "user" | "assistant", text: string, timestamp: string, tags?: string[]}[]>([
    {
      role: "assistant",
      text: "Namaste, Officer! I am your Bhumi Assistant. I can help you explore cadastral survey logs, analyze peri-urban agricultural conversion rates, and evaluate zoning compliance laws. What would you like to investigate today?",
      timestamp: "6:41:50 PM"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [totalQueries, setTotalQueries] = useState(14);
  const [dataPointsAnalyzed, setDataPointsAnalyzed] = useState(3842);

  // Blockchain Ledger State
  const [blockchainTab, setBlockchainTab] = useState<"explorer" | "verify">("explorer");
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<{ status: "idle" | "verified" | "tampered"; details?: any }>("idle");

  const activeData = selectedZone ? LAND_DATABASE[selectedZone] : null;

  const timelineStats = YEAR_TIMELINE[currentYear] || { agri: 20, trees: 15, built: 55, water: 10 };
  
  const getPolicyMultiplier = () => {
    if (selectedPolicyType.includes("Agricultural")) return 1.2;
    if (selectedPolicyType.includes("Urban Growth")) return 0.9;
    if (selectedPolicyType.includes("River")) return 1.1;
    return 1.0;
  };

  const dynamicAgri = Math.min(85, Math.max(30, Math.round(54 + (protectedAreaPct * 0.4 * getPolicyMultiplier()))));
  const dynamicBuilt = Math.max(10, Math.round(35 - (protectedAreaPct * 0.35)));
  const dynamicCanopy = Math.min(30, Math.round(8 + (bufferDistance / 200)));
  const dynamicWater = Math.min(20, Math.round(7 + (bufferDistance / 300)));

  const rawAgri = Math.max(5, timelineStats.agri - Math.floor(simulatedConversion / 2));
  const rawTrees = Math.max(5, timelineStats.trees - Math.floor(simulatedConversion / 4));
  const rawWater = timelineStats.water;
  const rawBuilt = Math.min(65, timelineStats.built + simulatedConversion);

  const totalSum = rawAgri + rawTrees + rawWater + rawBuilt;
  const currentPieData = [
    { name: 'Agriculture', value: Number(((rawAgri / totalSum) * 100).toFixed(1)), color: '#10B981' },
    { name: 'Forest / Trees', value: Number(((rawTrees / totalSum) * 100).toFixed(1)), color: '#059669' },
    { name: 'Built-up Area', value: Number(((rawBuilt / totalSum) * 100).toFixed(1)), color: '#EF4444' },
    { name: 'Water Bodies', value: Number(((rawWater / totalSum) * 100).toFixed(1)), color: '#3B82F6' }
  ];

  const displayAgri = Math.round((rawAgri / totalSum) * 100);
  const displayCanopy = Math.round((rawTrees / totalSum) * 100);
  const displayBuilt = Math.round((rawBuilt / totalSum) * 100);
  const displayWater = Math.round((rawWater / totalSum) * 100);

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
    setShowParcelCard(true);
  };

  const runSimulationProcess = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
    }, 1800);
  };

  const handleAiSubmit = (e: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryText = customQuery || chatInput;
    if (!queryText.trim()) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newMessages = [...chatMessages, { role: "user" as const, text: queryText, timestamp: userTimestamp, tags: [queryText.toLowerCase().includes("flood") || queryText.toLowerCase().includes("water") ? "hydrology" : "zoning"] }];
    setChatMessages(newMessages);
    if (!customQuery) setChatInput("");
    setIsThinking(true);
    setTotalQueries(prev => prev + 1);
    setDataPointsAnalyzed(prev => prev + 245);

    setTimeout(() => {
      let aiResponseText = "";
      const q = queryText.toLowerCase();

      if (q.includes("hadapsar") || q.includes("pune") || q.includes("corridor")) {
        aiResponseText = `Hadapsar Corridor Assessment: Peri-urban agricultural conversion is currently averaging 4.2% annually. Groundwater stress is elevated, and municipal buffer zones require strict adherence to green-belt retention rules.`;
      } else if (q.includes("groundwater") || q.includes("water") || q.includes("stress")) {
        aiResponseText = `Hydrological Stress Analysis for sector [${activeData?.name || 'Selected'}]: Water table levels have dropped by 2.4 meters over the past 3 years. Subsurface extraction limits for commercial licensing should be restricted.`;
      } else if (q.includes("zoning") || q.includes("commercial") || q.includes("conversion") || q.includes("law")) {
        aiResponseText = `Zoning Compliance Check: Converting agricultural plots to commercial built-up areas beyond 25% requires clearance from the Ministry review committee and a mandatory 15-meter ecological buffer from water bodies.`;
      } else {
        aiResponseText = `Land Intelligence Synthesis for "${queryText}": Cross-referenced with National ArcGIS Node 14.2. Ecosystem Health Index for this sector stands at ${healthScore}/100 with moderate vulnerability to unplanned urban sprawl.`;
      }

      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setChatMessages([...newMessages, { role: "assistant", text: aiResponseText, timestamp: aiTimestamp }]);
      setIsThinking(false);
    }, 900);
  };

  const handleDocumentVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;
    if (verifyInput.toLowerCase().includes("hash") || verifyInput.length > 20 || verifyInput.includes("48921")) {
      setVerifyResult({
        status: "verified",
        details: {
          blockId: "#48921",
          hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          timestamp: "2026-06-12 14:22:10 UTC",
          author: "Ministry of Rural Development Node 04",
          status: "Authentic & Immutable"
        }
      });
    } else {
      setVerifyResult({ status: "tampered" });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full relative flex items-center justify-center p-6 font-sans text-slate-100 overflow-hidden">
        {/* Fullscreen HD Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-90 contrast-105 scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2500&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />

        {/* Top-Left Branding Header */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
          <div className="p-3 bg-emerald-700 rounded-2xl shadow-xl text-white">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-black tracking-widest text-white">BHUMITI OS</span>
            <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">National Land Intelligence Platform</p>
          </div>
        </div>

        {/* Centered Frosted Glass Authentication Card */}
        <div className="w-full max-w-md bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 p-8 lg:p-10 rounded-3xl shadow-2xl relative z-20 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-wider text-white">Officer Portal</h1>
            <p className="text-xs text-slate-400 font-medium">Authenticate to access municipal spatial zoning logs and AI simulation engines.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Officer Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Security Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              Authenticate Platform
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 font-sans flex flex-col overflow-hidden relative bg-[#F7F5F0]">
      
      {/* Top Government Header with Glassmorphism */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-emerald-950/10 bg-[#FAF8F5]/90 backdrop-blur-md shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-emerald-700 rounded-2xl text-white shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-widest text-slate-900">BHUMITI</h1>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-emerald-800 font-extrabold">National Land Intelligence Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white border border-emerald-950/10 rounded-full text-xs font-bold text-emerald-900 shadow-2xs">
            <span>Ministry of Rural Development, Govt. of India</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-white">
            GOI
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Left Mini Sidebar with Sleek Cards */}
        <aside className="w-72 bg-[#FAF8F5] border-r border-emerald-950/10 flex flex-col py-8 gap-3 shrink-0 z-20 shadow-xs">
          <div className="px-6 mb-1">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Navigation Console</span>
          </div>
          {[
            { name: "Overview", icon: LayoutDashboard }, 
            { name: "Explore Map", icon: MapIcon }, 
            { name: "Policy Simulator", icon: Cpu },
            { name: "Research Repository", icon: BookOpen },
            { name: "Blockchain Ledger", icon: Lock },
            { name: "BHUMI ASSISTENT", icon: Bot }
          ].map((item) => (
            <button 
              key={item.name} 
              onClick={() => setActiveNav(item.name)} 
              className={`w-full flex items-center gap-3.5 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${ 
                activeNav === item.name 
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20 font-black border-l-4 border-emerald-950 translate-x-1 rounded-r-xl" 
                  : "text-slate-600 hover:bg-emerald-900/5 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}

          <div className="mt-auto p-4 m-4 rounded-2xl bg-white border border-emerald-950/10 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500 font-black">
              <span>Biosphere Index</span>
              <span className="text-emerald-700 font-black">OPTIMAL</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
              <div className="bg-emerald-600 h-full rounded-full w-[84%] transition-all duration-500" />
            </div>
          </div>
        </aside>

        {/* Central Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-8 gap-6 bg-[#F7F5F0]">
          
          {activeNav === "Research Repository" ? (
            <div className="flex-1 flex flex-col bg-white border border-emerald-950/10 rounded-3xl shadow-xs overflow-hidden p-8">
              <ResearchRepositoryView />
            </div>
          ) : activeNav === "Explore Map" ? (
            /* FULLSCREEN IMMERSIVE GIS MAP COMMAND CENTER */
            <div className="flex-1 flex flex-col bg-white border border-emerald-950/10 rounded-3xl shadow-xs overflow-hidden p-6 relative">
              <div className="flex justify-between items-center mb-4 px-1">
                <div>
                  <h2 className="text-base font-black text-slate-900 tracking-wide">National Geospatial GIS Command Center</h2>
                  <p className="text-xs text-slate-500 font-medium">Full-scale vector parcel inspection, boundary telemetry, and live layer toggling.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-black px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">ArcGIS Node 14 Connected</span>
                </div>
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden border border-emerald-950/10 relative shadow-inner">
                <MapVisualizer selectedZone={selectedZone} year={currentYear} layerMode={activeLayer} />
                
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <div className="bg-white/95 backdrop-blur-md border border-emerald-950/10 rounded-xl p-1 flex items-center gap-1 text-xs font-bold text-slate-700 shadow-lg">
                    <button onClick={() => setActiveLayer("satellite")} className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${activeLayer === 'satellite' ? 'bg-emerald-700 text-white shadow' : 'hover:bg-slate-100'}`}>Satellite</button>
                    <button onClick={() => setActiveLayer("thermal")} className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${activeLayer === 'thermal' ? 'bg-amber-600 text-white shadow' : 'hover:bg-slate-100'}`}>Thermal</button>
                    <button onClick={() => setActiveLayer("moisture")} className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${activeLayer === 'moisture' ? 'bg-blue-600 text-white shadow' : 'hover:bg-slate-100'}`}>Terrain</button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeNav === "BHUMI ASSISTENT" ? (
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-12 gap-6 flex-1">
                <div className="col-span-9 bg-white border border-emerald-950/10 rounded-3xl shadow-xs flex flex-col overflow-hidden p-8 gap-6">
                  <div className="flex items-center gap-4 border-b border-emerald-950/10 pb-5">
                    <div className="p-3.5 bg-emerald-700 text-white rounded-2xl shadow-md">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 tracking-wide">Bhumi Assistent</h2>
                      <p className="text-xs text-slate-500 font-medium">Natural language geospatial & zoning exploration powered by live spatial data</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto min-h-[340px] max-h-[400px] pr-2">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-4.5 rounded-2xl text-xs leading-relaxed max-w-[85%] shadow-xs ${
                          msg.role === 'user' 
                            ? 'bg-emerald-700 text-white font-medium rounded-br-none' 
                            : 'bg-[#FAF8F5] text-slate-900 border border-emerald-950/10 rounded-bl-none font-medium'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1.5 px-1 font-mono">{msg.timestamp}</span>
                      </div>
                    ))}

                    {isThinking && (
                      <div className="flex items-center gap-3 p-4 bg-[#FAF8F5] border border-emerald-950/10 rounded-2xl w-2/3 text-xs text-slate-600 animate-pulse shadow-xs">
                        <Bot className="w-4 h-4 text-emerald-700 animate-spin" /> Analyzing cadastral telemetry and land logs...
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Suggested Queries:</p>
                    <div className="grid grid-cols-2 gap-3.5">
                      {[
                        { q: "Assess peri-urban agricultural conversion in Hadapsar", tag: "zoning" },
                        { q: "Check groundwater depletion and flood risks in Pune corridor", tag: "hydrology" },
                        { q: "Evaluate land-use change and canopy loss since 2015", tag: "environment" },
                        { q: "Summarize municipal zoning compliance laws for commercial permits", tag: "legal" }
                      ].map((item, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleAiSubmit(undefined as any, item.q)}
                          className="p-4 bg-[#FAF8F5] hover:bg-emerald-50/50 border border-emerald-950/10 rounded-2xl cursor-pointer transition flex flex-col justify-between space-y-2.5 shadow-2xs group"
                        >
                          <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">{item.q}</p>
                          <div className="flex items-center">
                            <span className="text-[9px] bg-emerald-100 text-emerald-900 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">{item.tag}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={(e) => handleAiSubmit(e)} className="relative mt-auto">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about cadastral surveys, zoning rules, or land conversion..." 
                      className="w-full bg-[#FAF8F5] border border-emerald-950/15 rounded-2xl py-4 pl-5 pr-16 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-inner"
                    />
                    <button 
                      type="submit" 
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition shadow cursor-pointer flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                <div className="col-span-3 flex flex-col gap-6">
                  <div className="bg-white border border-emerald-950/10 rounded-3xl p-6 shadow-xs space-y-3.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-emerald-950/10 pb-3">
                      <BarChart3 className="w-4 h-4 text-emerald-700" /> Session Stats
                    </h3>
                    <div className="space-y-2.5 text-xs font-semibold">
                      <div className="flex justify-between"><span className="text-slate-500">Total Queries</span><span className="font-black text-slate-900">{totalQueries}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Data Points Analyzed</span><span className="font-black text-slate-900">{dataPointsAnalyzed}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Active Zones</span><span className="font-black text-emerald-700">14 Sectors</span></div>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-950/10 rounded-3xl p-6 shadow-xs space-y-3.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-emerald-950/10 pb-3">
                      <History className="w-4 h-4 text-emerald-700" /> Recent Queries
                    </h3>
                    <div className="space-y-3">
                      {[
                        { q: "Assess peri-urban agricult...", tag: "zoning", res: "94% confidence • Hadapsar" },
                        { q: "Check groundwater depleti...", tag: "hydrology", res: "2.4m delta • Pune" }
                      ].map((rq, i) => (
                        <div key={i} className="p-3 bg-[#FAF8F5] border border-emerald-950/10 rounded-2xl space-y-1.5 text-[11px]">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-800 truncate max-w-[120px]">{rq.q}</span>
                            <span className="text-[8px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full">{rq.tag}</span>
                          </div>
                          <p className="text-[9px] text-slate-500">{rq.res}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-950/10 rounded-3xl p-6 shadow-xs space-y-3.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-emerald-950/10 pb-3">
                      <Sparkles className="w-4 h-4 text-emerald-700" /> Quick Actions
                    </h3>
                    <div className="space-y-2.5">
                      <button onClick={() => setActiveNav("Overview")} className="w-full text-left px-3.5 py-2.5 bg-[#FAF8F5] hover:bg-emerald-50 text-xs font-bold text-slate-800 rounded-xl transition border border-emerald-950/10 flex items-center gap-2.5 cursor-pointer shadow-2xs">
                        <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" /> View Dashboard
                      </button>
                      <button onClick={() => setActiveNav("Explore Map")} className="w-full text-left px-3.5 py-2.5 bg-[#FAF8F5] hover:bg-emerald-50 text-xs font-bold text-slate-800 rounded-xl transition border border-emerald-950/10 flex items-center gap-2.5 cursor-pointer shadow-2xs">
                        <Database className="w-3.5 h-3.5 text-emerald-700" /> Browse Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeNav === "Blockchain Ledger" ? (
            <div className="flex-1 flex flex-col bg-white border border-emerald-950/10 rounded-3xl shadow-xs overflow-hidden p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-950/10 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-md">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-wide">Blockchain Data Integrity & Security Ledger</h2>
                    <p className="text-xs text-slate-500 font-medium">Tamper-evident digital notary for all municipal research, cadastral surveys, and policy records.</p>
                  </div>
                </div>
                <div className="flex bg-[#FAF8F5] border border-emerald-950/10 rounded-2xl p-1.5 shadow-inner">
                  <button onClick={() => setBlockchainTab("explorer")} className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer ${blockchainTab === 'explorer' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>Consortium Explorer</button>
                  <button onClick={() => setBlockchainTab("verify")} className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer ${blockchainTab === 'verify' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>Verify Document</button>
                </div>
              </div>

              {blockchainTab === "explorer" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-5">
                    <div className="bg-[#FAF8F5] border border-emerald-950/10 p-5 rounded-2xl shadow-inner">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Consensus Mechanism</p>
                      <p className="text-base font-black text-emerald-700 mt-1">Raft / IBFT 2.0</p>
                    </div>
                    <div className="bg-[#FAF8F5] border border-emerald-950/10 p-5 rounded-2xl shadow-inner">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Active Validator Nodes</p>
                      <p className="text-base font-black text-slate-900 mt-1">14 Consortium Nodes</p>
                    </div>
                    <div className="bg-[#FAF8F5] border border-emerald-950/10 p-5 rounded-2xl shadow-inner">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Total Immutable Blocks</p>
                      <p className="text-base font-black text-slate-900 mt-1">#48,921</p>
                    </div>
                    <div className="bg-[#FAF8F5] border border-emerald-950/10 p-5 rounded-2xl shadow-inner">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Network Integrity Status</p>
                      <p className="text-base font-black text-emerald-600 mt-1 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> 100% Secure</p>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] border border-emerald-950/10 rounded-2xl p-6 space-y-4 shadow-inner">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Recent On-Chain Transactions & Hashing Logs</h3>
                    <div className="space-y-3.5">
                      {[
                        { id: "#48921", doc: "Hadapsar Peri-Urban Cadastral Survey v2.4", hash: "e3b0c442...91b7852b", node: "Ministry of Rural Development Node 04", time: "2 mins ago" },
                        { id: "#48920", doc: "Pune Zoning & Groundwater Simulation Delta", hash: "8c6976e5...b52f1e69", node: "State Revenue Department Cell", time: "14 mins ago" },
                        { id: "#48919", doc: "Lohegaon Canopy Preservation Impact Report", hash: "2cf24dba...78fe7259", node: "Academic Think Tank Node 02", time: "42 mins ago" }
                      ].map((tx, idx) => (
                        <div key={idx} className="p-4 bg-white border border-emerald-950/10 rounded-2xl flex items-center justify-between text-xs shadow-2xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-emerald-700">{tx.id}</span>
                              <span className="font-bold text-slate-900">{tx.doc}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono">SHA-256 Hash: {tx.hash}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[9px] font-black uppercase tracking-wider border border-emerald-200">{tx.node}</span>
                            <p className="text-[10px] text-slate-400">{tx.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FAF8F5] border border-emerald-950/10 rounded-2xl p-8 max-w-2xl mx-auto w-full space-y-6 shadow-inner">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-black text-slate-900">Document Authenticity Verification</h3>
                    <p className="text-xs text-slate-500">Upload or enter document hash/ID to verify file immutability against the decentralized ledger.</p>
                  </div>

                  <form onSubmit={handleDocumentVerify} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Document Hash or ID</label>
                      <input 
                        type="text" 
                        value={verifyInput}
                        onChange={(e) => setVerifyInput(e.target.value)}
                        placeholder="Enter SHA-256 hash or Block ID (e.g. #48921)..." 
                        className="w-full bg-white border border-emerald-950/20 rounded-2xl py-3.5 px-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
                      />
                    </div>
                    <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition shadow-md cursor-pointer">
                      Verify Cryptographic Integrity
                    </button>
                  </form>

                  {verifyResult.status === "verified" && (
                    <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5 text-xs shadow-2xs">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified: Matches On-Chain Record {verifyResult.details.blockId}
                      </div>
                      <div className="grid grid-cols-2 gap-y-1.5 text-[11px] text-slate-600 pt-1">
                        <span>Status:</span> <span className="font-bold text-emerald-700">{verifyResult.details.status}</span>
                        <span>Timestamp:</span> <span className="font-bold text-slate-800">{verifyResult.details.timestamp}</span>
                        <span>Validator Node:</span> <span className="font-bold text-slate-800">{verifyResult.details.author}</span>
                        <span>Cryptographic Hash:</span> <span className="font-mono text-[9px] text-slate-500 truncate max-w-[200px]">{verifyResult.details.hash}</span>
                      </div>
                    </div>
                  )}

                  {verifyResult.status === "tampered" && (
                    <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-xs shadow-2xs">
                      <div className="flex items-center gap-2 text-rose-800 font-bold">
                        <ShieldAlert className="w-4 h-4 text-rose-600" /> Integrity Mismatch: File has been altered or does not exist on ledger.
                      </div>
                      <p className="text-[11px] text-slate-600">The provided hash does not match any block recorded in the Ministry consortium database.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeNav === "Policy Simulator" ? (
            <div className="bg-white border border-emerald-950/10 rounded-3xl p-8 shadow-xs space-y-6 relative overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-emerald-950/10 pb-5">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-emerald-700 text-white rounded-2xl shadow-md">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-wide">National Land Policy & Zoning Simulation Engine</h2>
                    <p className="text-xs text-slate-500 font-medium">Test policy interventions digitally to evaluate spatial, environmental, and socio-economic outcomes before on-ground rollout.</p>
                  </div>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-2.5 bg-[#FAF8F5] px-5 py-2.5 rounded-2xl border border-emerald-950/10 shadow-2xs">
                  <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Step {simStep} of 3:</span>
                  <span className="text-xs font-bold text-slate-700">
                    {simStep === 1 ? "Select Region" : simStep === 2 ? "Choose Policy & Parameters" : "Dynamic Impact Results & Scenario Comparison"}
                  </span>
                </div>
              </div>

              {/* STEP 1: Select Region & Baseline Analysis */}
              {simStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-[#FAF8F5] border border-emerald-950/10 p-6 rounded-2xl shadow-inner space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-700" /> 📍 Select Study Area
                      </h3>
                      <div className="space-y-3.5 text-xs">
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">State</label>
                          <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full bg-white border border-emerald-950/20 rounded-xl p-3 font-semibold text-slate-800 shadow-2xs">
                            <option>Maharashtra</option>
                            <option>Karnataka</option>
                            <option>Gujarat</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">District</label>
                          <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="w-full bg-white border border-emerald-950/20 rounded-xl p-3 font-semibold text-slate-800 shadow-2xs">
                            <option>Pune</option>
                            <option>Nagpur</option>
                            <option>Nashik</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-slate-600 block mb-1">Taluka / Corridor</label>
                          <select value={selectedTaluka} onChange={(e) => setSelectedTaluka(e.target.value)} className="w-full bg-white border border-emerald-950/20 rounded-xl p-3 font-semibold text-slate-800 shadow-2xs">
                            <option>Haveli (Hadapsar Corridor)</option>
                            <option>Mulshi Peri-Urban</option>
                            <option>Maval Growth Zone</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 bg-[#FAF8F5] border border-emerald-950/10 p-6 rounded-2xl shadow-inner space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-700" /> 📊 Baseline Conditions ({selectedTaluka})
                        </h3>
                        <div className="grid grid-cols-4 gap-3.5">
                          <div className="p-4 bg-white rounded-2xl border border-emerald-950/10 shadow-2xs">
                            <p className="text-[10px] text-slate-400 uppercase font-black">Agricultural Land</p>
                            <p className="text-lg font-black text-emerald-700 mt-1">62% <span className="text-[10px] text-slate-500 font-normal">(-14%)</span></p>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-emerald-950/10 shadow-2xs">
                            <p className="text-[10px] text-slate-400 uppercase font-black">Built-up Area</p>
                            <p className="text-lg font-black text-rose-600 mt-1">21% <span className="text-[10px] text-slate-500 font-normal">(+19%)</span></p>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-emerald-950/10 shadow-2xs">
                            <p className="text-[10px] text-slate-400 uppercase font-black">Groundwater Stress</p>
                            <p className="text-lg font-black text-amber-600 mt-1">Critical <span className="text-[10px] text-slate-500 font-normal">(-2.4m)</span></p>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-emerald-950/10 shadow-2xs">
                            <p className="text-[10px] text-slate-400 uppercase font-black">Flood Risk</p>
                            <p className="text-lg font-black text-blue-600 mt-1">Medium <span className="text-[10px] text-slate-500 font-normal">(Drainage)</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button onClick={() => setSimStep(2)} className="px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center gap-2 cursor-pointer">
                          Proceed to Policy Library <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Choose Policy & Configure Parameters */}
              {simStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-[#FAF8F5] border border-emerald-950/10 p-6 rounded-2xl shadow-inner space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">🌾 Choose Policy Scenario</h3>
                      <div className="space-y-3 text-xs">
                        {[
                          { name: "Agricultural Protection Zone", cat: "Agricultural Protection", desc: "Mandates preservation of contiguous farmlands in peri-urban corridors." },
                          { name: "Controlled Urban Growth Boundary", cat: "Urban Planning", desc: "Restricts unplanned commercial real estate sprawl beyond municipal limits." },
                          { name: "River & Wetland Buffer Protection", cat: "Environmental", desc: "Enforces 100m–500m no-construction buffer zones around waterbodies." },
                          { name: "Transit-Oriented Development (TOD)", cat: "Infrastructure", desc: "Concentrates high-density vertical growth along designated transit corridors." }
                        ].map((pol, idx) => (
                          <div 
                            key={idx}
                            onClick={() => setSelectedPolicyType(pol.name)}
                            className={`p-4 rounded-2xl border transition cursor-pointer flex justify-between items-center shadow-2xs ${selectedPolicyType === pol.name ? 'bg-emerald-50/80 border-emerald-600 shadow-xs' : 'bg-white border-emerald-950/10 hover:bg-slate-50'}`}
                          >
                            <div className="space-y-1">
                              <span className="text-[9px] bg-emerald-100 text-emerald-900 font-black px-2 py-0.5 rounded-full uppercase">{pol.cat}</span>
                              <p className="font-bold text-slate-900">{pol.name}</p>
                              <p className="text-[10px] text-slate-500">{pol.desc}</p>
                            </div>
                            {selectedPolicyType === pol.name && <Check className="w-5 h-5 text-emerald-700 shrink-0" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#FAF8F5] border border-emerald-950/10 p-6 rounded-2xl shadow-inner space-y-5 flex flex-col justify-between">
                      <div className="space-y-5">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">⚙️ Policy Configuration Parameters</h3>
                        
                        <div className="space-y-4 text-xs">
                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-emerald-950/10 shadow-2xs">
                            <div className="flex justify-between font-bold">
                              <span className="text-slate-600">Protected Area / Restriction Target:</span>
                              <span className="text-emerald-700 font-black">{protectedAreaPct}% of Corridor</span>
                            </div>
                            <input 
                              type="range" 
                              min="10" 
                              max="50" 
                              step="5"
                              value={protectedAreaPct} 
                              onChange={(e) => setProtectedAreaPct(Number(e.target.value))}
                              className="w-full accent-emerald-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
                            />
                          </div>

                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-emerald-950/10 shadow-2xs">
                            <div className="flex justify-between font-bold">
                              <span className="text-slate-600">Ecological Buffer Distance:</span>
                              <span className="text-blue-600 font-black">{bufferDistance} meters</span>
                            </div>
                            <input 
                              type="range" 
                              min="100" 
                              max="1000" 
                              step="100"
                              value={bufferDistance} 
                              onChange={(e) => setBufferDistance(Number(e.target.value))}
                              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-emerald-950/10 shadow-2xs space-y-1.5">
                              <label className="font-bold text-slate-600 block">Time Horizon</label>
                              <select value={timeHorizon} onChange={(e) => setTimeHorizon(e.target.value)} className="w-full bg-[#FAF8F5] border border-emerald-950/20 rounded-xl p-2.5 font-semibold text-slate-800">
                                <option>5 years</option>
                                <option>10 years</option>
                                <option>15 years</option>
                                <option>20 years</option>
                              </select>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-emerald-950/10 shadow-2xs space-y-1.5">
                              <label className="font-bold text-slate-600 block">Enforcement Level</label>
                              <select value={enforcementLevel} onChange={(e) => setEnforcementLevel(e.target.value)} className="w-full bg-[#FAF8F5] border border-emerald-950/20 rounded-xl p-2.5 font-semibold text-slate-800">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High (Strict Monitoring)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button onClick={() => setSimStep(1)} className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer">Back</button>
                        <button 
                          onClick={() => { setSimStep(3); runSimulationProcess(); }} 
                          className="px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center gap-2 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-white" /> Run Simulation Engine
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Dynamic Simulation Results & Real-time Scenario Updates */}
              {simStep === 3 && (
                <div className="space-y-6">
                  {isSimulating ? (
                    <div className="bg-[#FAF8F5] border border-emerald-950/10 rounded-2xl p-16 text-center space-y-4 shadow-inner">
                      <RefreshCw className="w-10 h-10 text-emerald-700 animate-spin mx-auto" />
                      <h3 className="text-lg font-black text-slate-900">Recomputing Spatial Model for "{selectedPolicyType}"...</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">Applying LandSim v2.1 with {protectedAreaPct}% protection and {bufferDistance}m buffer across {selectedTaluka}.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Dynamic Live Policy Summary Bar */}
                      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-black text-emerald-300 tracking-wider">Active Policy Scenario</p>
                          <p className="text-sm font-black">{selectedPolicyType} ({protectedAreaPct}% Protection | {bufferDistance}m Buffer | {timeHorizon})</p>
                        </div>
                        <button onClick={() => setSimStep(2)} className="px-4.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20 cursor-pointer flex items-center gap-1.5 shadow-2xs">
                          <Sliders className="w-3.5 h-3.5" /> Adjust Parameters
                        </button>
                      </div>

                      {/* Hero KPI Results (Dynamically updated based on slider changes) */}
                      <div className="grid grid-cols-6 gap-4">
                        <div className="bg-[#FAF8F5] border border-emerald-950/10 p-4.5 rounded-2xl shadow-2xs">
                          <p className="text-[10px] uppercase font-black text-slate-400">Agricultural Land</p>
                          <p className="text-xl font-black text-emerald-700 mt-1">62% → {dynamicAgri}% <span className="text-[10px] text-emerald-600 font-bold">(+{(dynamicAgri - 62)}%)</span></p>
                        </div>
                        <div className="bg-[#FAF8F5] border border-emerald-950/10 p-4.5 rounded-2xl shadow-2xs">
                          <p className="text-[10px] uppercase font-black text-slate-400">Built-up Expansion</p>
                          <p className="text-xl font-black text-rose-600 mt-1">21% → {dynamicBuilt}% <span className="text-[10px] text-emerald-600 font-bold">({(dynamicBuilt - 21)}%)</span></p>
                        </div>
                        <div className="bg-[#FAF8F5] border border-emerald-950/10 p-4.5 rounded-2xl shadow-2xs">
                          <p className="text-[10px] uppercase font-black text-slate-400">Green Cover / Trees</p>
                          <p className="text-xl font-black text-emerald-800 mt-1">9% → {dynamicCanopy}% <span className="text-[10px] text-emerald-600 font-bold">(+{(dynamicCanopy - 9)}%)</span></p>
                        </div>
                        <div className="bg-[#FAF8F5] border border-emerald-950/10 p-4.5 rounded-2xl shadow-2xs">
                          <p className="text-[10px] uppercase font-black text-slate-400">Water Risk Status</p>
                          <p className="text-xl font-black text-blue-600 mt-1">{protectedAreaPct > 30 ? 'Low' : 'Medium'} <span className="text-[10px] text-emerald-600 font-bold">({bufferDistance}m)</span></p>
                        </div>
                        <div className="bg-[#FAF8F5] border border-emerald-950/10 p-4.5 rounded-2xl shadow-2xs">
                          <p className="text-[10px] uppercase font-black text-slate-400">Land Conversion</p>
                          <p className="text-xl font-black text-slate-900 mt-1">-{(protectedAreaPct * 1.2).toFixed(0)}% <span className="text-[10px] text-emerald-600 font-bold">(Opt)</span></p>
                        </div>
                        <div className="bg-[#FAF8F5] border border-emerald-950/10 p-4.5 rounded-2xl shadow-2xs">
                          <p className="text-[10px] uppercase font-black text-slate-400">Beneficiaries</p>
                          <p className="text-xl font-black text-indigo-700 mt-1">~{Math.round(20000 + protectedAreaPct * 400)} <span className="text-[10px] text-slate-500 font-normal">H/H</span></p>
                        </div>
                      </div>

                      {/* Map Simulation Viewer Toggle & Results */}
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-8 bg-[#FAF8F5] border border-emerald-950/10 rounded-2xl p-6 shadow-inner space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                              <MapIcon className="w-4 h-4 text-emerald-700" /> GIS Impact Map: {simMode === 'current' ? 'Current Baseline' : `Simulated Outcome (${selectedPolicyType})`}
                            </h3>
                            <div className="flex bg-white p-1 rounded-xl border border-emerald-950/10 text-xs font-bold shadow-2xs">
                              <button onClick={() => setSimMode("current")} className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${simMode === 'current' ? 'bg-emerald-700 text-white shadow' : 'text-slate-600'}`}>Current</button>
                              <button onClick={() => setSimMode("simulated")} className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${simMode === 'simulated' ? 'bg-emerald-700 text-white shadow' : 'text-slate-600'}`}>Simulated Outcome</button>
                            </div>
                          </div>

                          <div className="h-80 rounded-2xl overflow-hidden border border-emerald-950/20 relative shadow-2xs">
                            <MapVisualizer selectedZone={selectedZone} year={currentYear} layerMode={simMode === 'simulated' ? 'thermal' : 'satellite'} />
                            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-950/20 text-[10px] font-black text-slate-800 shadow-md">
                              {simMode === 'current' ? '🔴 Unrestricted Urban Sprawl & Agricultural Loss' : `🟢 Active Policy: ${selectedPolicyType} (${protectedAreaPct}%)`}
                            </div>
                          </div>
                        </div>

                        {/* AI Recommendation & Trade-offs */}
                        <div className="col-span-4 bg-[#FAF8F5] border border-emerald-950/10 rounded-2xl p-6 shadow-inner space-y-4 flex flex-col justify-between">
                          <div className="space-y-3.5">
                            <div className="flex items-center justify-between border-b border-emerald-950/10 pb-3">
                              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-emerald-700" /> AI Policy Recommendation
                              </h3>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full">Confidence 88%</span>
                            </div>
                            <p className="text-xs font-bold text-emerald-900">Evaluated Scenario: {selectedPolicyType}</p>
                            <p className="text-[11px] text-slate-600 leading-relaxed">Setting a {protectedAreaPct}% threshold with a {bufferDistance}m buffer successfully preserves critical ecological zones in {selectedTaluka} with minimal economic friction.</p>
                            
                            <div className="space-y-1.5 pt-1">
                              <p className="text-[10px] font-black uppercase text-slate-400">Key Trade-offs:</p>
                              <div className="text-[11px] text-slate-700 space-y-1">
                                <p className="flex items-center gap-1.5">✅ Preserves {dynamicAgri}% agricultural productivity.</p>
                                <p className="flex items-center gap-1.5">⚠️ Estimated implementation cost: ₹{(protectedAreaPct * 0.71).toFixed(1)} Cr.</p>
                              </div>
                            </div>
                          </div>

                          <button onClick={() => alert(`Evidence-based Policy Report for "${selectedPolicyType}" Generated Successfully with Blockchain Hash #48921!`)} className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer">
                            <FileText className="w-4 h-4" /> Generate Policy Report
                          </button>
                        </div>
                      </div>

                      {/* Scenario Comparison Table */}
                      <div className="bg-[#FAF8F5] border border-emerald-950/10 rounded-2xl p-6 shadow-inner space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">📊 Scenario Comparison Matrix</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-white text-slate-700 font-black uppercase text-[10px]">
                              <tr>
                                <th className="p-3.5 rounded-l-xl">Indicator</th>
                                <th className="p-3.5">Business as Usual</th>
                                <th className="p-3.5">Selected ({selectedPolicyType} @ {protectedAreaPct}%)</th>
                                <th className="p-3.5 rounded-r-xl">Aggressive Protection (40%)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-950/10 font-medium">
                              <tr>
                                <td className="p-3.5 font-bold text-slate-900">Agricultural Land Retention</td>
                                <td className="p-3.5 text-rose-600 font-bold">54%</td>
                                <td className="p-3.5 text-emerald-700 font-bold">{dynamicAgri}% (Active)</td>
                                <td className="p-3.5 text-emerald-800 font-bold">72%</td>
                              </tr>
                              <tr>
                                <td className="p-3.5 font-bold text-slate-900">Urban Expansion Rate</td>
                                <td className="p-3.5 text-rose-600 font-bold">+24%</td>
                                <td className="p-3.5 text-emerald-700 font-bold">+{Math.max(5, 25 - protectedAreaPct)}%</td>
                                <td className="p-3.5 text-slate-600">+8%</td>
                              </tr>
                              <tr>
                                <td className="p-3.5 font-bold text-slate-900">Groundwater Risk Level</td>
                                <td className="p-3.5 text-rose-600 font-bold">High</td>
                                <td className="p-3.5 text-amber-600 font-bold">{protectedAreaPct > 25 ? 'Low' : 'Medium'}</td>
                                <td className="p-3.5 text-emerald-700 font-bold">Low</td>
                              </tr>
                              <tr>
                                <td className="p-3.5 font-bold text-slate-900">Implementation Cost</td>
                                <td className="p-3.5 text-emerald-700 font-bold">Low (₹0 Cr)</td>
                                <td className="p-3.5 text-amber-600 font-bold">₹{(protectedAreaPct * 0.71).toFixed(1)} Cr</td>
                                <td className="p-3.5 text-rose-600 font-bold">High (₹32.8 Cr)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="pt-2 flex justify-between">
                          <button onClick={() => setSimStep(2)} className="px-4.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer border border-emerald-950/10 shadow-2xs">Modify Parameters</button>
                          <button onClick={() => setSimStep(1)} className="px-4.5 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-2xs">Start New Simulation</button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              
              {/* Left Column (Shifted Map Side): col-span-9 */}
              <div className="col-span-9 flex flex-col gap-6">
                
                {/* 4 Top Metric Cards */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white border border-emerald-950/10 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs relative overflow-hidden group hover:border-emerald-500 transition">
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700 shrink-0">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Agriculture</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{displayAgri}% <span className="text-[9px] text-emerald-700 font-bold">Farmland</span></p>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-950/10 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs relative overflow-hidden group hover:border-emerald-500 transition">
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700 shrink-0">
                      <Trees className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Forest & Trees</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{displayCanopy}% <span className="text-[9px] text-emerald-700 font-bold">Canopy</span></p>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-950/10 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs relative overflow-hidden group hover:border-rose-500 transition">
                    <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-600 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Built Structures</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{displayBuilt}% <span className="text-[9px] text-rose-600 font-bold">Density</span></p>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-950/10 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs relative overflow-hidden group hover:border-blue-500 transition">
                    <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-600 shrink-0">
                      <Waves className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black">Water Resources</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{displayWater}% <span className="text-[9px] text-blue-600 font-bold">Flow</span></p>
                    </div>
                  </div>
                </div>

                {/* Restored Original Large Map Visualizer Card (h-[650px]) */}
                <div className="bg-white border border-emerald-950/10 rounded-3xl p-5 shadow-xs flex flex-col h-[650px] relative overflow-hidden">
                  
                  <div className="flex-1 rounded-2xl overflow-hidden border border-emerald-950/15 relative shadow-inner flex flex-col">
                    <div className="flex-1 relative">
                      <MapVisualizer selectedZone={selectedZone} year={currentYear} layerMode={activeLayer} />

                      {/* Realistic Search Bar on Top Left of Map */}
                      <div className="absolute top-4 left-4 z-20 w-80">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text" 
                            list="location-options"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search Survey No., Village, Taluka..." 
                            className="w-full bg-white/95 backdrop-blur-md border border-emerald-950/20 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                          />
                          <datalist id="location-options">
                            <option value="Hadapsar Peri-Urban" />
                            <option value="Lohegaon (ADYPSOE)" />
                          </datalist>
                        </div>
                      </div>

                      {/* Satellite / Map / Terrain Toggles on Top Right of Map */}
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                        <div className="bg-white/95 backdrop-blur-md border border-emerald-950/20 rounded-2xl p-1 flex items-center gap-1 text-xs font-bold text-slate-700 shadow-lg">
                          <button onClick={() => setActiveLayer("satellite")} className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${activeLayer === 'satellite' ? 'bg-emerald-700 text-white shadow' : 'hover:bg-slate-100'}`}>Satellite</button>
                          <button onClick={() => setActiveLayer("thermal")} className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${activeLayer === 'thermal' ? 'bg-amber-600 text-white shadow' : 'hover:bg-slate-100'}`}>Map</button>
                          <button onClick={() => setActiveLayer("moisture")} className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${activeLayer === 'moisture' ? 'bg-blue-600 text-white shadow' : 'hover:bg-slate-100'}`}>Terrain</button>
                        </div>
                      </div>

                      {/* Floating Survey Parcel Card with DB synced details */}
                      {showParcelCard && activeData && (
                        <div className="absolute top-16 right-16 z-20 bg-white/95 backdrop-blur-md border border-emerald-950/20 p-5 rounded-2xl shadow-2xl w-80 space-y-3">
                          <div className="flex justify-between items-center border-b border-emerald-950/10 pb-2.5">
                            <span className="text-xs font-black text-emerald-900 uppercase tracking-widest flex items-center gap-1.5">
                              <Trees className="w-3.5 h-3.5 text-emerald-700" /> {activeData.name}
                            </span>
                            <button onClick={() => setShowParcelCard(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold -mt-2">Pune, Maharashtra</p>
                          <div className="grid grid-cols-2 gap-y-2.5 text-[11px]">
                            <span className="text-slate-500 font-medium">Land Use:</span> <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">{activeData.currentZoning}</span>
                            <span className="text-slate-500 font-medium">Area:</span> <span className="font-bold text-slate-900">2.84 ha</span>
                            <span className="text-slate-500 font-medium">Risk Level:</span> <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block text-center">{activeData.riskFactors.floodRisk}</span>
                            <span className="text-slate-500 font-medium">Land-use change:</span> <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">{activeData.historicalData.groundwaterDepletion}</span>
                            <span className="text-slate-500 font-medium">Data confidence:</span> <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">94%</span>
                          </div>
                        </div>
                      )}

                      {/* Original Detailed Legend on Bottom Left */}
                      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md border border-emerald-950/20 p-3.5 rounded-2xl shadow-lg text-[10px] space-y-2 w-72">
                        <div className="font-black text-slate-900 uppercase tracking-wider mb-1">LEGEND</div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-semibold text-slate-700">
                          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-sm shrink-0" /> Selected Parcel</div>
                          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-600 rounded-sm shrink-0" /> Agricultural Land</div>
                          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-rose-600 rounded-sm shrink-0" /> Cadastral Boundary</div>
                          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-800 rounded-sm shrink-0" /> Forest Area</div>
                          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#A0522D] rounded-sm shrink-0" /> Survey Boundary</div>
                          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-700 rounded-sm shrink-0" /> Urban Expansion</div>
                          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-600 rounded-sm shrink-0" /> Roads</div>
                          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-500 rounded-sm shrink-0" /> River / Waterbody</div>
                        </div>
                      </div>

                      {/* Map Zoom Controls on Bottom Right */}
                      <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md border border-emerald-950/20 rounded-2xl p-1 flex flex-col gap-1 shadow-lg">
                        <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-700 cursor-pointer"><Navigation className="w-3.5 h-3.5" /></button>
                        <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-700 border-t border-emerald-950/10 cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                        <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-700 border-t border-emerald-950/10 cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                        <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-700 border-t border-emerald-950/10 cursor-pointer"><Crosshair className="w-3.5 h-3.5" /></button>
                      </div>

                    </div>

                    {/* Timeline Slider Bar Embedded Inside Map Card */}
                    <div className="px-6 py-4 bg-[#FAF8F5] border-t border-emerald-950/10 flex flex-col gap-2">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-wider text-slate-600">
                        <span>2015 (Agri Focus)</span>
                        <span>2020 (Transition)</span>
                        <span>{currentYear} ({currentYear === 2025 ? 'Urbanized' : currentYear})</span>
                      </div>
                      <input 
                        type="range" 
                        min="2015" 
                        max="2025" 
                        step="5"
                        value={currentYear}
                        onChange={(e) => setCurrentYear(Number(e.target.value))}
                        className="w-full accent-emerald-700 cursor-pointer h-2.5 bg-slate-200 rounded-lg shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Land Classification Breakdown Card (Breakdown on left, larger Pie Chart on right) */}
                <div className="bg-white border border-emerald-950/10 rounded-3xl p-6 shadow-xs flex items-center justify-between">
                  <div className="flex items-center justify-between w-full gap-10">
                    <div className="flex-1 space-y-3.5">
                      <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-700" /> Land Classification Breakdown ({currentYear})
                      </h3>
                      <div className="flex flex-col gap-3 text-xs font-bold">
                        <div className="flex items-center gap-2.5 text-emerald-600"><span className="w-3.5 h-3.5 bg-emerald-500 rounded-md inline-block shrink-0 shadow-2xs" /> Agriculture: <span className="text-slate-900">{displayAgri}%</span></div>
                        <div className="flex items-center gap-2.5 text-emerald-800"><span className="w-3.5 h-3.5 bg-emerald-700 rounded-md inline-block shrink-0 shadow-2xs" /> Forest / Trees: <span className="text-slate-900">{displayCanopy}%</span></div>
                        <div className="flex items-center gap-2.5 text-rose-600"><span className="w-3.5 h-3.5 bg-rose-600 rounded-md inline-block shrink-0 shadow-2xs" /> Built-up Area: <span className="text-slate-900">{displayBuilt}%</span></div>
                        <div className="flex items-center gap-2.5 text-blue-600"><span className="w-3.5 h-3.5 bg-blue-600 rounded-md inline-block shrink-0 shadow-2xs" /> Water Bodies: <span className="text-slate-900">{displayWater}%</span></div>
                      </div>
                    </div>

                    <div className="w-52 h-48 shrink-0 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={currentPieData} cx="50%" cy="50%" innerRadius={46} outerRadius={76} paddingAngle={8} cornerRadius={6} stroke="none" dataKey="value">
                            {currentPieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#FDFBF7', border: '1px solid #d97706', borderRadius: '12px', color: '#1e293b' }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (Parcel Intel Panel): col-span-3 */}
              <div className="col-span-3 bg-white border border-emerald-950/10 rounded-3xl flex flex-col h-full overflow-hidden shadow-xs">
                
                <div className="p-4 border-b border-emerald-950/10 bg-[#FAF8F5] flex items-center gap-2 text-emerald-900 text-xs uppercase tracking-wider font-black">
                  <Cpu className="w-4 h-4 text-emerald-700" /> Parcel Intel
                </div>

                <div className="p-5 space-y-4 flex-1 overflow-y-auto">
                  {activeData ? (
                    <>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-black text-xs uppercase tracking-wide text-slate-900 truncate">{activeData.name}</h3>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border shadow-2xs ${
                          permitStatus === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 
                          permitStatus === 'Rejected' ? 'bg-rose-50 text-rose-800 border-rose-200' : 
                          'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {permitStatus}
                        </span>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between shadow-2xs">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-emerald-900 font-black">Eco-Index Score</p>
                          <p className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">{healthScore} <span className="text-[10px] font-semibold text-slate-500">/ 100</span></p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                          <Sparkles className="w-4 h-4 text-emerald-700" />
                        </div>
                      </div>

                      <div className="bg-[#FAF8F5] border border-emerald-950/10 p-4 rounded-2xl space-y-2.5 shadow-2xs">
                        <div className="flex items-center gap-2 text-emerald-700"><History className="w-3.5 h-3.5" /><h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900">Zoning Evolution</h4></div>
                        <div className="space-y-1.5 text-[11px] font-medium">
                          <div className="flex justify-between"><span className="text-slate-500">2015:</span><span className="text-slate-700 truncate max-w-[120px]">{activeData.historicalData.useIn2015}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">2020:</span><span className="text-slate-700 truncate max-w-[120px]">{activeData.historicalData.useIn2020}</span></div>
                          <div className="flex justify-between border-t border-emerald-950/10 pt-2"><span className="text-slate-900 font-bold">Current:</span><span className="text-rose-600 font-black">{activeData.currentZoning}</span></div>
                        </div>
                      </div>

                      <div className="bg-[#FAF8F5] border border-emerald-950/10 p-4 rounded-2xl space-y-2.5 shadow-2xs">
                        <div className="flex items-center gap-2 text-blue-600"><Droplets className="w-3.5 h-3.5" /><h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900">Hydrology & Risks</h4></div>
                        <div className="space-y-1.5 text-[11px] font-medium">
                          <div className="flex justify-between"><span className="text-slate-500">GW Stress:</span><span className="text-rose-600 font-bold">{activeData.historicalData.groundwaterDepletion}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Flood Risk:</span><span className="text-slate-900 font-bold">{activeData.riskFactors.floodRisk}</span></div>
                        </div>
                      </div>

                      <div className="bg-[#FAF8F5] border border-emerald-950/10 p-4 rounded-2xl space-y-3 shadow-2xs">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700">Permit Authorization</h4>
                        <div className="flex gap-2.5">
                          <button onClick={() => setPermitStatus("Approved")} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[10px] uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer">
                            <ShieldCheck className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => setPermitStatus("Rejected")} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-20">
                      <MapPin className="w-8 h-8 mb-2 opacity-40 text-emerald-700" />
                      <p className="text-[11px] uppercase tracking-wider font-bold">Select a sector to analyze metrics.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}