import React from 'react';
import { GroupProgressMetric } from '@/features/progress/progress.types';

interface ProgressionChartProps {
  metrics: GroupProgressMetric[];
  cohortAvg: number;
}

export function CohortProgressionChart({ metrics, cohortAvg }: ProgressionChartProps) {
  // Capsule bar chart settings (iOS Screen Time Style)
  const chartWidth = 500;
  const chartHeight = 160;
  const xPadding = 40;
  const yPadding = 20;
  const gridHeight = chartHeight - yPadding * 2;
  const gridWidth = chartWidth - xPadding - 10;
  const barCount = metrics.length || 1;
  const spacing = gridWidth / barCount;

  // Extract cohort user profiles list from the first metric data row
  const userList = metrics[0]?.userRates || [];
  
  // Custom smoothly-merged gradients definition helper
  const userGradients = [
    { start: '#ff2d55', end: '#ff9500' }, // Pink-Orange
    { start: '#5ac8fa', end: '#0072ff' }, // SkyBlue-RoyalBlue
    { start: '#af52de', end: '#5856d6' }, // Purple-Indigo
    { start: '#34d399', end: '#059669' }, // Emerald-Teal
    { start: '#ff9500', end: '#ffcc00' }, // Orange-Gold
    { start: '#00c6ff', end: '#00a896' }, // Cyan-Teal
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Weekly Cohort Averages Spline Chart (Left, 2/3 width) */}
      <div className="lg:col-span-2 p-6 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] rounded-[24px] flex flex-col justify-between">
        <div className="pb-3 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Weekly Progression
            </h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1">
              Curriculum progression compared side-by-side across cohort members.
            </p>
          </div>
          
          {/* Dynamic Users Gradient Legend */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] font-black text-slate-400 tracking-wider">
            {userList.map((u, uIdx) => {
              const grad = userGradients[uIdx % userGradients.length];
              return (
                <span key={u.userId} className="flex items-center gap-1.5 uppercase">
                  <span 
                    className="w-2 h-2 rounded-full shadow-xs flex-shrink-0" 
                    style={{ background: `linear-gradient(135deg, ${grad.start} 0%, ${grad.end} 100%)` }} 
                  />
                  {u.userName}
                </span>
              );
            })}
          </div>
        </div>

        {metrics.length > 0 ? (
          <div className="relative pt-4 w-full h-[180px]">
            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible" preserveAspectRatio="none">
              <defs>
                {/* Dynamically define gradients for each user index */}
                {userGradients.map((g, gIdx) => (
                  <linearGradient key={gIdx} id={`userGrad-${gIdx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={g.start} />
                    <stop offset="100%" stopColor={g.end} />
                  </linearGradient>
                ))}
              </defs>

              {/* Y Axis Grid Lines */}
              {[0, 25, 50, 75, 100].map((percentVal, gIdx) => {
                const yVal = chartHeight - yPadding - (percentVal / 100) * gridHeight;
                return (
                  <g key={gIdx}>
                    <line 
                      x1={xPadding} 
                      y1={yVal} 
                      x2={chartWidth} 
                      y2={yVal} 
                      stroke="#f8fafc" 
                      strokeWidth="1.2" 
                      strokeDasharray="4 4" 
                    />
                    <text 
                      x={xPadding - 10} 
                      y={yVal + 3} 
                      fill="#94a3b8" 
                      fontSize="8" 
                      fontWeight="800" 
                      textAnchor="end"
                    >
                      {percentVal}%
                    </text>
                  </g>
                );
              })}

              {/* Weekly Groups of Side-by-Side Bars */}
              {metrics.map((m, idx) => {
                const weekUserRates = m.userRates || [];
                const currentNumUsers = weekUserRates.length || 1;
                
                // Calculate size parameters dynamically to fit inside week columns
                const userBarWidth = Math.max(4, Math.min(10, (spacing * 0.55) / currentNumUsers));
                const gap = 2;
                const totalWidthOfGroup = currentNumUsers * userBarWidth + (currentNumUsers - 1) * gap;
                const groupStartX = xPadding + idx * spacing + (spacing - totalWidthOfGroup) / 2;

                return (
                  <g key={idx}>
                    {weekUserRates.map((ur, uIdx) => {
                      const x = groupStartX + uIdx * (userBarWidth + gap);
                      const barHeight = (ur.completionRate / 100) * gridHeight;
                      const y = chartHeight - yPadding - barHeight;

                      return (
                        <g key={ur.userId} className="group cursor-pointer">
                          {/* Background Track */}
                          <rect
                            x={x}
                            y={yPadding}
                            width={userBarWidth}
                            height={gridHeight}
                            rx={userBarWidth / 2}
                            fill="#f8fafc"
                            className="transition-colors group-hover:fill-slate-100/80"
                          />

                          {/* Progression Bar Fill */}
                          {barHeight > 0 && (
                            <rect
                              x={x}
                              y={y}
                              width={userBarWidth}
                              height={barHeight}
                              rx={userBarWidth / 2}
                              fill={`url(#userGrad-${uIdx % userGradients.length})`}
                              className="transition-all duration-300 group-hover:opacity-90"
                            />
                          )}

                          {/* Interactive Hover Tooltip */}
                          <g className="opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
                            <rect 
                              x={x - 36} 
                              y={Math.min(y - 28, chartHeight - yPadding - 40)} 
                              width="72" 
                              height="20" 
                              rx="7" 
                              fill="#1e293b" 
                            />
                            <text 
                              x={x} 
                              y={Math.min(y - 15, chartHeight - yPadding - 27)} 
                              fill="#ffffff" 
                              fontSize="7.5" 
                              fontWeight="900" 
                              textAnchor="middle"
                            >
                              {ur.userName}: {ur.completionRate}%
                            </text>
                          </g>
                        </g>
                      );
                    })}

                    {/* X axis labels (W1, W2, etc.) */}
                    {(idx === 0 || idx === barCount - 1 || idx % 4 === 0) && (
                      <text 
                        x={groupStartX + totalWidthOfGroup / 2} 
                        y={chartHeight - 4} 
                        fill="#94a3b8" 
                        fontSize="8" 
                        fontWeight="800" 
                        textAnchor="middle"
                      >
                        W{idx + 1}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          <div className="text-center py-16 text-xs text-slate-400 font-semibold border border-dashed rounded-2xl mt-4">
            No metrics compiled yet.
          </div>
        )}
      </div>

      {/* Circular Syllabus Completion Ring (Right, 1/3 width) */}
      <div className="col-span-1 p-6 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] rounded-[24px] flex flex-col justify-between items-center text-center">
        <div className="self-start text-left pb-3 border-b border-slate-50 w-full">
          <h3 className="text-sm font-black text-slate-800 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Syllabus Completion
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1">
            Overall learning progress index averaged across the entire cohort.
          </p>
        </div>
        
        <div className="relative flex items-center justify-center py-4">
          <svg className="w-32 h-32 transform -rotate-90" style={{ filter: 'drop-shadow(0 4px 16px rgba(79, 70, 229, 0.04))' }}>
            <defs>
              <linearGradient id="syllabusRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle
              cx="64"
              cy="64"
              r="52"
              stroke="#f8fafc"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="52"
              stroke="url(#syllabusRingGrad)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={(2 * Math.PI * 52) - (cohortAvg / 100) * (2 * Math.PI * 52)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>{cohortAvg}%</span>
            <span className="text-[8px] uppercase font-black tracking-widest mt-1.5 text-indigo-650">syllabus</span>
          </div>
        </div>

        <p className="text-[10px] font-bold text-slate-400 px-2 leading-relaxed mt-1">
          Aggregates check milestones finished against absolute syllabus milestones.
        </p>
      </div>
    </div>
  );
}
