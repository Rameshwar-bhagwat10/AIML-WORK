import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProgressService } from '@/features/progress/progress.service';
import { RoadmapService } from '@/features/roadmap/roadmap.service';
import { CohortMetricCards } from '@/components/progress/metric-cards';
import { CohortProgressionChart } from '@/components/progress/progression-chart';
import { LeaderboardStanding } from '@/components/progress/leaderboard-standing';
import { MilestoneGroup, MilestoneWeek } from '@/features/roadmap/roadmap.types';
import { UserDetailedModuleProgress } from '@/features/progress/progress.types';

export const metadata: Metadata = {
  title: 'Cohort Progress & Leaderboard | DevRoadmap',
  description: 'Track coding study velocity, curriculum milestones, and student rankings across the developer learning cohort.',
};

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Run all queries concurrently!
  const [profileRes, groupProgress, metrics, milestones] = await Promise.all([
    user
      ? supabase.from('users').select('role').eq('id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    ProgressService.getGroupProgress(),
    ProgressService.getGroupMetrics(),
    user
      ? RoadmapService.getMilestones(user.id)
      : Promise.resolve([])
  ]);

  const isAdmin = profileRes.data?.role === 'admin';

  // Load personal metrics if logged in and not admin
  let ownCompletion = null;
  let ownDetailedBreakdown: UserDetailedModuleProgress[] = [];
  let currentFocusModule: UserDetailedModuleProgress | { title: string } | null = null;
  let myRank: number | null = null;
  let activeFocusLink = '/roadmap';

  // Sort cohort list by completionRate descending
  const sortedLeaderboard = [...groupProgress].sort((a, b) => b.completionRate - a.completionRate);
  const cohortSize = groupProgress.length;

  if (user && !isAdmin) {
    try {
      // 1. Calculate own completion stats from milestones
      let ownTotal = 0;
      let ownCompleted = 0;
      milestones.forEach(m => {
        m.weeks.forEach(w => {
          ownTotal += w.tasksCount;
          ownCompleted += w.completedTasksCount;
        });
      });
      const ownPercentage = ownTotal > 0 ? Math.round((ownCompleted / ownTotal) * 100) : 0;
      ownCompletion = {
        completedTasks: ownCompleted,
        totalTasks: ownTotal,
        percentage: ownPercentage
      };

      // 2. Calculate detailed breakdown from milestones
      ownDetailedBreakdown = [];
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
          ownDetailedBreakdown.push({
            title,
            status,
            statusColor
          });
        });
      });

      currentFocusModule = ownDetailedBreakdown.find(m => m.status === 'In Progress')
        || ownDetailedBreakdown.find(m => m.status === 'Not Started')
        || { title: 'Curriculum Completed!' };

      // Calculate cohort ranking rank
      const myRankIndex = sortedLeaderboard.findIndex(m => m.userId === user.id);
      if (myRankIndex !== -1) {
        myRank = myRankIndex + 1;
      }

      // Resolve first uncompleted roadmap week
      let foundActive = false;
      for (const milestone of milestones) {
        const mNum = parseInt(milestone.month.split(':')[0].replace(/\D/g, ''), 10);
        for (const w of milestone.weeks) {
          const wNum = parseInt(w.week.replace(/\D/g, ''), 10);
          if (!w.completed && !foundActive) {
            activeFocusLink = `/roadmap/${mNum}/${wNum}`;
            foundActive = true;
          }
        }
      }
    } catch (e) {
      console.error('Failed to load personal progress details:', e);
    }
  }

  // Calculate cohort aggregates
  const totalTasksCompleted = groupProgress.reduce((sum, u) => sum + u.completedMilestones, 0);
  const totalPossibleTasks = groupProgress.reduce((sum, u) => sum + u.totalMilestones, 0);
  const cohortAvg = cohortSize > 0 
    ? Math.round(groupProgress.reduce((sum, u) => sum + u.completionRate, 0) / cohortSize) 
    : 0;
  const activeCohortCount = groupProgress.filter(u => u.completionRate > 0).length;
  const topPerformer = sortedLeaderboard[0] || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-650 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/40">
            Cohort Tracking Hub
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2 text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Cohort Progress
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Track study velocity, curriculum milestones, and member standings.</p>
        </div>
      </div>

      {/* Admin Information Mode */}
      {isAdmin && (
        <div className="rounded-[20px] p-5 border border-indigo-100/40 bg-gradient-to-r from-indigo-50/50 via-white to-indigo-50/20 text-indigo-850 text-xs font-semibold flex flex-col gap-1 shadow-[0_4px_20px_rgba(99,102,241,0.02)]">
          <h3 className="font-black text-indigo-700 flex items-center gap-2">
            <span>🛡️</span> Administrator Overview Console
          </h3>
          <p className="text-slate-500 font-bold leading-relaxed">
            You are logged in as an administrator. Your own checkpoints are excluded. Leaderboards display cohort members only.
          </p>
        </div>
      )}

      {/* Top Stats Cards */}
      <CohortMetricCards
        cohortAvg={cohortAvg}
        totalTasksCompleted={totalTasksCompleted}
        totalPossibleTasks={totalPossibleTasks}
        activeCohortCount={activeCohortCount}
        cohortSize={cohortSize}
        isAdmin={isAdmin}
        user={user}
        ownCompletion={ownCompletion}
        currentFocusModule={currentFocusModule}
        myRank={myRank}
        activeFocusLink={activeFocusLink}
        topPerformer={topPerformer}
        activeMembers={groupProgress.filter(u => u.completionRate > 0)}
      />

      {/* Charts & Analytics */}
      <CohortProgressionChart
        metrics={metrics}
        cohortAvg={cohortAvg}
      />

      {/* Interactive Leaderboard standings list */}
      <LeaderboardStanding
        sortedLeaderboard={sortedLeaderboard}
        currentUserId={user?.id}
        isAdmin={isAdmin}
      />
    </div>
  );
}
