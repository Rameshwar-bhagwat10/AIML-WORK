import React from 'react';

interface DashboardMetricCardsProps {
  globalCompletionPercentage: number;
  globalCompleted: number;
  globalTotal: number;
  currentMonthNum: number;
  currentWeekNum: number;
  currentWeekTitle: string;
  completionPercentage: number;
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
  activeDaysCount: number;
}

export function DashboardMetricCards({
  globalCompletionPercentage,
  globalCompleted,
  globalTotal,
  currentMonthNum,
  currentWeekNum,
  currentWeekTitle,
  completionPercentage,
  completedTasks,
  totalTasks,
  currentStreak,
  activeDaysCount,
}: DashboardMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1 - Overall Completion */}
      <div 
        className="bg-indigo-100/50 backdrop-blur-md border border-indigo-200/50 rounded-[24px] p-5 shadow-[0_8px_24px_rgba(79,70,229,0.08)] hover:shadow-[0_16px_32px_rgba(79,70,229,0.14)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Overall Progress</span>
            <div className="bg-indigo-100/80 border border-indigo-200/40 text-indigo-600 rounded-[14px] p-2 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-black mt-2 mb-1 text-indigo-950" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {globalCompletionPercentage}%
          </h3>
          <p className="text-[0.78rem] text-indigo-650 font-bold">{globalCompleted} of {globalTotal} tasks completed</p>
        </div>
        <div className="w-full h-2 bg-indigo-100/80 rounded-full mt-5 overflow-hidden relative z-10">
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${globalCompletionPercentage}%` }} />
        </div>
        {/* Subtle Progress Waves SVG in Background */}
        <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden opacity-[0.08] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 35 Q15 25, 30 30 T60 15 T90 20 L100 10 L100 40 L0 40 Z" fill="url(#dashOverallProgressGrad)" />
            <defs>
              <linearGradient id="dashOverallProgressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Card 2 - Active Target */}
      <div 
        className="bg-amber-100/50 backdrop-blur-md border border-amber-200/50 rounded-[24px] p-5 shadow-[0_8px_24px_rgba(245,158,11,0.08)] hover:shadow-[0_16px_32px_rgba(245,158,11,0.14)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Active Module</span>
            <div className="bg-amber-100/80 border border-amber-200/40 text-amber-600 rounded-[14px] p-2 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
          </div>
          <h3 className="text-2.5xl font-black mt-2 mb-1.5 text-amber-950 truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Month {currentMonthNum} W{currentWeekNum}
          </h3>
          <p className="text-[0.78rem] text-amber-650 truncate font-bold" title={currentWeekTitle}>{currentWeekTitle}</p>
        </div>
        <div className="mt-4 flex gap-1.5 relative z-10">
          <span className="text-[9px] bg-amber-500/20 border border-amber-500/35 text-amber-700 px-2.5 py-0.5 rounded-full font-extrabold tracking-wide">ACTIVE</span>
          <span className="text-[9px] bg-amber-600/10 border border-amber-600/20 text-amber-800 px-2.5 py-0.5 rounded-full font-extrabold tracking-wide">CORE</span>
        </div>
        {/* Subtle Concentric Rings SVG in Background */}
        <div className="absolute bottom-[-20px] right-[-20px] w-24 h-24 opacity-[0.06] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#d97706" strokeWidth="2.5" strokeDasharray="4,4" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#d97706" strokeWidth="4" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="#d97706" strokeWidth="5" />
          </svg>
        </div>
      </div>

      {/* Card 3 - Week Focus */}
      <div 
        className="bg-cyan-100/50 backdrop-blur-md border border-cyan-200/50 rounded-[24px] p-5 shadow-[0_8px_24px_rgba(6,182,212,0.08)] hover:shadow-[0_16px_32px_rgba(6,182,212,0.14)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600">Weekly Progress</span>
            <div className="bg-cyan-100/80 border border-cyan-200/40 text-cyan-600 rounded-[14px] p-2 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M3 20v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8M11 20v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-black mt-2 mb-1 text-cyan-950" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {completionPercentage}%
          </h3>
          <p className="text-[0.78rem] text-cyan-650 font-bold">{completedTasks} of {totalTasks} tasks done</p>
        </div>
        <div className="w-full h-2 bg-cyan-100/80 rounded-full mt-5 overflow-hidden relative z-10">
          <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
        </div>
        {/* Subtle Weekly Bars SVG in Background */}
        <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden opacity-[0.06] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M5 30 L 15 30 L 15 40 L 5 40 Z M20 20 L 30 20 L 30 40 L 20 40 Z M35 25 L 45 25 L 45 40 L 35 40 Z M50 15 L 60 15 L 60 40 L 50 40 Z M65 10 L 75 10 L 75 40 L 65 40 Z M80 5 L 90 5 L 90 40 L 80 40 Z" fill="url(#dashWeeklyBarsGrad)" />
            <defs>
              <linearGradient id="dashWeeklyBarsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Card 4 - Study Streak */}
      <div 
        className="bg-emerald-100/50 backdrop-blur-md border border-emerald-200/50 rounded-[24px] p-5 shadow-[0_8px_24px_rgba(16,185,129,0.08)] hover:shadow-[0_16px_32px_rgba(16,185,129,0.14)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Study Streak</span>
            <div className="bg-emerald-100/80 border border-emerald-200/40 text-emerald-600 rounded-[14px] p-2 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-black mt-2 mb-1 text-emerald-950" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {currentStreak === 0 ? "0 Days" : `${currentStreak} Day${currentStreak === 1 ? '' : 's'}`}
          </h3>
          <p className="text-[0.78rem] text-emerald-650 font-bold text-ellipsis overflow-hidden whitespace-nowrap">
            {activeDaysCount === 0 ? "Start your first task" : `${activeDaysCount} total study days`}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-1.5 relative z-10">
          <span className={`w-2 h-2 rounded-full ${currentStreak > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-600/30'}`} />
          <span className={`text-[9px] font-extrabold tracking-wide ${currentStreak > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
            {currentStreak > 0 ? 'STREAK ACTIVE' : 'NO ACTIVE STREAK'}
          </span>
        </div>
        {/* Subtle Flame/Streak Glow SVG in Background */}
        <div className="absolute bottom-[-10px] right-[-10px] w-20 h-24 opacity-[0.08] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 120">
            <path d="M50 100 C20 80 30 40 50 20 C70 40 80 80 50 100 Z" fill="url(#dashStreakFlameGrad)" />
            <path d="M50 90 C35 75 40 50 50 35 C60 50 65 75 50 90 Z" fill="#ffffff" opacity="0.3" />
            <defs>
              <linearGradient id="dashStreakFlameGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
