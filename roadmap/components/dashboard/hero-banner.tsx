import React from 'react';
import Link from 'next/link';

interface DashboardHeroProps {
  displayName: string;
  globalCompletionPercentage: number;
  globalCompleted: number;
  globalTotal: number;
  currentMonthNum: number;
  currentWeekNum: number;
}

export function DashboardHero({
  displayName,
  globalCompletionPercentage,
  globalCompleted,
  globalTotal,
  currentMonthNum,
  currentWeekNum,
}: DashboardHeroProps) {
  return (
    <div 
      className="rounded-[28px] p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden" 
      style={{ 
        background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)', 
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)'
      }}
    >
      {/* iOS Ambient Glow Overlays */}
      <div style={{ position: 'absolute', top: '-50px', right: '-20px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Futuristic Network Mesh SVG Background */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-[0.28] z-0"
        viewBox="0 0 800 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gradient-wave-hero" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient-glow-hero" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <path
          d="M 50,220 C 200,180 250,50 450,110 C 650,170 700,240 850,80"
          stroke="url(#gradient-wave-hero)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 20,150 C 150,70 280,200 480,130 C 680,60 720,180 880,40"
          stroke="url(#gradient-wave-hero)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 80,250 C 220,160 180,80 400,60 C 620,40 550,220 750,170"
          stroke="url(#gradient-wave-hero)"
          strokeWidth="1"
          fill="none"
          opacity="0.35"
        />
        
        {/* Connection node markers */}
        <circle cx="450" cy="110" r="5" fill="#818cf8" />
        <circle cx="270" cy="90" r="3" fill="#a78bfa" />
        <circle cx="650" cy="170" r="4.5" fill="#f472b6" />
        <circle cx="200" cy="180" r="3.5" fill="#818cf8" />
        <circle cx="480" cy="130" r="4" fill="#a78bfa" />
        
        {/* Network connections */}
        <line x1="270" y1="90" x2="450" y2="110" stroke="#818cf8" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        <line x1="450" y1="110" x2="480" y2="130" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
        <line x1="480" y1="130" x2="650" y2="170" stroke="#f472b6" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
      </svg>

      <div className="space-y-3.5 max-w-xl z-10">
        <div className="flex">
          <span 
            className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm"
          >
            Curriculum Roadmap Cohort
          </span>
        </div>
        <h1 className="text-2.5xl md:text-3.5xl font-black tracking-tight text-white leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Welcome back, {displayName}!
        </h1>
        <p className="text-[0.92rem] leading-relaxed text-zinc-400 font-medium">
          Your personal curriculum progress is at <span className="text-white font-bold">{globalCompletionPercentage}%</span>. Keep up the velocity to complete your target milestones and access leaderboard highlights.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 z-10 flex-shrink-0">
        <Link href={`/roadmap/${currentMonthNum}/${currentWeekNum}`}>
          <button 
            className="px-6 py-3 font-bold text-xs rounded-full bg-white text-zinc-950 hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 cursor-pointer border-0 shadow-lg shadow-white/5 whitespace-nowrap"
          >
            Resume Learning
          </button>
        </Link>
        <Link href="/roadmap">
          <button 
            className="px-6 py-3 font-bold text-xs rounded-full bg-zinc-800/60 hover:bg-zinc-800 backdrop-blur-md text-white border border-zinc-700/50 hover:border-zinc-600 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Full Curriculum
          </button>
        </Link>
      </div>
    </div>
  );
}
