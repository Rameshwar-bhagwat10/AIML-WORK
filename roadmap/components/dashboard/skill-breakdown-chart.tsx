'use client';

import React from 'react';

interface SkillBreakdownChartProps {
  pythonPercent: number;
  mathPercent: number;
  mlPercent: number;
  nnPercent: number;
  pythonTitle?: string;
  mathTitle?: string;
  mlTitle?: string;
  nnTitle?: string;
}

export function SkillBreakdownChart({
  pythonPercent,
  mathPercent,
  mlPercent,
  nnPercent,
  pythonTitle = 'Python Foundations',
  mathTitle = 'Math & Statistics',
  mlTitle = 'ML Algorithms',
  nnTitle = 'Neural Networks',
}: SkillBreakdownChartProps) {
  // Balanced concentric radii and circumferences (perfect fit inside a 200x200 SVG viewport)
  const r1 = 80;
  const c1 = 2 * Math.PI * r1;
  const offset1 = c1 * (1 - pythonPercent / 100);

  const r2 = 64;
  const c2 = 2 * Math.PI * r2;
  const offset2 = c2 * (1 - mathPercent / 100);

  const r3 = 48;
  const c3 = 2 * Math.PI * r3;
  const offset3 = c3 * (1 - mlPercent / 100);

  const r4 = 32;
  const c4 = 2 * Math.PI * r4;
  const offset4 = c4 * (1 - nnPercent / 100);

  // Overall average percentage
  const averagePercent = Math.round((pythonPercent + mathPercent + mlPercent + nnPercent) / 4);

  return (
    <div
      className="bg-gradient-to-br from-rose-50/40 via-white to-indigo-50/40 border border-slate-200/40 rounded-[32px] p-6 shadow-[0_16px_36px_rgba(148,163,184,0.06)] hover:shadow-[0_24px_48px_rgba(148,163,184,0.12)] transition-all duration-500 h-[380px] flex flex-col justify-between relative overflow-hidden"
    >
      {/* Animated Keyframes CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes draw-ring-1 {
          from { stroke-dashoffset: ${c1}; }
          to { stroke-dashoffset: ${offset1}; }
        }
        @keyframes draw-ring-2 {
          from { stroke-dashoffset: ${c2}; }
          to { stroke-dashoffset: ${offset2}; }
        }
        @keyframes draw-ring-3 {
          from { stroke-dashoffset: ${c3}; }
          to { stroke-dashoffset: ${offset3}; }
        }
        @keyframes draw-ring-4 {
          from { stroke-dashoffset: ${c4}; }
          to { stroke-dashoffset: ${offset4}; }
        }
        .animate-ring-1 {
          animation: draw-ring-1 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-ring-2 {
          animation: draw-ring-2 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-ring-3 {
          animation: draw-ring-3 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-ring-4 {
          animation: draw-ring-4 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="bg-indigo-50 border border-indigo-100/60 text-indigo-600 rounded-[12px] p-1.5 flex items-center justify-center shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
        </div>
        <div>
          <h3 className="text-[1.05rem] font-bold text-slate-900 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Skill Breakdown
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-semibold leading-relaxed">Core engineering focus areas distribution</p>
        </div>
      </div>

      {/* Concentric Donut Rings */}
      <div className="flex justify-center items-center py-2 relative">
        <div className="relative" style={{ width: '160px', height: '160px' }}>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <defs>
              {/* Vibrant iOS Style gradients */}
              <linearGradient id="pythonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff2d55" />
                <stop offset="100%" stopColor="#ff9500" />
              </linearGradient>
              <linearGradient id="mathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5ac8fa" />
                <stop offset="100%" stopColor="#0072ff" />
              </linearGradient>
              <linearGradient id="mlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff9500" />
                <stop offset="100%" stopColor="#ffcc00" />
              </linearGradient>
              <linearGradient id="nnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#af52de" />
                <stop offset="100%" stopColor="#5856d6" />
              </linearGradient>

              {/* Soft glow filter optimized for light backgrounds */}
              <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComponentTransfer in="blur" result="boost">
                  <feFuncA type="linear" slope="0.18" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="boost" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Tracks - Soft light gray-blue style */}
            <circle cx="100" cy="100" r={r1} fill="none" stroke="rgba(255, 45, 85, 0.06)" strokeWidth="10.5" />
            <circle cx="100" cy="100" r={r2} fill="none" stroke="rgba(90, 200, 250, 0.07)" strokeWidth="10.5" />
            <circle cx="100" cy="100" r={r3} fill="none" stroke="rgba(255, 149, 0, 0.06)" strokeWidth="10.5" />
            <circle cx="100" cy="100" r={r4} fill="none" stroke="rgba(175, 82, 222, 0.06)" strokeWidth="10.5" />

            {/* Active Rings with Glow Filter */}
            <circle
              cx="100"
              cy="100"
              r={r1}
              fill="none"
              stroke="url(#pythonGrad)"
              strokeWidth="10.5"
              strokeDasharray={c1}
              strokeLinecap="round"
              filter="url(#glow-filter)"
              className="animate-ring-1"
            />
            <circle
              cx="100"
              cy="100"
              r={r2}
              fill="none"
              stroke="url(#mathGrad)"
              strokeWidth="10.5"
              strokeDasharray={c2}
              strokeLinecap="round"
              filter="url(#glow-filter)"
              className="animate-ring-2"
            />
            <circle
              cx="100"
              cy="100"
              r={r3}
              fill="none"
              stroke="url(#mlGrad)"
              strokeWidth="10.5"
              strokeDasharray={c3}
              strokeLinecap="round"
              filter="url(#glow-filter)"
              className="animate-ring-3"
            />
            <circle
              cx="100"
              cy="100"
              r={r4}
              fill="none"
              stroke="url(#nnGrad)"
              strokeWidth="10.5"
              strokeDasharray={c4}
              strokeLinecap="round"
              filter="url(#glow-filter)"
              className="animate-ring-4"
            />
          </svg>

          {/* Centered overall percentage text */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.1 }}>
            <span className="text-[1.5rem] font-light tracking-tight text-slate-900 flex items-baseline" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {averagePercent}<span className="text-[0.8rem] font-medium text-slate-400 ml-0.5">%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Legends list - 2x2 grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 border-t border-slate-100">
        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">FOUNDATIONS</span>
          <div className="flex justify-between items-center text-[11px] font-semibold leading-none">
            <span className="flex items-center gap-1.5 text-slate-600 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-[#ff2d55] to-[#ff9500] shadow-sm" />
              <span className="truncate font-bold text-slate-700" title={pythonTitle}>{pythonTitle}</span>
            </span>
            <span className="font-extrabold text-slate-900 ml-1.5 flex-shrink-0">{pythonPercent}%</span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">MATHEMATICS</span>
          <div className="flex justify-between items-center text-[11px] font-semibold leading-none">
            <span className="flex items-center gap-1.5 text-slate-600 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-[#5ac8fa] to-[#0072ff] shadow-sm" />
              <span className="truncate font-bold text-slate-700" title={mathTitle}>{mathTitle}</span>
            </span>
            <span className="font-extrabold text-slate-900 ml-1.5 flex-shrink-0">{mathPercent}%</span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">ALGORITHMS</span>
          <div className="flex justify-between items-center text-[11px] font-semibold leading-none">
            <span className="flex items-center gap-1.5 text-slate-600 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-[#ff9500] to-[#ffcc00] shadow-sm" />
              <span className="truncate font-bold text-slate-700" title={mlTitle}>{mlTitle}</span>
            </span>
            <span className="font-extrabold text-slate-900 ml-1.5 flex-shrink-0">{mlPercent}%</span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">DEEP LEARNING</span>
          <div className="flex justify-between items-center text-[11px] font-semibold leading-none">
            <span className="flex items-center gap-1.5 text-slate-600 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gradient-to-br from-[#af52de] to-[#5856d6] shadow-sm" />
              <span className="truncate font-bold text-slate-700" title={nnTitle}>{nnTitle}</span>
            </span>
            <span className="font-extrabold text-slate-900 ml-1.5 flex-shrink-0">{nnPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
