import React from 'react';
import { TaskItem } from './TaskItem';

interface Task {
  id: string;
  title: string;
}

interface DayCardProps {
  day: number;
  tasks: Task[];
  progressMap: Record<string, boolean>;
  toggleTask: (taskId: string) => void;
  disabled?: boolean;
}

export function DayCard({ day, tasks, progressMap, toggleTask, disabled = false }: DayCardProps) {
  return (
    <div className="rounded-[22px] border border-slate-100 bg-white p-5 flex flex-col gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.006)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.012)] hover:-translate-y-0.5 transition-all duration-300">
      {/* Day Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-50">
        <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-[9px] flex items-center justify-center text-[10px] font-black bg-indigo-50 border border-indigo-100/40 text-indigo-600 select-none">
            D{day}
          </span>
          Day {day}
        </h3>
        <span className="text-[9px] uppercase font-black tracking-wider px-2.5 py-1 rounded-lg border border-slate-200/50 bg-slate-50/50 text-slate-450">
          {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
        </span>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2.5 flex-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              checked={!!progressMap[task.id]}
              onChange={() => toggleTask(task.id)}
              disabled={disabled}
            />
          ))
        ) : (
          <div className="text-xs font-semibold italic py-6 text-center rounded-2xl border border-dashed border-slate-150 text-slate-400 bg-slate-50/30">
            No practice scheduled for today.
          </div>
        )}
      </div>
    </div>
  );
}
