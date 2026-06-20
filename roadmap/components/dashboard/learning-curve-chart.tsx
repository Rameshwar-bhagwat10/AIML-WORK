"use client";

import React from 'react';
import Link from 'next/link';

interface LearningCurveChartProps {
  globalCompletionPercentage: number;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
}

export function LearningCurveChart({
  globalCompletionPercentage,
  p1,
  p2,
  p3,
  p4,
}: LearningCurveChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // Convert percentages (0 to 100) into SVG Y coordinates (180 baseline to 30 top, range = 150)
  const yRange = 150;
  const y1 = 180 - (p1 / 100) * yRange;
  const y2 = 180 - (p2 / 100) * yRange;
  const y3 = 180 - (p3 / 100) * yRange;
  const y4 = 180 - (p4 / 100) * yRange;
  const yNow = 180 - (globalCompletionPercentage / 100) * yRange;

  const points = [
    { label: 'Month 1', percent: p1, x: 60, y: y1 },
    { label: 'Month 2', percent: p2, x: 200, y: y2 },
    { label: 'Month 3', percent: p3, x: 340, y: y3 },
    { label: 'Month 4', percent: p4, x: 480, y: y4 },
    { label: 'Now', percent: globalCompletionPercentage, x: 620, y: yNow },
  ];

  const activeIdx = hoveredIndex !== null ? hoveredIndex : 4; // Defaults to "Now" if not hovered, matching design request

  return (
    <div
      className="bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-[28px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 h-[380px] flex flex-col justify-between"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="bg-rose-50 border border-rose-100/50 text-rose-500 rounded-[12px] p-1.5 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <div>
            <h3 className="text-[1.1rem] font-bold text-slate-900 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Learning Velocity Curve
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Real-time study accomplishments plotted across milestones</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 tracking-wider">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#ff2d55] to-[#ff9500] shadow-xs" /> STUDY PROGRESS</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 shadow-xs" /> TARGET SLOPE</span>
        </div>
      </div>

      {/* SVG Rendered Spline Curve Chart */}
      <div className="w-full relative overflow-visible mt-2" style={{ height: '220px' }}>
        <svg className="w-full h-full" viewBox="0 0 680 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff2d55" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ff9500" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="chart-stroke-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff2d55" />
              <stop offset="100%" stopColor="#ff9500" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines matching standard percentages */}
          <line x1="50" y1="30" x2="630" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="67.5" x2="630" y2="67.5" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="105" x2="630" y2="105" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="142.5" x2="630" y2="142.5" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="180" x2="630" y2="180" stroke="#f1f5f9" strokeWidth="1.5" />

          {/* Y Axis Labels */}
          <text x="25" y="34" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">100%</text>
          <text x="25" y="71.5" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">75%</text>
          <text x="25" y="109" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">50%</text>
          <text x="25" y="146.5" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">25%</text>
          <text x="25" y="184" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">0%</text>

          {/* Gradient area underneath spline curve */}
          <path
            d={`M 60 ${y1} 
                C ${60 + 70} ${y1}, ${200 - 70} ${y2}, 200 ${y2} 
                C ${200 + 70} ${y2}, ${340 - 70} ${y3}, 340 ${y3} 
                C ${340 + 70} ${y3}, ${480 - 70} ${y4}, 480 ${y4} 
                C ${480 + 70} ${y4}, ${620 - 70} ${yNow}, 620 ${yNow} 
                L 620 180 L 60 180 Z`}
            fill="url(#chart-area-grad)"
          />

          {/* Main Spline Curve Line */}
          <path
            d={`M 60 ${y1} 
                C ${60 + 70} ${y1}, ${200 - 70} ${y2}, 200 ${y2} 
                C ${200 + 70} ${y2}, ${340 - 70} ${y3}, 340 ${y3} 
                C ${340 + 70} ${y3}, ${480 - 70} ${y4}, 480 ${y4} 
                C ${480 + 70} ${y4}, ${620 - 70} ${yNow}, 620 ${yNow}`}
            fill="none"
            stroke="url(#chart-stroke-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Static Data Points */}
          {points.map((pt, idx) => (
            <g key={idx}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke={idx === activeIdx ? '#ff2d55' : '#ffa3b1'} strokeWidth="3" />
            </g>
          ))}

          {/* Active Highlight Overlay (Guide dashed line, pulse ring and tooltip) */}
          <g>
            {/* Draw vertical guidance dashed line */}
            <line
              x1={points[activeIdx].x}
              y1="30"
              x2={points[activeIdx].x}
              y2="180"
              stroke="#ff9500"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            {/* Pulsing glow ring */}
            <circle cx={points[activeIdx].x} cy={points[activeIdx].y} r="11" fill="#ff2d55" opacity="0.25" className="animate-ping" style={{ transformOrigin: `${points[activeIdx].x}px ${points[activeIdx].y}px` }} />
            <circle cx={points[activeIdx].x} cy={points[activeIdx].y} r="7" fill="#ff2d55" stroke="#ffffff" strokeWidth="2.5" />

            {/* Tooltip Capsule (Directly above the point) */}
            <g>
              <rect
                x={points[activeIdx].x - 26}
                y={points[activeIdx].y - 32}
                width="52"
                height="20"
                rx="10"
                fill="#09090b"
              />
              <text
                x={points[activeIdx].x}
                y={points[activeIdx].y - 18}
                fill="#ffffff"
                fontSize="9"
                fontWeight="900"
                textAnchor="middle"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {points[activeIdx].percent}%
              </text>
            </g>
          </g>

          {/* Invisible interactive column blocks for easy mouse hovers */}
          {points.map((pt, idx) => (
            <rect
              key={idx}
              x={pt.x - 30}
              y="30"
              width="60"
              height="150"
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}

          {/* Text dates */}
          <text x="60" y="208" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">Month 1</text>
          <text x="200" y="208" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">Month 2</text>
          <text x="340" y="208" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">Month 3</text>
          <text x="480" y="208" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">Month 4</text>
          <text x="620" y="208" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">Now</text>
        </svg>
      </div>
    </div>
  );
}

interface ActiveFocusMilestoneProps {
  currentMonthNum: number;
  currentWeekNum: number;
  currentWeekTitle: string;
  currentWeekProject: string;
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
}

export function ActiveFocusMilestone({
  currentMonthNum,
  currentWeekNum,
  currentWeekTitle,
  currentWeekProject,
  completedTasks,
  totalTasks,
  completionPercentage,
}: ActiveFocusMilestoneProps) {
  return (
    <div
      className="bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-[28px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 space-y-5"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-50 border border-indigo-100/50 text-indigo-600 rounded-[12px] p-1.5 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 8 8 12 12 16 16 12 12 8" />
            </svg>
          </div>
          <h3 className="text-[1.1rem] font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Active Focus Milestone
          </h3>
        </div>
        <span
          className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-600"
        >
          Month {currentMonthNum} • Week {currentWeekNum}
        </span>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-black text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {currentWeekTitle}
        </h4>

        {currentWeekProject ? (
          <div className="rounded-[20px] p-4 bg-slate-50/70 border border-slate-100 relative overflow-hidden">
            <div style={{ position: 'absolute', right: '12px', top: '12px', opacity: 0.08, color: '#4f46e5' }}>
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider block mb-1.5 text-slate-400">
              Syllabus Project Objective
            </span>
            <p className="text-[0.88rem] leading-relaxed font-semibold text-slate-600 pr-12">
              {currentWeekProject}
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No specific syllabus project objectives documented for this milestone week.</p>
        )}

        {/* Week Checklist Snapshot */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Weekly Objective Progress</span>
            <span className="text-indigo-600 font-black">{completedTasks}/{totalTasks} Tasks ({completionPercentage}%)</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-indigo-600"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-slate-100">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Status: In Progress</span>
        <Link href={`/roadmap/${currentMonthNum}/${currentWeekNum}`}>
          <button
            className="px-5 py-2.5 text-xs font-bold rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 border-0"
          >
            Start Weekly Checklists →
          </button>
        </Link>
      </div>
    </div>
  );
}
