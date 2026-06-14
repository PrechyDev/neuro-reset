import React from "react";
import { Sparkles, Activity } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full py-6 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
          <Activity className="w-5 h-5 animate-pulse-ring" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-100 tracking-tight flex items-center gap-2">
            NeuroReset <span className="text-xs font-mono font-medium text-orange-400 px-2 py-0.5 rounded-full bg-orange-500/10">v1.0</span>
          </h1>
          <p className="text-xs text-slate-400 font-sans">
            Warm, evidence-grounded micro-resets to break executive dysfunction and task inertia
          </p>
        </div>
      </div>
      
      <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
        <Sparkles className="w-3.5 h-3.5 text-orange-400" />
        <span>No toxic positivity allowed</span>
      </div>
    </header>
  );
}
