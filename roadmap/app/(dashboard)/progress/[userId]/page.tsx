import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { RoadmapService } from '@/features/roadmap/roadmap.service';
import { UserService } from '@/features/users/user.service';
import { createClient } from '@/lib/supabase/server';
import { MilestoneGroup, MilestoneWeek } from '@/features/roadmap/roadmap.types';

interface UserProgressPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function generateMetadata({ params }: UserProgressPageProps): Promise<Metadata> {
  const { userId } = await params;
  const user = await UserService.getUserById(userId);
  const name = user?.name || user?.email || 'Student';
  return {
    title: `${name}'s Learning Progress | DevRoadmap`,
    description: `Track completed milestones, current focus area, and detailed learning checklist standing for cohort member ${name}.`,
  };
}

export default async function UserProgressPage({ params }: UserProgressPageProps) {
  const { userId } = await params;

  const supabase = await createClient();

  // Run all database calls concurrently in 1 parallel batch!
  const [user, sessionUserResult, milestones] = await Promise.all([
    UserService.getUserById(userId),
    supabase.auth.getUser(),
    RoadmapService.getMilestones(userId)
  ]);

  if (!user) {
    notFound();
  }

  const sessionUser = sessionUserResult.data?.user;
  const isOwnProfile = sessionUser?.id === userId;

  // Calculate detailed completion & milestones breakdown in-memory synchronously
  let totalTasks = 0;
  let completedTasks = 0;
  milestones.forEach(m => {
    m.weeks.forEach(w => {
      totalTasks += w.tasksCount;
      completedTasks += w.completedTasksCount;
    });
  });
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const modulesBreakdown: { title: string; status: 'Complete' | 'In Progress' | 'Not Started'; statusColor: string }[] = [];
  milestones.forEach((m: MilestoneGroup) => {
    const monthTitle = m.month.split(': ')[1] || m.month;
    m.weeks.forEach((w: MilestoneWeek) => {
      let status: 'Complete' | 'In Progress' | 'Not Started' = 'Not Started';
      let statusColor = 'var(--text-muted)';

      if (w.completed) {
        status = 'Complete';
        statusColor = 'var(--success)';
      } else if (w.completedTasksCount > 0) {
        status = 'In Progress';
        statusColor = 'var(--warning)';
      }

      const title = `${monthTitle} - Week ${w.week.split('-')[1]}`;
      modulesBreakdown.push({
        title,
        status,
        statusColor
      });
    });
  });

  const currentFocusModule = modulesBreakdown.find(m => m.status === 'In Progress')
    || modulesBreakdown.find(m => m.status === 'Not Started')
    || { title: 'Curriculum Completed!' };

  const userProgress = {
    userName: user.name || user.email,
    userId: user.id,
    email: user.email,
    role: user.role,
    completionRate,
    completedMilestones: completedTasks,
    totalMilestones: totalTasks,
  };

  // Determine study phase
  let studyPhase = 'Syllabus Starter';
  let phaseColor = 'text-slate-500 bg-slate-50 border-slate-200';
  if (userProgress.completionRate >= 80) {
    studyPhase = 'Curriculum Master';
    phaseColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  } else if (userProgress.completionRate >= 50) {
    studyPhase = 'Advanced Architect';
    phaseColor = 'text-indigo-600 bg-indigo-50 border-indigo-200';
  } else if (userProgress.completionRate >= 20) {
    studyPhase = 'Consistent Builder';
    phaseColor = 'text-amber-600 bg-amber-50 border-amber-200';
  }

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Back button and Page Title */}
      <div className="space-y-5">
        <Link 
          href="/progress" 
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 select-none group w-fit"
        >
          <span className="w-7 h-7 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:-translate-x-0.5 transition-transform duration-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </span>
          <span>Back to Group Standings</span>
        </Link>

        {/* Read-only notification banner */}
        {!isOwnProfile && (
          <div className="rounded-[20px] p-4.5 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/30 border border-indigo-100/40 text-indigo-850 text-[12px] font-bold flex items-start sm:items-center gap-3 shadow-[0_4px_20px_rgba(99,102,241,0.02)] animate-pulse">
            <span className="text-base flex-shrink-0">🔒</span>
            <span className="leading-relaxed">
              You are inspecting another member&apos;s progress. Read-only timeline details are presented.
            </span>
          </div>
        )}

        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {isOwnProfile ? 'My Detailed Progress' : `${userProgress.userName}'s Progress`}
          </h1>
          <p className="text-sm text-slate-500">Detailed individual metrics, syllabus benchmarks, and roadmap completion.</p>
        </div>
      </div>

      {/* Unified Profile Metrics Panel */}
      <div className="rounded-[24px] border border-slate-100 bg-white p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Block: User Identity (4 Cols) */}
          <div className="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
            <div 
              style={{ background: getAvatarGrad(userProgress.userName) }} 
              className="w-16 h-16 rounded-full flex items-center justify-center font-black text-white text-xl shadow-md border-2 border-white select-none flex-shrink-0"
            >
              {userProgress.userName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1 truncate">
              <span className="text-[8px] uppercase font-black tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100/40 px-2 py-0.5 rounded select-none">
                {userProgress.role}
              </span>
              <h2 className="text-lg font-black text-slate-800 truncate leading-snug">{userProgress.userName}</h2>
              <p className="text-xs text-slate-400 font-semibold truncate leading-tight">{userProgress.email}</p>
            </div>
          </div>

          {/* Right Block: Core Progress Metrics (8 Cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
            
            {/* Metric 1: Rate */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Completion Rate</span>
              <span className="text-2xl font-black text-slate-850 block leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>{userProgress.completionRate}%</span>
              <div className="w-full h-1.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-indigo-650 to-indigo-450 transition-all duration-500" 
                  style={{ width: `${userProgress.completionRate}%` }} 
                />
              </div>
            </div>

            {/* Metric 2: Ratio */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Checkpoints</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-slate-850 leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>{userProgress.completedMilestones}</span>
                <span className="text-xs font-bold text-slate-450">/ {userProgress.totalMilestones}</span>
              </div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-1.5">Milestones finished</p>
            </div>

            {/* Metric 3: Focus */}
            <div className="space-y-1 truncate">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Current Focus</span>
              <div className="text-sm font-black text-indigo-650 truncate mt-1" title={currentFocusModule.title}>
                {currentFocusModule.title.split(' - ')[1] || currentFocusModule.title}
              </div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-1 truncate">
                {currentFocusModule.title.split(' - ')[0] || 'Roadmap Track'}
              </p>
            </div>

            {/* Metric 4: Phase */}
            <div className="space-y-1.5 flex flex-col justify-center items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Study Phase</span>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${phaseColor} select-none`}>
                {studyPhase}
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Nested Month-by-Week Syllabus Timeline */}
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Roadmap Timeline & Weekly Milestones
          </h2>
        </div>

        <div className="space-y-10">
          {milestones.map((milestone, mIdx) => {
            const monthHeader = milestone.month.split(': ')[0] || 'Month';
            const monthSubject = milestone.month.split(': ')[1] || 'Syllabus Core';
            
            // Calculate Month aggregate completion rate
            const mTotalTasks = milestone.weeks.reduce((sum, w) => sum + w.tasksCount, 0);
            const mCompletedTasks = milestone.weeks.reduce((sum, w) => sum + w.completedTasksCount, 0);
            const mPercentage = mTotalTasks > 0 ? Math.round((mCompletedTasks / mTotalTasks) * 100) : 0;
            const monthNum = parseInt(monthHeader.replace(/\D/g, ''), 10) || 1;

            return (
              <div key={mIdx} className="space-y-4">
                {/* Month Heading Title */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 z-10 relative">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/40 select-none">
                      {monthHeader}
                    </span>
                    <h3 className="text-base font-black text-slate-800 mt-1">
                      {monthSubject}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 w-44">
                    <div className="flex-1">
                      <div className="w-full h-1.5 bg-slate-50 border border-slate-100/80 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-500" 
                          style={{ width: `${mPercentage}%` }} 
                        />
                      </div>
                    </div>
                    <span className="text-xs font-black text-indigo-650 w-8 text-right select-none">
                      {mPercentage}%
                    </span>
                  </div>
                </div>

                {/* Weeks Grid Checklist */}
                <div className="space-y-3 z-10 relative pl-4">
                  {milestone.weeks.map((w) => {
                    const weekNum = parseInt(w.week.replace(/\D/g, ''), 10) || 1;
                    
                    // Determine Status badge
                    let badgeLabel = 'Not Started';
                    let badgeClass = 'bg-slate-50 border-slate-200/50 text-slate-500';
                    let badgeIcon = '○';
                    if (w.completed) {
                      badgeLabel = 'Complete';
                      badgeClass = 'bg-emerald-50 border-emerald-100/45 text-emerald-700';
                      badgeIcon = '✓';
                    } else if (w.completedTasksCount > 0) {
                      badgeLabel = 'In Progress';
                      badgeClass = 'bg-amber-50 border-amber-100/45 text-amber-700 animate-pulse';
                      badgeIcon = '⚡';
                    }

                    return (
                      <div 
                        key={w.week} 
                        className="rounded-2xl border border-slate-100 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_4px_15px_rgba(0,0,0,0.005)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.012)] hover:-translate-y-0.5 transition-all duration-300 w-full"
                      >
                        <div className="flex items-center gap-4">
                          {/* Left index circle */}
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 shadow-xs select-none ${
                              w.completed 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                                : w.completedTasksCount > 0 
                                ? 'bg-amber-50 border-amber-500 text-amber-600 animate-pulse' 
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            {weekNum}
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-black text-slate-800 leading-snug">
                              Week {weekNum} Curriculum Detail
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5 leading-tight">
                              Tasks finished: {w.completedTasksCount} of {w.tasksCount} Checkpoints
                            </p>
                          </div>
                        </div>

                        {/* Status badge & Resume Actions (Clutter-free, removed nested progress bar) */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${badgeClass} select-none`}>
                            {badgeIcon} {badgeLabel}
                          </span>

                          {isOwnProfile && !w.completed ? (
                            <Link href={`/roadmap/${monthNum}/${weekNum}`} className="flex-shrink-0">
                              <button className="rounded-full px-5 py-2.5 text-[9px] font-black uppercase tracking-wider shadow-sm transition-all border-0 cursor-pointer bg-slate-900 text-white hover:bg-slate-800 hover:scale-102">
                                Study Week
                              </button>
                            </Link>
                          ) : (
                            <Link href={`/roadmap/${monthNum}/${weekNum}`} className="flex-shrink-0">
                              <button className="rounded-full px-5 py-2.5 text-[9px] font-black uppercase tracking-wider shadow-sm transition-all border-0 cursor-pointer bg-slate-100 text-slate-655 hover:bg-slate-200/80">
                                Inspect
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
