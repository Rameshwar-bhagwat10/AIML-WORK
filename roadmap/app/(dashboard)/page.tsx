/* eslint-disable react-hooks/purity */
import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { RoadmapService } from '@/features/roadmap/roadmap.service';
import { DashboardHero } from '@/components/dashboard/hero-banner';
import { DashboardMetricCards } from '@/components/dashboard/metric-cards';
import { LearningCurveChart, ActiveFocusMilestone } from '@/components/dashboard/learning-curve-chart';
import { SkillBreakdownChart } from '@/components/dashboard/skill-breakdown-chart';
import { NextMilestonesTimeline } from '@/components/dashboard/milestones-timeline';

export const metadata: Metadata = {
  title: 'AI Progress Dashboard | DevRoadmap',
  description: 'View your real-time developer milestone achievements, task completions, skill breakdown, and study streak statistics.',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get milestones, progress logs, and weeks metadata concurrently
  const [milestones, progressLogsResult, weeksMetadataResult] = await Promise.all([
    RoadmapService.getMilestones(user?.id),
    user?.id
      ? supabase.from('progress').select('updated_at').eq('user_id', user.id).eq('completed', true)
      : Promise.resolve({ data: null, error: null }),
    supabase.from('roadmap_weeks').select('month, week, project')
  ]);

  // Find the current active week: the first one that is NOT completed
  let currentMonthNum = 1;
  let currentWeekNum = 1;
  let currentWeekTitle = 'Introduction';
  let currentWeekProject = '';
  let totalTasks = 0;
  let completedTasks = 0;
  let foundActive = false;

  for (const milestone of milestones) {
    const mNum = parseInt(milestone.month.split(':')[0].replace(/\D/g, ''), 10);
    for (const w of milestone.weeks) {
      const wNum = parseInt(w.week.replace(/\D/g, ''), 10);
      if (!w.completed && !foundActive) {
        currentMonthNum = mNum;
        currentWeekNum = wNum;
        currentWeekTitle = w.title;
        totalTasks = w.tasksCount;
        completedTasks = w.completedTasksCount;
        foundActive = true;
      }
    }
  }

  // Fallback if all completed or none found
  if (!foundActive && milestones.length > 0) {
    const lastMilestone = milestones[milestones.length - 1];
    const lastMonthNum = parseInt(lastMilestone.month.split(':')[0].replace(/\D/g, ''), 10);
    if (lastMilestone.weeks.length > 0) {
      const lastW = lastMilestone.weeks[lastMilestone.weeks.length - 1];
      const lastWNum = parseInt(lastW.week.replace(/\D/g, ''), 10);
      currentMonthNum = lastMonthNum;
      currentWeekNum = lastWNum;
      currentWeekTitle = lastW.title;
      totalTasks = lastW.tasksCount;
      completedTasks = lastW.completedTasksCount;
    }
  }

  // Fetch project description of the current week from pre-fetched metadata
  if (foundActive || milestones.length > 0) {
    const weeksMetadata = weeksMetadataResult.data || [];
    const activeWeekMeta = weeksMetadata.find(
      (w) => w.month === currentMonthNum && w.week === currentWeekNum
    );
    currentWeekProject = activeWeekMeta?.project || '';
  }

  // Calculate global statistics from real milestones data
  let globalTotal = 0;
  let globalCompleted = 0;
  milestones.forEach(m => {
    m.weeks.forEach(w => {
      globalTotal += w.tasksCount;
      globalCompleted += w.completedTasksCount;
    });
  });

  const globalCompletionPercentage = globalTotal > 0 ? Math.round((globalCompleted / globalTotal) * 100) : 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const displayName = user?.email?.split('@')[0] || 'Developer';

  // Calculate actual Monthly progress rates for the Spline Curve Chart
  const monthProgress = milestones.map(m => {
    const monthNum = parseInt(m.month.split(':')[0].replace(/\D/g, ''), 10);
    let total = 0;
    let completed = 0;
    m.weeks.forEach(w => {
      total += w.tasksCount;
      completed += w.completedTasksCount;
    });
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      monthNum,
      percent
    };
  });

  // Safe Month percentages for SVG points
  const p1 = monthProgress[0]?.percent || 0;
  const p2 = monthProgress[1]?.percent || 0;
  const p3 = monthProgress[2]?.percent || 0;
  const p4 = monthProgress[3]?.percent || 0;

  // Calculate relative completed weights for Skill Distribution Donut chart
  const m1Completed = milestones[0]?.weeks.reduce((acc, w) => acc + w.completedTasksCount, 0) || 0;
  const m2Completed = milestones[1]?.weeks.reduce((acc, w) => acc + w.completedTasksCount, 0) || 0;
  const m3Completed = milestones[2]?.weeks.reduce((acc, w) => acc + w.completedTasksCount, 0) || 0;
  const m4Completed = milestones[3]?.weeks.reduce((acc, w) => acc + w.completedTasksCount, 0) || 0;

  const m1Total = milestones[0]?.weeks.reduce((acc, w) => acc + w.tasksCount, 0) || 0;
  const m2Total = milestones[1]?.weeks.reduce((acc, w) => acc + w.tasksCount, 0) || 0;
  const m3Total = milestones[2]?.weeks.reduce((acc, w) => acc + w.tasksCount, 0) || 0;
  const m4Total = milestones[3]?.weeks.reduce((acc, w) => acc + w.tasksCount, 0) || 0;

  const pythonPercent = m1Total > 0 ? Math.round((m1Completed / m1Total) * 100) : 0;
  const mathPercent = m2Total > 0 ? Math.round((m2Completed / m2Total) * 100) : 0;
  const mlPercent = m3Total > 0 ? Math.round((m3Completed / m3Total) * 100) : 0;
  const nnPercent = m4Total > 0 ? Math.round((m4Completed / m4Total) * 100) : 0;

  // Real dynamic titles from database
  const pythonTitle = milestones[0]?.month.split(': ')[1] || 'Python Foundations';
  const mathTitle = milestones[1]?.month.split(': ')[1] || 'Math & Statistics';
  const mlTitle = milestones[2]?.month.split(': ')[1] || 'ML Algorithms';
  const nnTitle = milestones[3]?.month.split(': ')[1] || 'Neural Networks';

  // Calculate real Study Streak from progress log timestamps
  let currentStreak = 0;
  let activeDaysCount = 0;

  if (user?.id) {
    try {
      const logDates = (progressLogsResult.data || [])
        .map(log => log.updated_at ? log.updated_at.split('T')[0] : null)
        .filter(Boolean) as string[];

      const uniqueDates = Array.from(new Set(logDates)).sort();
      activeDaysCount = uniqueDates.length;

      if (uniqueDates.length > 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const hasToday = uniqueDates.includes(todayStr);
        const hasYesterday = uniqueDates.includes(yesterdayStr);

        if (hasToday || hasYesterday) {
          currentStreak = 1;
          const checkDate = new Date(hasToday ? Date.now() : Date.now() - 86400000);

          while (true) {
            checkDate.setDate(checkDate.getDate() - 1);
            const dateStr = checkDate.toISOString().split('T')[0];
            if (uniqueDates.includes(dateStr)) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to calculate user study streak:', e);
    }
  }

  return (
    <div className="space-y-8 animate-card-enter">
      {/* Welcome Hero Banner */}
      <DashboardHero
        displayName={displayName}
        globalCompletionPercentage={globalCompletionPercentage}
        globalCompleted={globalCompleted}
        globalTotal={globalTotal}
        currentMonthNum={currentMonthNum}
        currentWeekNum={currentWeekNum}
      />

      {/* Dynamic Grid Row */}
      <DashboardMetricCards
        globalCompletionPercentage={globalCompletionPercentage}
        globalCompleted={globalCompleted}
        globalTotal={globalTotal}
        currentMonthNum={currentMonthNum}
        currentWeekNum={currentWeekNum}
        currentWeekTitle={currentWeekTitle}
        completionPercentage={completionPercentage}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        currentStreak={currentStreak}
        activeDaysCount={activeDaysCount}
      />

      {/* Dashboard Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Row 1 Left - Spline Curve Chart */}
        <LearningCurveChart
          globalCompletionPercentage={globalCompletionPercentage}
          p1={p1}
          p2={p2}
          p3={p3}
          p4={p4}
        />

        {/* Row 1 Right - Skill Donut Chart */}
        <SkillBreakdownChart
          pythonPercent={pythonPercent}
          mathPercent={mathPercent}
          mlPercent={mlPercent}
          nnPercent={nnPercent}
          pythonTitle={pythonTitle}
          mathTitle={mathTitle}
          mlTitle={mlTitle}
          nnTitle={nnTitle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Row 2 Left - Active Focus Milestone */}
        <ActiveFocusMilestone
          currentMonthNum={currentMonthNum}
          currentWeekNum={currentWeekNum}
          currentWeekTitle={currentWeekTitle}
          currentWeekProject={currentWeekProject}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          completionPercentage={completionPercentage}
        />

        {/* Row 2 Right - Next Milestones Timeline */}
        <NextMilestonesTimeline />
      </div>
    </div>
  );
}

