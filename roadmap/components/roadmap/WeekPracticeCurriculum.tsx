'use client';

import React, { useState } from 'react';
import { WeekView } from './WeekView';
import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

interface Task {
  id: string;
  title: string;
}

interface DayData {
  day: number;
  tasks: Task[];
}

interface WeekPracticeCurriculumProps {
  days: DayData[];
  initialProgressMap?: Record<string, boolean>;
  disabled?: boolean;
}

export function WeekPracticeCurriculum({ days, initialProgressMap, disabled = false }: WeekPracticeCurriculumProps) {
  // Initialize progress hook
  const { progressMap, toggleTask } = useProgress(initialProgressMap);
  const toast = useToast();
  
  // Rating states for Image 3 inspired feature
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [rated, setRated] = useState(false);

  // Flatten tasks to calculate total and completed counts
  const allTasks = days.flatMap((d) => d.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => !!progressMap[t.id]).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggleTask = (taskId: string) => {
    if (disabled) return;
    toggleTask(taskId);
  };

  return (
    <div className="space-y-6">

      {/* Progress Card Section */}
      <div className="rounded-[24px] border border-slate-100 bg-white p-6 space-y-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <span>📈</span> Weekly Practice Progress
            </h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1">
              {disabled ? 'Viewing user progress (Read-Only).' : 'Mark tasks as completed to update your curriculum tracker.'}
            </p>
          </div>
          <div className="text-left sm:text-right flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700">
              Progress: <span className="text-slate-850 font-black">{completedTasks}</span> / {totalTasks} tasks completed
            </span>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/40 px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
              {completionPercentage}% Done
            </span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-slate-50 border border-slate-100/80 rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${completionPercentage}%`, background: 'linear-gradient(90deg, #4f46e5 0%, #818cf8 100%)' }}
          />
        </div>
      </div>

      {/* Week Grid Layout (Vertical Timeline) */}
      <WeekView days={days} progressMap={progressMap} toggleTask={handleToggleTask} disabled={disabled} />

      {/* Interactive Rating Section - Image 3 "Rate this delivery" inspired */}
      <div className="pt-4">
        <div className="rounded-[20px] border border-slate-100 bg-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4 w-full shadow-[0_6px_20px_rgba(0,0,0,0.01)]">
          <div className="text-center sm:text-left space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
              <span>⭐️</span> Rate this curriculum
            </h4>
            <p className="text-[10px] text-slate-450 font-semibold">Help us improve the difficulty balance and clarity of these checkpoints.</p>
          </div>

          {rated ? (
            <div className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-4 py-2 rounded-xl animate-scale-up">
              ✓ Thanks for your rating! ({rating} / 5 stars)
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setRating(star);
                    setRated(true);
                    toast.success(`Thank you for rating this week's curriculum ${star} stars!`, 'Feedback Received');
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 rounded-lg hover:bg-slate-50 transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill={(hoverRating || rating) >= star ? '#fbbf24' : 'none'} 
                    stroke={(hoverRating || rating) >= star ? '#fbbf24' : '#cbd5e1'} 
                    strokeWidth="2.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-all duration-150 transform hover:scale-110 active:scale-95"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
