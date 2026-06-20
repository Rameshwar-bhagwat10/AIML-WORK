import React from 'react';
import { RoadmapCard } from '@/components/roadmap/roadmap-card';

interface RoadmapMilestoneListProps {
  milestones: {
    month: string;
    weeks: {
      week: string;
      title: string;
      completed: boolean;
      tasksCount: number;
      completedTasksCount: number;
      isUnlocked?: boolean;
      isStudying?: boolean;
    }[];
  }[];
}

export function RoadmapMilestoneList({ milestones }: RoadmapMilestoneListProps) {
  return (
    <div className="space-y-14 pt-4">
      {milestones.map((m) => {
        const parts = m.month.split(': ');
        const monthLabel = parts[0] || 'Month';
        const monthClean = parts[1] || m.month;
        return (
          <div key={m.month} className="space-y-6">
            {/* Premium Month Heading Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 mt-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 flex-shrink-0 animate-pulse" />
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md uppercase tracking-widest select-none">
                    {monthLabel}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {monthClean}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start md:self-center">
                <span>📅</span> {m.weeks.length} Weeks Curriculum
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {m.weeks.map((w) => (
                <RoadmapCard
                  key={w.week}
                  month={m.month}
                  week={w.week}
                  title={w.title}
                  completed={w.completed}
                  tasksCount={w.tasksCount}
                  completedTasksCount={w.completedTasksCount}
                  isUnlocked={w.isUnlocked}
                  isStudying={w.isStudying}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
