import React from 'react';
import { DayCard } from './DayCard';

interface Task {
  id: string;
  title: string;
}

interface DayData {
  day: number;
  tasks: Task[];
}

interface WeekViewProps {
  days: DayData[];
  progressMap: Record<string, boolean>;
  toggleTask: (taskId: string) => void;
  disabled?: boolean;
}

export function WeekView({ days, progressMap, toggleTask, disabled = false }: WeekViewProps) {
  // Sort and filter days with tasks
  const activeDays = days.filter((d) => d.tasks.length > 0).sort((a, b) => a.day - b.day);

  return (
    <div className="relative pl-8 sm:pl-10 space-y-8 mt-6">
      
      {/* Vertical Running Thread connecting Day nodes */}
      <div 
        className="absolute left-[15px] sm:left-[19px] top-6 bottom-6 w-[2px] rounded-full" 
        style={{ background: 'linear-gradient(180deg, #e2e8f0 0%, #f1f5f9 100%)' }}
      />

      {activeDays.map((dayData) => {
        const totalDayTasks = dayData.tasks.length;
        const completedDayTasks = dayData.tasks.filter((t) => !!progressMap[t.id]).length;
        const isDayCompleted = totalDayTasks > 0 && totalDayTasks === completedDayTasks;
        const isDayActive = totalDayTasks > 0 && completedDayTasks > 0 && completedDayTasks < totalDayTasks;

        return (
          <div key={dayData.day} className="relative flex flex-col gap-2 items-start w-full">
            
            {/* Timeline Node Circle */}
            <div 
              style={{
                zIndex: 10,
                boxShadow: isDayCompleted 
                  ? '0 3px 10px rgba(16, 185, 129, 0.15)' 
                  : isDayActive 
                  ? '0 3px 10px rgba(99, 102, 241, 0.18)' 
                  : 'none'
              }}
              className={`absolute -left-[25px] sm:-left-[29px] w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-white ${
                isDayCompleted 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                  : isDayActive
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-650'
                  : 'border-slate-200 text-slate-350 bg-white'
              }`}
            >
              {isDayCompleted ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-scale-up">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : isDayActive ? (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              )}
            </div>

            {/* Curriculum Checklist Card */}
            <div className="w-full pl-3">
              <DayCard
                day={dayData.day}
                tasks={dayData.tasks}
                progressMap={progressMap}
                toggleTask={toggleTask}
                disabled={disabled}
              />
            </div>

          </div>
        );
      })}
    </div>
  );
}
