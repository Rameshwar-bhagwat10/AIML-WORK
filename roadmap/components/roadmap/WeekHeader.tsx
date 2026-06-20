import React from 'react';

interface WeekHeaderProps {
  month: number;
  week: number;
  topics: string[];
  tools: string[];
  project: string;
  tip: string;
}


export function WeekHeader({
  month,
  week,
  topics,
  tools,
  project,
  tip,
}: WeekHeaderProps) {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-white p-6 md:p-8 space-y-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300">
      {/* Week Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-50">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase block">
            Month {month} Curriculum
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Week {week} Overview
          </h1>
        </div>
        <div className="self-start sm:self-center">
          <span className="text-[10px] font-extrabold bg-indigo-50 border border-indigo-100/40 text-indigo-650 px-3.5 py-1.5 rounded-lg uppercase tracking-wider select-none flex items-center gap-1.5 shadow-sm">
            <span>📖</span> Focus Curriculum
          </span>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Topics & Tools (lg:col-span-7) */}
        <div className="space-y-8 lg:col-span-7">
          {/* Topics */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest flex items-center gap-2">
              <span className="text-indigo-600">⚡</span> Topics Covered
            </h3>
            {topics.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topics.map((topic, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-xs font-bold text-slate-700 bg-slate-50/50 border border-slate-100/60 p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.005)]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="truncate">{topic}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs italic text-slate-400">No topics specified for this week.</p>
            )}
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest flex items-center gap-2">
              <span className="text-indigo-600">🛠️</span> Tools & Environment
            </h3>
            {tools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tools.map((tool, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-extrabold px-3 py-1.5 bg-slate-50 border border-slate-200/50 text-slate-600 rounded-lg tracking-wider transition-all hover:bg-slate-100/60 shadow-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-slate-400">No tools specified.</p>
            )}
          </div>
        </div>

        {/* Right Side: Project & Tip (lg:col-span-5) */}
        <div className="space-y-6 lg:col-span-5 lg:border-l lg:border-slate-50 lg:pl-8">
          {/* Project */}
          <div className="rounded-[20px] p-6 bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/20 border border-indigo-100/40 shadow-[0_4px_16px_rgba(99,102,241,0.02)] space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
              <span>🏆</span> Weekly Project Objective
            </h3>
            <p className="text-xs font-semibold leading-relaxed text-slate-700">
              {project || "No project specified for this week."}
            </p>
          </div>

          {/* Pro Tip */}
          <div className="rounded-[20px] p-6 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20 border border-emerald-100/40 shadow-[0_4px_16px_rgba(16,185,129,0.02)] space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
              <span>💡</span> Pro Tip
            </h3>
            <p className="text-xs font-bold leading-relaxed text-slate-700 italic">
              &ldquo;{tip || "Keep practicing and coding daily!"}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
