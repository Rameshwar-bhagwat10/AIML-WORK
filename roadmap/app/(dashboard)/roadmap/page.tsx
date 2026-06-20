import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { RoadmapService } from '@/features/roadmap/roadmap.service';
import { RoadmapMetricCards } from '@/components/roadmap/board-metric-cards';
import { RoadmapMilestoneList } from '@/components/roadmap/milestone-list';
import { MilestoneWeek } from '@/features/roadmap/roadmap.types';

export const revalidate = 0; // Disable static caching

export const metadata: Metadata = {
  title: 'AI Study Roadmap | DevRoadmap',
  description: 'Access the structured developer roadmap curriculum. Complete tasks, build projects, and follow monthly learning milestones.',
};

export default async function RoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch milestones, progress logs, and users concurrently
  const [milestones, progressLogsResult, usersResult] = await Promise.all([
    RoadmapService.getMilestones(user?.id),
    user?.id
      ? supabase.from('progress').select('updated_at').eq('user_id', user.id).eq('completed', true)
      : Promise.resolve({ data: null }),
    supabase
      .from('users')
      .select('name, email', { count: 'exact' })
      .eq('role', 'member')
      .limit(4)
  ]);

  // Flatten weeks list for sequential state check
  const flatWeeksList: MilestoneWeek[] = [];
  milestones.forEach((m) => {
    m.weeks.forEach((w) => {
      flatWeeksList.push(w);
    });
  });

  // Calculate unlocked and studying states sequentially
  let foundStudying = false;
  flatWeeksList.forEach((w, idx) => {
    const isUnlocked = idx === 0 || flatWeeksList[idx - 1].completed;
    w.isUnlocked = isUnlocked;

    w.isStudying = false;
    if (!w.completed && !foundStudying) {
      w.isStudying = true;
      foundStudying = true;
    }
  });

  // Calculate general stats
  let totalTasks = 0;
  let completedCount = 0;

  // Segment counts
  let notStartedCount = 0;
  let onProgressCount = 0;
  let onReviewCount = 0;

  milestones.forEach((m) => {
    m.weeks.forEach((w) => {
      totalTasks += w.tasksCount;

      if (w.completed) {
        completedCount += w.tasksCount;
      } else if (w.completedTasksCount > 0) {
        completedCount += w.completedTasksCount;
        const remaining = w.tasksCount - w.completedTasksCount;
        const percent = Math.round((w.completedTasksCount / w.tasksCount) * 100);
        if (percent >= 50) {
          onReviewCount += remaining;
        } else {
          onProgressCount += remaining;
        }
      } else {
        notStartedCount += w.tasksCount;
      }
    });
  });

  const completionPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Resolve "Resume Course" URL routing
  let resumeUrl = '/roadmap';
  let resumeLabel = 'Start Syllabus';
  let activeWeekTitle = 'Introduction';
  let foundActive = false;

  for (const m of milestones) {
    const monthNum = parseInt(m.month.split(':')[0].replace(/\D/g, ''), 10);
    for (const w of m.weeks) {
      const weekNum = parseInt(w.week.replace(/\D/g, ''), 10);
      if (!w.completed) {
        resumeUrl = `/roadmap/${monthNum}/${weekNum}`;
        resumeLabel = 'Resume Syllabus';
        activeWeekTitle = `Month ${monthNum} Week ${weekNum}`;
        foundActive = true;
        break;
      }
    }
    if (foundActive) break;
  }

  // Fallback if all finished
  if (!foundActive && milestones.length > 0) {
    resumeLabel = 'Review Syllabus';
    activeWeekTitle = 'All Completed!';
  }

  // Sliding 7-day window ending today
  const dayHours = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  const dayNames: string[] = [];
  const today = new Date();

  // Create labels for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dayNames.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
  }

  // Populate hour weights based on actual logs
  const progressLogs = progressLogsResult?.data;
  if (progressLogs) {
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    progressLogs.forEach((p) => {
      const date = new Date(p.updated_at);
      const logMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const diffTime = todayMidnight.getTime() - logMidnight.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        const index = 6 - diffDays;
        dayHours[index] = Math.min(dayHours[index] + 2.0, 12.0); // 2h per task completion, cap at 12
      }
    });
  }

  // Active today values
  const activeDayName = dayNames[6];
  const activeDayHours = dayHours[6];

  // Dynamic percentage vs yesterday
  let percentChangeText = 'No change';
  const yesterdayHrs = dayHours[5];
  if (yesterdayHrs > 0) {
    const change = ((activeDayHours - yesterdayHrs) / yesterdayHrs) * 100;
    percentChangeText = `${change >= 0 ? '▲' : '▼'} ${Math.abs(Math.round(change))}% vs yesterday`;
  } else if (activeDayHours > 0) {
    percentChangeText = '▲ 100% vs yesterday';
  } else {
    percentChangeText = '0% vs yesterday';
  }

  // Segment widths
  const notStartedPct = totalTasks > 0 ? (notStartedCount / totalTasks) * 100 : 0;
  const onProgressPct = totalTasks > 0 ? (onProgressCount / totalTasks) * 100 : 0;
  const onReviewPct = totalTasks > 0 ? (onReviewCount / totalTasks) * 100 : 0;
  const completedPct = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  // Fetch actual attendants from users table (already pre-fetched concurrently)
  const usersData = usersResult?.data;
  const totalMembersCount = usersResult?.count;

  // Dynamic avatar gradient helper
  const getAvatarGrad = (name: string) => {
    const charCodeSum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const grads = [
      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
      'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    ];
    return grads[charCodeSum % grads.length];
  };

  const attendants = (usersData || []).map((u) => {
    const name = u.name || u.email || 'Cohort Member';
    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    return {
      initials,
      grad: getAvatarGrad(name),
    };
  });

  const remainingMembers = Math.max(0, (totalMembersCount || 0) - attendants.length);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: '#1e293b', fontFamily: "'Outfit', sans-serif" }}>
            Roadmap Board
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Follow your structured track, complete daily checklists, and broadcast project targets.
          </p>
        </div>
      </div>

      {/* Grid Dashboard - Top Stats Section */}
      <RoadmapMetricCards
        completionPercent={completionPercent}
        activeWeekTitle={activeWeekTitle}
        resumeUrl={resumeUrl}
        resumeLabel={resumeLabel}
        totalTasks={totalTasks}
        completedPct={completedPct}
        onReviewPct={onReviewPct}
        onProgressPct={onProgressPct}
        notStartedPct={notStartedPct}
        notStartedCount={notStartedCount}
        onProgressCount={onProgressCount}
        onReviewCount={onReviewCount}
        completedCount={completedCount}
        attendants={attendants}
        remainingMembers={remainingMembers}
        percentChangeText={percentChangeText}
        activeDayHours={activeDayHours}
        activeDayName={activeDayName}
        dayHours={dayHours}
        dayNames={dayNames}
      />

      {/* Curriculum listing sections */}
      <RoadmapMilestoneList milestones={milestones} />
    </div>
  );
}

