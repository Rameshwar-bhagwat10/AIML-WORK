'use client';

import React from 'react';
import Link from 'next/link';

interface RoadmapMetricCardsProps {
  completionPercent: number;
  activeWeekTitle: string;
  resumeUrl: string;
  resumeLabel: string;
  totalTasks: number;
  completedPct: number;
  onReviewPct: number;
  onProgressPct: number;
  notStartedPct: number;
  notStartedCount: number;
  onProgressCount: number;
  onReviewCount: number;
  completedCount: number;
  attendants: { initials: string; grad: string }[];
  remainingMembers: number;
  percentChangeText: string;
  activeDayHours: number;
  activeDayName: string;
  dayHours: number[];
  dayNames: string[];
}

export function RoadmapMetricCards({
  completionPercent,
  activeWeekTitle,
  resumeUrl,
  resumeLabel,
  totalTasks,
  completedPct,
  onReviewPct,
  onProgressPct,
  notStartedPct,
  notStartedCount,
  onProgressCount,
  onReviewCount,
  completedCount,
  attendants,
  remainingMembers,
  percentChangeText,
  activeDayHours,
  activeDayName,
  dayHours,
  dayNames,
}: RoadmapMetricCardsProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // SVG Spline parameters
  const chartWidth = 460;
  const chartHeight = 120;
  const xPadding = 30;
  const yPadding = 15;
  const gridHeight = chartHeight - yPadding * 2;
  const gridWidth = chartWidth - xPadding * 2;
  const maxVal = Math.max(...dayHours, 4.0); // minimum scale limit 4h

  const points = dayHours.map((h, i) => {
    const x = xPadding + (i * gridWidth) / 6;
    const y = yPadding + gridHeight - (h * gridHeight) / maxVal;
    return { x, y, val: h };
  });

  // Smooth Bezier path string
  let splinePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 2;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (p1.x - p0.x) / 2;
    const cpY2 = p1.y;
    splinePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  // Spline Fill path
  const fillPath = `${splinePath} L ${points[points.length - 1].x} ${chartHeight - yPadding} L ${points[0].x} ${chartHeight - yPadding} Z`;

  const currentDayIndex = 6;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card 1: Course Progress Circular Indicator */}
      <div className="p-6 rounded-[24px] bg-gradient-to-br from-indigo-50/40 via-white to-indigo-50/10 border border-indigo-100/50 shadow-[0_8px_30px_rgba(99,102,241,0.02)] flex flex-col justify-between h-[275px] relative overflow-hidden transition-all hover:shadow-[0_12px_40px_rgba(99,102,241,0.05)] hover:-translate-y-0.5 duration-300">
        {/* Subtle Course Progress Wave SVG in Card Background */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-[0.08] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 30 C 20 10, 40 40, 60 20 C 80 0, 90 25, 100 10 L 100 40 L 0 40 Z" fill="url(#courseProgressSparkGrad)" />
            <defs>
              <linearGradient id="courseProgressSparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-slate-50 relative z-10">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <span>📖</span> Course Progress
          </span>
          <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Cohort 1
          </span>
        </div>

        <div className="flex items-center gap-5 py-3 relative z-10">
          {/* Circular Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <defs>
                <linearGradient id="circleProgressGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              <path
                className="text-slate-100"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="transition-all duration-700"
                strokeWidth="3.2"
                strokeDasharray={`${completionPercent}, 100`}
                strokeLinecap="round"
                stroke="url(#circleProgressGrad)"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-base font-black text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {completionPercent}%
              </span>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-700 truncate leading-snug">DevRoadmap Master Track</h4>
            <div className="inline-block bg-indigo-50/50 border border-indigo-100/50 text-indigo-600 rounded-full px-2 py-0.5 mt-1 text-[9px] font-extrabold uppercase">
              Active Week
            </div>
            <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5 leading-snug">
              Target: <span className="text-indigo-600 font-bold">{activeWeekTitle}</span>
            </p>
          </div>
        </div>

        <Link href={resumeUrl} className="w-full mt-1 relative z-10">
          <button className="w-full py-2.5 font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-colors border-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm">
            {resumeLabel} {"→"}
          </button>
        </Link>
      </div>

      {/* Card 2: Current Total Segmented Progress */}
      <div className="p-6 rounded-[24px] bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/10 border border-emerald-100/50 shadow-[0_8px_30px_rgba(16,185,129,0.02)] flex flex-col justify-between h-[275px] relative overflow-hidden transition-all hover:shadow-[0_12px_40px_rgba(16,185,129,0.05)] hover:-translate-y-0.5 duration-300">
        {/* Subtle Task Allocation Bars SVG in Background */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-[0.06] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 25 L 10 25 L 10 40 L 0 40 Z M15 15 L 25 15 L 25 40 L 15 40 Z M30 30 L 40 30 L 40 40 L 30 40 Z M45 10 L 55 10 L 55 40 L 45 40 Z M60 20 L 70 20 L 70 40 L 60 40 Z M75 5 L 85 5 L 85 40 L 75 40 Z M90 18 L 100 18 L 100 40 L 90 40 Z" fill="url(#taskAllocationGrad)" />
            <defs>
              <linearGradient id="taskAllocationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-slate-50 relative z-10">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <span>📊</span> Task Allocation
          </span>
          <span className="text-[10px] font-extrabold text-slate-600 bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
            {totalTasks} Tasks
          </span>
        </div>

        <div className="py-2 space-y-3 relative z-10">
          {/* Segmented Progress Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden bg-slate-50 flex p-[1.5px] border border-slate-100/80">
            {completedPct > 0 && (
              <div
                className="h-full bg-emerald-400 rounded-l-full"
                style={{ width: `${completedPct}%`, transition: 'width 0.5s' }}
                title={`Completed: ${completedPct.toFixed(0)}%`}
              />
            )}
            {onReviewPct > 0 && (
              <div
                className="h-full bg-amber-400"
                style={{ width: `${onReviewPct}%`, transition: 'width 0.5s' }}
                title={`On Review: ${onReviewPct.toFixed(0)}%`}
              />
            )}
            {onProgressPct > 0 && (
              <div
                className="h-full bg-indigo-400"
                style={{ width: `${onProgressPct}%`, transition: 'width 0.5s' }}
                title={`On Progress: ${onProgressPct.toFixed(0)}%`}
              />
            )}
            {notStartedPct > 0 && (
              <div
                className="h-full bg-sky-200 rounded-r-full"
                style={{ width: `${notStartedPct}%`, transition: 'width 0.5s' }}
                title={`Not Started: ${notStartedPct.toFixed(0)}%`}
              />
            )}
          </div>

          {/* List Row Legend */}
          <div className="bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100/50 grid grid-cols-2 gap-x-3 gap-y-1.5">
            <div className="flex items-center justify-between text-[9px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-300" />
                Not started
              </span>
              <span className="font-extrabold text-slate-700">{notStartedCount}</span>
            </div>
            <div className="flex items-center justify-between text-[9px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                In Progress
              </span>
              <span className="font-extrabold text-slate-700">{onProgressCount}</span>
            </div>
            <div className="flex items-center justify-between text-[9px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                On Review
              </span>
              <span className="font-extrabold text-slate-700">{onReviewCount}</span>
            </div>
            <div className="flex items-center justify-between text-[9px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Completed
              </span>
              <span className="font-extrabold text-slate-700">{completedCount}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-50 pt-2.5 flex items-center justify-between relative z-10">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Attending track:</span>
          <div className="flex -space-x-1.5 overflow-hidden">
            {attendants.map((a, i) => (
              <div
                key={i}
                style={{ background: a.grad }}
                className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm"
              >
                {a.initials}
              </div>
            ))}
            {remainingMembers > 0 && (
              <div className="w-5 h-5 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[7px] font-bold text-slate-500 shadow-sm">
                +{remainingMembers}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card 3: Today Total Time Spline Chart */}
      <div className="p-6 rounded-[24px] bg-gradient-to-br from-violet-50/40 via-white to-violet-50/10 border border-violet-100/50 shadow-[0_8px_30px_rgba(139,92,246,0.02)] flex flex-col justify-between h-[275px] relative overflow-hidden transition-all hover:shadow-[0_12px_40px_rgba(139,92,246,0.05)] hover:-translate-y-0.5 duration-300">
        {/* Subtle Practice Velocity Wave SVG in Background */}
        <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden opacity-[0.08] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 35 Q10 10, 20 25 T40 10 T60 30 T80 15 T100 20 L100 40 L0 40 Z" fill="url(#velocitySparkGradRoadmap)" />
            <defs>
              <linearGradient id="velocitySparkGradRoadmap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="flex justify-between items-center pb-2.5 border-b border-slate-50 relative z-10">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <span>📈</span> Practice Velocity
          </span>
          <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100/40 px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
            {percentChangeText}
          </span>
        </div>

        <div className="space-y-0.5 py-1 relative z-10">
          <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Activity stats</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {activeDayHours.toFixed(1)} Hours
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">today ({activeDayName})</span>
          </div>
        </div>

        {/* SVG Line Graph */}
        <div className="relative h-24 w-full mt-1 z-10">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1={xPadding} y1={yPadding} x2={chartWidth - xPadding} y2={yPadding} stroke="#f8fafc" strokeWidth="1" strokeDasharray="3,3" />
            <line x1={xPadding} y1={yPadding + gridHeight / 2} x2={chartWidth - xPadding} y2={yPadding + gridHeight / 2} stroke="#f8fafc" strokeWidth="1" strokeDasharray="3,3" />
            <line x1={xPadding} y1={chartHeight - yPadding} x2={chartWidth - xPadding} y2={chartHeight - yPadding} stroke="#f1f5f9" strokeWidth="1" />

            {/* Gradient Area Fill */}
            <path d={fillPath} fill="url(#purpleGlow)" />

            {/* Dotted target marker for hovered / active day */}
            {hoveredIndex !== null && (
              <line
                x1={points[hoveredIndex].x}
                y1={points[hoveredIndex].y}
                x2={points[hoveredIndex].x}
                y2={chartHeight - yPadding}
                stroke="#818cf8"
                strokeWidth="1.5"
                strokeDasharray="2,2"
                opacity="0.6"
              />
            )}

            {/* Spline Path */}
            <path d={splinePath} fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" />

            {/* Circles and Values */}
            {points.map((p, idx) => {
              const activeIdx = hoveredIndex !== null ? hoveredIndex : 6;
              const isActive = idx === activeIdx;
              return (
                <g key={idx}>
                  {isActive && (
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="9" 
                      fill="#818cf8" 
                      opacity="0.25" 
                      className="animate-ping" 
                      style={{ transformOrigin: `${p.x}px ${p.y}px` }} 
                    />
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isActive ? 4.5 : 2.5}
                    fill={isActive ? '#ffffff' : '#6366f1'}
                    stroke="#6366f1"
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className="cursor-pointer transition-all duration-200"
                  />
                  {isActive && (
                    <g>
                      <rect
                        x={p.x - 42}
                        y={p.y - 28}
                        width="84"
                        height="18"
                        rx="9"
                        fill="#1e293b"
                      />
                      <text
                        x={p.x}
                        y={p.y - 16}
                        fill="#ffffff"
                        fontSize="8.5"
                        fontWeight="900"
                        textAnchor="middle"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {dayNames[idx].slice(0, 3)}: {p.val.toFixed(1)}h
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Invisible interactive hover rects */}
            {points.map((p, idx) => (
              <rect
                key={idx}
                x={p.x - 20}
                y={yPadding}
                width="40"
                height={gridHeight}
                fill="transparent"
                className="cursor-pointer"
                style={{ pointerEvents: 'auto' }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </svg>
        </div>

        {/* Weekday Axis */}
        <div className="flex justify-between px-6 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-1.5 pb-0.5 relative z-10">
          {dayNames.map((dName, idx) => (
            <span key={idx}>{dName}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
