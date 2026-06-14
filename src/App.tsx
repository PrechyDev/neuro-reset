/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  Sparkles, 
  MapPin, 
  Clock, 
  Briefcase, 
  User, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Brain,
  Coffee,
  Volume2,
  VolumeX,
  ArrowLeft
} from "lucide-react";
import Header from "./components/Header";
import { 
  FEELING_PRESETS, 
  TRIGGER_PRESETS, 
  LOCATION_PRESETS, 
  TIME_PRESETS, 
  OFFLINE_RESETS,
  ADVICE_SLIDES 
} from "./data";
import { ResetInput, ResetResponse, ResetCategory } from "./types";

export default function App() {
  // Main form inputs state
  const [inputs, setInputs] = useState<ResetInput>({
    feeling: "",
    trigger: "",
    location: "Home (Bedroom / Parlor)",
    task: "",
    time: "5 minutes",
    intensity: "moderate"
  });

  // UI helpers
  const [activeTab, setActiveTab] = useState<'generator' | 'presets'>('generator');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Scanning brain chemistry...");
  const [result, setResult] = useState<ResetResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Timer States
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerCompleted, setIsTimerCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Web Audio Synthesizer to make clean somatic start/stop/success sounds
  const playSynthSound = (frequencies: number[], duration: number = 0.15, type: 'sine' | 'triangle' = 'sine') => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        
        gain.gain.setValueAtTime(0.04, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + duration);
      });
    } catch (err) {
      console.warn("Somatic Audio Synth blocked by browser interaction policy:", err);
    }
  };

  const playStartSound = () => {
    playSynthSound([523.25, 659.25], 0.22); // Ascending calm chime
  };

  const playStopSound = () => {
    playSynthSound([392.00, 329.63], 0.18, 'triangle'); // Soft descending stop
  };

  const playCompleteSound = () => {
    playSynthSound([523.25, 659.25, 783.99, 1046.50], 0.35); // Uplifting completed chord
  };

  // Rotating advice ticker
  const [adviceIndex, setAdviceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdviceIndex((prev) => (prev + 1) % ADVICE_SLIDES.length);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Timer countdown handler
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setIsTimerCompleted(true);
      playCompleteSound();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerActive, timeLeft]);

  // Start / pause / reset timer controllers
  const toggleTimer = () => {
    const nextState = !timerActive;
    setTimerActive(nextState);
    if (nextState) {
      playStartSound();
    } else {
      playStopSound();
    }
  };

  const resetTimer = (secs: number) => {
    setTimerActive(false);
    setTimeLeft(secs);
    setIsTimerCompleted(false);
    playStopSound();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Helper messages to spin through during load
  const loadMessages = [
    "Checking your location bounds...",
    "Shaking off the toxic positivity...",
    "Finding an evidence-based clinical hack...",
    "Tailoring the perfect micro-reset...",
    "Consulting standard attention guidelines...",
    "Dopamine analysis underway..."
  ];

  // Function to request a reset via Express API, with elegant offline fallback
  const handleGetReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputs.feeling.trim()) {
      setError("Tell us brief details about how your focus/brain feels right now.");
      return;
    }
    if (!inputs.location.trim()) {
      setError("Tell us where you are physically right now (e.g., 'at my girlfriend's house' or 'office').");
      return;
    }
    if (!inputs.time.trim()) {
      setError("Tell us how much time you can spare right now for your reset break (e.g., 5 minutes).");
      return;
    }
    if (!inputs.task.trim()) {
      setError("What is that ONE target task you still must face? Just name it simply.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setIsTimerCompleted(false);

    // Random loading msg cycles
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadMessages.length;
      setLoadingMessage(loadMessages[msgIndex]);
    }, 1800);

    try {
      const response = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed server response");
      }

      const data = await response.json() as ResetResponse;
      setResult(data);
      setTimeLeft(data.durationSeconds || 300);
    } catch (err: any) {
      console.warn("API Call encountered an issue. Activating ADHD Reset offline local engine:", err);
      // Fallback: Pick a smart pre-curated custom offline reset matching their position
      const isPublic = 
        inputs.location.includes("Office") || 
        inputs.location.includes("Library") || 
        inputs.location.includes("Danfo") || 
        inputs.location.includes("Banking") || 
        inputs.location.includes("Classroom");

      const choices = isPublic ? OFFLINE_RESETS.public : OFFLINE_RESETS.private;
      const index = Math.floor(Math.random() * choices.length);
      const chosen = { ...choices[index] };
      
      // Inject user's specific task into the bridge step to personalize it
      chosen.then = `Then: Shake away the inertia, sit straight, and look at your task: "${inputs.task}".`;
      
      // Setup small delay for satisfying UI transition
      await new Promise(resolve => setTimeout(resolve, 800));
      setResult(chosen);
      setTimeLeft(chosen.durationSeconds);
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  // Helper to click on any preset chip
  const handlePresetSelect = (field: keyof ResetInput, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const getCategoryColor = (cat: ResetCategory) => {
    switch (cat) {
      case "sensory": return "from-blue-600/20 to-cyan-600/10 border-blue-500/30 text-blue-300";
      case "movement": return "from-amber-600/20 to-orange-600/10 border-amber-500/30 text-amber-300";
      case "dopamine": return "from-emerald-600/20 to-green-600/10 border-emerald-500/30 text-emerald-300";
      case "body-double": return "from-purple-600/20 to-indigo-600/10 border-purple-500/30 text-purple-300";
      case "initiation": return "from-rose-600/20 to-red-600/10 border-rose-500/30 text-rose-300";
      default: return "from-slate-600/20 to-slate-800/10 border-slate-500/30 text-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Subtle, highly realistic motivation banner - rotating advice */}
        <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 transition-all duration-500">
          <div className="bg-orange-500/10 p-2 rounded-xl text-orange-400 shrink-0">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider block mb-0.5">ADHD Mind Hack Indicator</span>
            <p className="text-sm text-slate-300 leading-relaxed font-sans transition-all duration-300">
              "{ADVICE_SLIDES[adviceIndex]}"
            </p>
          </div>
        </div>

        {/* Single Focused Workspace Card */}
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">

          {/* STATE 1: Dynamic loading screen */}
          {loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center py-20 gap-6 min-h-[460px] animate-pulse">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-orange-500/15 border-t-orange-500 rounded-full animate-spin" />
                <Brain className="w-6 h-6 text-orange-400 absolute animate-pulse" />
              </div>
              <div className="flex flex-col gap-2 max-w-sm">
                <h3 className="font-display font-medium text-slate-200 text-lg">Designing your Reset...</h3>
                <p className="text-xs text-slate-400 font-mono italic">
                  "{loadingMessage}"
                </p>
              </div>
            </div>
          )}

          {/* STATE 2: The customizable input setup form */}
          {!loading && !result && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-lg font-display font-semibold text-slate-100 mb-2 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-orange-400" />
                Customize your Reset
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Avoid complex drafting. Click a quick chip to auto-fill or type customized text. We will build a realistic action based on where you are.
              </p>

              <form onSubmit={handleGetReset} className="flex flex-col gap-5">
                
                {/* 1. Feeling state */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="feeling-input" className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wide flex justify-between items-center">
                    <span>1. How are you feeling right now?</span>
                    {inputs.feeling && (
                      <button 
                        type="button" 
                        onClick={() => handlePresetSelect('feeling', '')}
                        className="text-[10px] text-orange-400 hover:underline capitalize animate-fade-in"
                      >
                        clear
                      </button>
                    )}
                  </label>
                  <input
                    id="feeling-input"
                    type="text"
                    placeholder="e.g., Frozen and heavy, browsing random forums, brain feels completely blank..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 outline-none text-slate-200 placeholder-slate-600 transition-all font-sans"
                    value={inputs.feeling}
                    onChange={(e) => handlePresetSelect('feeling', e.target.value)}
                  />
                  
                  {/* Feeling presets */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {FEELING_PRESETS.chips.map((chip) => {
                      const isSelected = inputs.feeling === chip.value;
                      return (
                        <button
                          key={chip.id}
                          id={chip.id}
                          type="button"
                          onClick={() => handlePresetSelect('feeling', chip.value)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                            isSelected 
                              ? "bg-orange-500/10 border-orange-500/50 text-orange-300 font-medium" 
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                          }`}
                        >
                          <span role="img" aria-label="emoji">{chip.emoji}</span>
                          <span>{chip.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Focus Block Intensity Select */}
                <div className="flex flex-col gap-2 mt-1">
                  <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wide flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                    <span>Focus Block Intensity</span>
                  </span>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { value: 'mild', label: 'Mild ☁️', desc: 'Slight float / light transition lag' },
                      { value: 'moderate', label: 'Moderate 🌀', desc: 'Stuck screen / active scroll' },
                      { value: 'intense', label: 'Intense 💥', desc: 'Total paralysis / sensory burnout' }
                    ].map((opt) => {
                      const isSelected = inputs.intensity === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setInputs(prev => ({ ...prev, intensity: opt.value as any }))}
                          className={`flex flex-col items-start p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-orange-500/10 border-orange-500/60 text-orange-300 ring-1 ring-orange-500/30" 
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <span className="text-xs font-bold font-sans tracking-tight block">
                            {opt.label}
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans leading-tight mt-1 line-clamp-1">
                            {opt.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Triggering factor */}
                <div className="flex flex-col gap-2 mt-1">
                  <label htmlFor="trigger-input" className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wide flex justify-between items-center">
                    <span>2. What triggered it? <span className="text-slate-500">(Optional)</span></span>
                    {inputs.trigger && (
                      <button 
                        type="button" 
                        onClick={() => handlePresetSelect('trigger', '')}
                        className="text-[10px] text-orange-400 hover:underline capitalize"
                      >
                        clear
                      </button>
                    )}
                  </label>
                  <input
                    id="trigger-input"
                    type="text"
                    placeholder="e.g., WhatsApp chat group ping, or just looming task dread..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 outline-none text-slate-200 placeholder-slate-600 transition-all font-sans"
                    value={inputs.trigger}
                    onChange={(e) => handlePresetSelect('trigger', e.target.value)}
                  />
                  
                  {/* Trigger presets */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {TRIGGER_PRESETS.chips.map((chip) => {
                      const isSelected = inputs.trigger === chip.value;
                      return (
                        <button
                          key={chip.id}
                          id={chip.id}
                          type="button"
                          onClick={() => handlePresetSelect('trigger', chip.value)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                            isSelected 
                              ? "bg-orange-500/10 border-orange-500/50 text-orange-300 font-medium" 
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                          }`}
                        >
                          <span role="img" aria-label="emoji">{chip.emoji}</span>
                          <span>{chip.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Physical Location & Time Frame side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="location-input" className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wide flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-400" />
                        3. Where are you physically?
                      </span>
                    </label>
                    <input
                      id="location-input"
                      type="text"
                      required
                      placeholder="e.g., At my girlfriend's house, cold room, office desk..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 outline-none text-slate-200 placeholder-slate-600 transition-all font-sans"
                      value={inputs.location}
                      onChange={(e) => handlePresetSelect('location', e.target.value)}
                    />
                    
                    {/* Location quick presets */}
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {LOCATION_PRESETS.chips.map((chip) => {
                        const isSelected = inputs.location === chip.value;
                        return (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => handlePresetSelect('location', chip.value)}
                            className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                              isSelected 
                                ? "bg-orange-500/10 border-orange-500/50 text-orange-300 font-medium" 
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                            }`}
                          >
                            <span>{chip.emoji}</span>
                            <span>{chip.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="time-input" className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wide flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                        4. Available time to reset
                      </span>
                    </label>
                    <input
                      id="time-input"
                      type="text"
                      required
                      placeholder="e.g., 5 minutes, 10 mins..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 outline-none text-slate-200 placeholder-slate-600 transition-all font-sans"
                      value={inputs.time}
                      onChange={(e) => handlePresetSelect('time', e.target.value)}
                    />

                    {/* Time presets */}
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {TIME_PRESETS.chips.map((chip) => {
                        const isSelected = inputs.time === chip.value;
                        return (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => handlePresetSelect('time', chip.value)}
                            className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                              isSelected 
                                ? "bg-orange-500/10 border-orange-500/50 text-orange-300 font-medium" 
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                            }`}
                          >
                            <span>{chip.emoji}</span>
                            <span>{chip.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* 5. Most important target task */}
                <div className="flex flex-col gap-2 mt-1">
                  <label htmlFor="task-input" className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wide flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-orange-400" />
                    <span>5. One task you STILL MUST do</span>
                  </label>
                  <input
                    id="task-input"
                    type="text"
                    required
                    placeholder="e.g., Replying client's email, code a React component, read thesis PDF..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 outline-none text-slate-200 placeholder-slate-600 transition-all font-sans"
                    value={inputs.task}
                    onChange={(e) => handlePresetSelect('task', e.target.value)}
                  />
                </div>

                {/* Error Box */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  id="reset-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 font-display font-semibold text-sm bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-55 shadow-md hover:shadow-orange-700/20 px-4 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Activity className="w-4.5 h-4.5" />
                  <span>Get Instant Micro-Reset</span>
                </button>

              </form>
            </div>
          )}

          {/* STATE 3: Real-time generated active reset matching layout requested */}
          {!loading && result && (
            <div className={`bg-gradient-to-b ${getCategoryColor(result.category)} border rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col gap-5 min-h-[500px] transition-all duration-300`}>
              
              {/* Back to input navigation bar */}
              <div className="flex items-center justify-between border-b border-orange-500/10 pb-4">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setIsTimerCompleted(false);
                    setTimerActive(false);
                  }}
                  className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-orange-400 hover:border-orange-500/30 transition-all font-semibold py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 shadow"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-orange-400" /> Back to Customizer
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-slate-950 text-orange-300 border border-orange-500/20">
                    {result.category}
                  </span>
                  <span className="text-xs font-mono text-slate-300 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                    ⏱️ {result.durationSeconds ? Math.ceil(result.durationSeconds / 60) : 3} min
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-400/80 block mb-1">Your Selected Reset</span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-100 tracking-tight leading-snug">
                  {result.title}
                </h3>
              </div>

              {/* Structured text content */}
              <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-200">
                <div id="intervention-text" className="p-4 bg-slate-950 border border-slate-800/85 rounded-xl shadow-inner">
                  <p className="font-bold text-orange-400 mb-1 font-mono text-xs tracking-wider">DO THIS NOW</p>
                  <p className="font-sans text-slate-100 text-sm leading-relaxed">
                    {result.intervention.replace(/^Do this now:\s*/i, "")}
                  </p>
                </div>

                <div id="why-text">
                  <span className="font-bold text-xs text-orange-400 font-mono tracking-wider block mb-0.5">WHY IT WORKS</span>
                  <p className="text-xs text-slate-300 italic">
                    {result.whyItWorks.replace(/^Why it works:\s*/i, "")}
                  </p>
                </div>

                <div id="then-text" className="border-t border-slate-800/40 pt-4">
                  <span className="font-bold text-xs text-orange-400 font-mono tracking-wider block mb-0.5">THEN</span>
                  <p className="font-sans font-medium text-slate-200 text-sm leading-relaxed">
                    {result.then.replace(/^Then:\s*/i, "")}
                  </p>
                </div>
              </div>

              {/* Interactive stopwatch and sound controls */}
              <div className="mt-auto bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-medium font-mono text-slate-500 uppercase tracking-widest block">Reset Countdown</span>
                    <span className="text-3xl font-mono font-bold text-orange-400 tracking-tight">
                      {formatTime(timeLeft)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Customizable volume mute controller */}
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-2 rounded-xl border transition-all ${
                        isMuted 
                          ? "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300" 
                          : "bg-orange-500/10 border-orange-500/20 text-orange-300 hover:bg-orange-500/20"
                      }`}
                      title={isMuted ? "Unmute reset chimes" : "Mute reset chimes"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleTimer}
                      className={`p-2 rounded-xl border transition-all ${
                        timerActive 
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/20" 
                          : "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                      }`}
                      title={timerActive ? "Pause Reset Counter" : "Start Reset Counter"}
                    >
                      {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => resetTimer(result.durationSeconds || 120)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Timer dynamic loading bar */}
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-orange-600 to-amber-500 h-full transition-all duration-1000"
                    style={{ 
                      width: `${result.durationSeconds ? ((result.durationSeconds - timeLeft) / result.durationSeconds) * 100 : 0}%` 
                    }}
                  />
                </div>

                {/* Completed Banner */}
                {isTimerCompleted && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-emerald-300 text-xs rounded-lg flex items-center gap-2 animate-bounce">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Great job on resetting! Transition back to your task gently now.</span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Humble Footer */}
      <footer className="w-full py-6 mt-12 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-600 font-mono">
        <div>NeuroReset &copy; 2026. Somatic grounding, sensory zoning, and task-initiation science for adults doing adulting for the first time.</div>
      </footer>
    </div>
  );
}

