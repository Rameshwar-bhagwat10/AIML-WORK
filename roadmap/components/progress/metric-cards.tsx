import React from 'react';
import Link from 'next/link';

interface LeaderboardMember {
  userId: string;
  userName: string;
  completionRate: number;
  completedMilestones: number;
  totalMilestones: number;
}

interface MetricCardsProps {
  cohortAvg: number;
  totalTasksCompleted: number;
  totalPossibleTasks: number;
  activeCohortCount: number;
  cohortSize: number;
  isAdmin: boolean;
  user?: any;
  ownCompletion?: {
    percentage: number;
    completedTasks: number;
    totalTasks: number;
  } | null;
  currentFocusModule?: {
    title: string;
    status?: string;
  } | null;
  myRank?: number | null;
  activeFocusLink?: string;
  topPerformer?: {
    userId: string;
    userName: string;
    completionRate: number;
    completedMilestones: number;
    totalMilestones: number;
  } | null;
  activeMembers?: LeaderboardMember[];
}

export function CohortMetricCards({
  cohortAvg,
  totalTasksCompleted,
  totalPossibleTasks,
  activeCohortCount,
  cohortSize,
  isAdmin,
  user,
  ownCompletion,
  currentFocusModule,
  myRank,
  activeFocusLink = '/roadmap',
  topPerformer,
  activeMembers = [],
}: MetricCardsProps) {
  // Deterministic avatar gradient
  const getAvatarGrad = (name: string) => {
    const charCodeSum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const grads = [
      'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
      'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    ];
    return grads[charCodeSum % grads.length];
  };

  const hasOwnCompletion = ownCompletion !== undefined && ownCompletion !== null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Card 1: Cohort Velocity */}
      <div className="bg-gradient-to-br from-indigo-50/40 via-white to-indigo-50/10 border border-indigo-100/50 shadow-[0_8px_30px_rgba(99,102,241,0.02)] rounded-[24px] p-6 flex flex-col justify-between h-[165px] hover:shadow-[0_12px_40px_rgba(99,102,241,0.06)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
        <div className="flex justify-between items-center pb-2.5 border-b border-indigo-100/20 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-650">Cohort Velocity</span>
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/40">Steady Phase</span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-2 relative z-10">
          <span className="text-3xl font-black text-indigo-950" style={{ fontFamily: "'Outfit', sans-serif" }}>{cohortAvg}%</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">average</span>
        </div>
        {/* Subtle Sparkline SVG in Card Background */}
        <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden opacity-30 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 35 Q15 25, 30 30 T60 15 T90 20 L100 10 L100 40 L0 40 Z" fill="url(#velocitySparkGrad)" />
            <defs>
              <linearGradient id="velocitySparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="text-[10px] font-bold text-slate-400 mt-2 relative z-10">Completion mean across cohort</span>
      </div>

      {/* Card 2: Completed Checkpoints */}
      <div className="bg-gradient-to-br from-violet-50/40 via-white to-violet-50/10 border border-violet-100/50 shadow-[0_8px_30px_rgba(139,92,246,0.02)] rounded-[24px] p-6 flex flex-col justify-between h-[165px] hover:shadow-[0_12px_40px_rgba(139,92,246,0.06)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
        <div className="flex justify-between items-center pb-2.5 border-b border-violet-100/20 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">Total Checkpoints</span>
          <span className="text-xs">🎯</span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-2 relative z-10">
          <span className="text-3xl font-black text-violet-950" style={{ fontFamily: "'Outfit', sans-serif" }}>{totalTasksCompleted}</span>
          <span className="text-[10px] font-bold text-slate-450 uppercase">/ {totalPossibleTasks} global</span>
        </div>
        <div className="w-full bg-slate-100/80 border border-slate-200/30 h-1.5 rounded-full overflow-hidden mt-1 relative z-10">
          <div 
            style={{ width: `${totalPossibleTasks > 0 ? (totalTasksCompleted / totalPossibleTasks) * 100 : 0}%` }} 
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500 shadow-sm"
          />
        </div>
        {/* Target Background SVG */}
        <div className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.12] pointer-events-none translate-x-4 translate-y-4">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3,3" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#8b5cf6" strokeWidth="3" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="#8b5cf6" strokeWidth="4" />
            <path d="M50 20 L50 80 M20 50 L80 50" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="2,2" />
          </svg>
        </div>
        <span className="text-[10px] font-bold text-slate-400 relative z-10">Global roadmap goals finished</span>
      </div>

      {/* Card 3: Active Trackers */}
      <div className="bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/10 border border-emerald-100/50 shadow-[0_8px_30px_rgba(16,185,129,0.02)] rounded-[24px] p-6 flex flex-col justify-between h-[165px] hover:shadow-[0_12px_40px_rgba(16,185,129,0.06)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
        <div className="flex justify-between items-center pb-2.5 border-b border-emerald-100/20 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-650">Active Trackers</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Live</span>
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-2 relative z-10">
          <span className="text-3xl font-black text-emerald-950" style={{ fontFamily: "'Outfit', sans-serif" }}>{activeCohortCount}</span>
          <span className="text-[10px] font-bold text-slate-450 uppercase">of {cohortSize} users</span>
        </div>
        <div className="flex -space-x-1.5 overflow-hidden py-0.5 mt-1 relative z-10">
          {activeMembers.slice(0, 5).map((member) => {
            const initials = member.userName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase();
            return (
              <div 
                key={member.userId}
                style={{ background: getAvatarGrad(member.userName) }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm border border-white sidebar-tooltip"
                data-tooltip={member.userName}
              >
                {initials}
              </div>
            );
          })}
          {activeCohortCount > 5 && (
            <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[9px] font-black text-slate-500 shadow-xs">
              +{activeCohortCount - 5}
            </div>
          )}
        </div>
        {/* Network Background SVG */}
        <div className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.14] pointer-events-none translate-x-3 translate-y-3">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="30" cy="70" r="8" fill="#10b981" />
            <circle cx="70" cy="30" r="6" fill="#10b981" />
            <circle cx="70" cy="70" r="10" fill="#10b981" />
            <circle cx="40" cy="35" r="7" fill="#10b981" />
            <line x1="30" y1="70" x2="40" y2="35" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />
            <line x1="30" y1="70" x2="70" y2="70" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />
            <line x1="70" y1="30" x2="40" y2="35" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />
            <line x1="70" y1="30" x2="70" y2="70" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />
            <line x1="40" y1="35" x2="70" y2="70" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />
          </svg>
        </div>
        <span className="text-[10px] font-bold text-slate-400 relative z-10">Completed at least 1 checkpoint</span>
      </div>

      {/* Card 4: Personal Rank / Top Cohort Learner */}
      {user && !isAdmin && hasOwnCompletion && ownCompletion ? (
        <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/20 border border-indigo-100/50 shadow-[0_8px_30px_rgba(99,102,241,0.02)] rounded-[24px] p-6 flex flex-col justify-between h-[165px] hover:shadow-[0_12px_40px_rgba(99,102,241,0.06)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-center pb-2.5 border-b border-indigo-100/20 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Your Standings</span>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-750 border border-indigo-100/40">#{myRank || 'N/A'}</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2 relative z-10">
            <span className="text-3xl font-black text-indigo-950" style={{ fontFamily: "'Outfit', sans-serif" }}>{ownCompletion.percentage}%</span>
            <span className="text-[10px] font-bold text-indigo-600/80 uppercase">completed</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 mt-1 relative z-10">
            <span className="truncate text-slate-500 font-semibold">Focus: {currentFocusModule?.title?.split(' - ')[1] || 'Completed'}</span>
          </div>
          {/* Podium Background SVG */}
          <div className="absolute bottom-0 right-0 w-24 h-20 opacity-[0.10] pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 80" preserveAspectRatio="none">
              <rect x="10" y="50" width="25" height="30" rx="3" fill="#6366f1" />
              <rect x="37.5" y="30" width="25" height="50" rx="3" fill="#6366f1" />
              <rect x="65" y="55" width="25" height="25" rx="3" fill="#6366f1" />
              <path d="M50 10 L52 15 L57 15 L53 18 L55 23 L50 20 L45 23 L47 18 L43 15 L48 15 Z" fill="#6366f1" />
            </svg>
          </div>
          <Link href={activeFocusLink} className="text-[10px] font-black text-indigo-650 hover:text-indigo-750 flex items-center gap-0.5 w-fit relative z-10">
            Resume Tasks <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/20 border border-amber-100/50 shadow-[0_8px_30px_rgba(245,158,11,0.02)] rounded-[24px] p-6 flex flex-col justify-between h-[165px] hover:shadow-[0_12px_40px_rgba(245,158,11,0.06)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-center pb-2.5 border-b border-amber-100/20 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Top Learner</span>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-750 border border-amber-100/40">👑 Lead</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2 relative z-10">
            <span className="text-2xl font-black text-amber-750 truncate max-w-[150px]" style={{ fontFamily: "'Outfit', sans-serif" }}>{topPerformer?.userName || 'N/A'}</span>
          </div>
          {/* Trophy Background SVG */}
          <div className="absolute bottom-0 right-0 w-24 h-24 opacity-12 pointer-events-none translate-x-2 translate-y-2">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <path d="M20 80 L80 80 L90 40 L70 55 L50 30 L30 55 L10 40 Z" fill="none" stroke="#d97706" strokeWidth="2.5" />
              <circle cx="50" cy="30" r="3.5" fill="#d97706" />
              <circle cx="90" cy="40" r="3" fill="#d97706" />
              <circle cx="10" cy="40" r="3" fill="#d97706" />
              <line x1="20" y1="80" x2="80" y2="80" stroke="#d97706" strokeWidth="4" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-1 block relative z-10">
            Progress Rate: <span className="font-black text-amber-600">{topPerformer?.completionRate || 0}%</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 relative z-10">Highest completion rate in cohort</span>
        </div>
      )}
    </div>
  );
}
