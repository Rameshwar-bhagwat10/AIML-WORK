import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { WeekHeader } from '@/components/roadmap/WeekHeader';
import { WeekPracticeCurriculum } from '@/components/roadmap/WeekPracticeCurriculum';
import { RoadmapService } from '@/features/roadmap/roadmap.service';
import { createClient } from '@/lib/supabase/server';
import { ProgressService } from '@/features/progress/progress.service';

interface PageProps {
  params: Promise<{
    month: string;
    week: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month, week } = await params;
  return {
    title: `Month ${month} Week ${week} Curriculum | DevRoadmap`,
    description: `Detailed schedule, checklists, and project targets for Month ${month} Week ${week} of the AI developer learning roadmap.`,
  };
}

export default async function WeekPage({ params }: PageProps) {
  const { month: monthStr, week: weekStr } = await params;
  const month = parseInt(monthStr, 10);
  const week = parseInt(weekStr, 10);

  if (isNaN(month) || isNaN(week) || month <= 0 || week <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <span className="text-3xl">⚠️</span>
        <h2 className="text-xl font-bold mt-4" style={{ color: 'var(--text-primary)' }}>Invalid Parameters</h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>The requested month or week parameter is not a valid number.</p>
        <Link href="/roadmap" className="mt-6 px-4 py-2 text-sm font-medium rounded-lg transition-colors" style={{ background: 'var(--primary)', color: 'var(--text-on-accent)' }}>
          Back to Roadmap
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all progress, week metadata, tasks, and milestones concurrently
  const [progressList, weekMetadataRes, groupedTasks, milestones] = await Promise.all([
    user ? ProgressService.getUserProgress(user.id) : Promise.resolve([]),
    supabase
      .from('roadmap_weeks')
      .select('topics, tools, project, tip')
      .eq('month', month)
      .eq('week', week)
      .maybeSingle(),
    RoadmapService.getTasksByWeek(month, week),
    RoadmapService.getMilestones(user?.id)
  ]);

  const initialProgressMap: Record<string, boolean> = {};
  if (user) {
    progressList.forEach((p) => {
      initialProgressMap[p.task_id] = p.completed;
    });
  }

  const weekData = weekMetadataRes.data;
  const days = groupedTasks.map(g => ({
    day: g.day,
    tasks: g.tasks.map(t => ({
      id: t.id,
      title: t.title
    }))
  }));

  // Format data payload matching the expected payload structure
  const data = {
    month,
    week,
    topics: weekData?.topics || [],
    tools: weekData?.tools || [],
    project: weekData?.project || '',
    tip: weekData?.tip || '',
    days
  };

  // Determine dynamic Previous and Next week routes + sequential unlocking
  let prevWeek: { month: number; week: number } | null = null;
  let nextWeek: { month: number; week: number } | null = null;
  let isUnlocked = true;

  const allWeeks: { month: number; week: number; completed: boolean }[] = [];
  milestones.forEach(m => {
    const mNum = parseInt(m.month.split(':')[0].replace(/\D/g, ''), 10);
    m.weeks.forEach(w => {
      const wNum = parseInt(w.week.replace(/\D/g, ''), 10);
      allWeeks.push({ month: mNum, week: wNum, completed: w.completed });
    });
  });

  const currentIndex = allWeeks.findIndex(item => item.month === month && item.week === week);
  if (currentIndex !== -1) {
    prevWeek = currentIndex > 0 ? allWeeks[currentIndex - 1] : null;
    nextWeek = currentIndex < allWeeks.length - 1 ? allWeeks[currentIndex + 1] : null;
    isUnlocked = currentIndex === 0 || allWeeks[currentIndex - 1].completed;
  }

  if (data.days.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <span className="text-3xl">📭</span>
        <h2 className="text-xl font-bold mt-4" style={{ color: 'var(--text-primary)' }}>No tasks found</h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>There is no practice curriculum scheduled for Month {month} Week {week}.</p>
        <Link href="/roadmap" className="mt-6 px-4 py-2 text-sm font-medium rounded-lg transition-colors" style={{ background: 'var(--bg-inset)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
          Back to Roadmap
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Navigation & Back Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/roadmap"
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 select-none group w-fit"
        >
          <span className="w-7 h-7 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:-translate-x-0.5 transition-transform duration-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </span>
          <span>Back to Roadmap</span>
        </Link>

        {/* Previous / Next buttons */}
        <div className="flex items-center gap-2">
          {prevWeek ? (
            <Link
              href={`/roadmap/${prevWeek.month}/${prevWeek.week}`}
              className="text-xs font-bold px-5 py-2.5 rounded-full transition-all border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 shadow-sm flex items-center gap-1.5"
            >
              <span>←</span> Prev Week
            </Link>
          ) : (
            <button
              disabled
              className="text-xs font-bold px-5 py-2.5 rounded-full border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed flex items-center gap-1.5 opacity-60"
            >
              <span>←</span> Prev Week
            </button>
          )}

          {nextWeek ? (
            <Link
              href={`/roadmap/${nextWeek.month}/${nextWeek.week}`}
              className="text-xs font-bold px-5 py-2.5 rounded-full transition-all bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-1.5 hover:scale-102"
            >
              Next Week <span>→</span>
            </Link>
          ) : (
            <button
              disabled
              className="text-xs font-bold px-5 py-2.5 rounded-full border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed flex items-center gap-1.5 opacity-60"
            >
              Next Week <span>→</span>
            </button>
          )}
        </div>
      </div>

      {/* Week Header Metadata Card */}
      <WeekHeader
        month={data.month}
        week={data.week}
        topics={data.topics}
        tools={data.tools}
        project={data.project}
        tip={data.tip}
      />

      {/* Daily Practice Checklist */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <span>📅</span> Weekly Schedule
          </h2>
        </div>
        
        {!isUnlocked && (
          <div className="rounded-[20px] p-4.5 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/30 border border-amber-200/60 text-amber-800 text-[12px] font-bold flex items-start sm:items-center gap-3 shadow-[0_4px_20px_rgba(245,158,11,0.03)] animate-pulse">
            <span className="text-base flex-shrink-0">🔒</span>
            <span className="leading-relaxed">
              Locked: Complete previous work to unlock this week&apos;s checklist. Currently, you can only see the roadmap tasks but cannot mark them.
            </span>
          </div>
        )}

        <WeekPracticeCurriculum 
          days={data.days} 
          initialProgressMap={initialProgressMap} 
          disabled={!isUnlocked}
        />
      </div>
    </div>
  );
}
