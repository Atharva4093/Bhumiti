"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, AlertTriangle, Sprout, Building2, FileText, CheckCircle2 } from "lucide-react";

export default function AiAssistantView() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: "Hello! I am your Evidence AI Assistant for Bhumiti OS. Ask me about flood risks, agricultural conversion, or select a quick prompt below.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text, timestamp: userTime }]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "Based on current geospatial data and audit records, this zone exhibits standard urban boundary friction.";
      
      const lower = text.toLowerCase();
      if (lower.includes("flood") || lower.includes("water")) {
        aiReply = "This area has a medium-to-high risk of waterlogging during heavy rains because natural rainwater paths have been blocked by new concrete buildings.";
      } else if (lower.includes("agri") || lower.includes("farm") || lower.includes("crop")) {
        aiReply = "Farmland in this sector has decreased by about 18.5% over the last ten years because open fields are fast turning into commercial and residential zones.";
      } else if (lower.includes("zoning") || lower.includes("commercial")) {
        aiReply = "Commercial zoning density has increased by 14% over the last 3 years, triggering municipal infrastructure upgrades.";
      }

      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply, timestamp: aiTime }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="w-full h-full p-6 bg-slate-50 flex flex-col h-[calc(100vh-2rem)] overflow-hidden">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-4 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
            <Bot className="w-4 h-4" />
            <span>GENAI LAND INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Evidence AI Assistant</h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Query multi-departmental logs, flood risk indicators, and historical land transition metrics.
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 flex-shrink-0">
        <button
          onClick={() => handleSend("What is the flood risk assessment for this sector?")}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer shadow-sm whitespace-nowrap"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Check Flood Risk Assessment</span>
        </button>
        <button
          onClick={() => handleSend("What is the agricultural loss rate over the decade?")}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer shadow-sm whitespace-nowrap"
        >
          <Sprout className="w-3.5 h-3.5 text-emerald-500" />
          <span>Check Agricultural Loss Rate</span>
        </button>
        <button
          onClick={() => handleSend("Analyze current commercial zoning expansion trends.")}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer shadow-sm whitespace-nowrap"
        >
          <Building2 className="w-3.5 h-3.5 text-blue-500" />
          <span>Analyze Zoning Expansion</span>
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-xl p-4 rounded-2xl text-sm ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-sm' 
                  : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] mt-1.5 block ${msg.sender === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 items-center text-slate-400 text-xs italic">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <span>Analyzing geospatial sensor streams...</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            placeholder="Ask about sector vulnerabilities, zoning rules, or environmental data..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          <button
            onClick={() => handleSend()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}