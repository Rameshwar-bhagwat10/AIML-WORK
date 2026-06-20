import React from 'react';

interface TaskItemProps {
  id: string;
  title: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export function TaskItem({ id, title, checked, onChange, disabled = false }: TaskItemProps) {
  return (
    <div 
      id={`task-${id}`}
      className={`flex items-start gap-3.5 rounded-2xl p-4 transition-all duration-300 border ${
        checked 
          ? 'bg-slate-50/30 border-slate-100/50 opacity-60 hover:opacity-75' 
          : 'bg-white border-slate-100 hover:border-indigo-150 hover:shadow-[0_4px_16px_rgba(0,0,0,0.008)] hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center h-5 mt-0.5">
        <button
          type="button"
          disabled={disabled}
          onClick={onChange}
          className={`w-[22px] h-[22px] rounded-lg border-2 flex items-center justify-center transition-all duration-250 focus:outline-none ${
            disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
          } ${
            checked 
              ? 'bg-indigo-600 border-indigo-600 shadow-[0_2px_8px_rgba(79,70,229,0.22)] scale-105' 
              : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 bg-white'
          }`}
          aria-label={checked ? "Mark as uncompleted" : "Mark as completed"}
        >
          {checked && (
            <svg 
              width="11" 
              height="11" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="4.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="animate-scale-up"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      </div>
      <span
        onClick={disabled ? undefined : onChange}
        className={`text-xs select-none leading-relaxed transition-all duration-200 flex-1 pt-0.5 ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${
          checked ? 'line-through text-slate-400 font-semibold' : 'text-slate-700 font-bold hover:text-indigo-650'
        }`}
      >
        {title}
      </span>
    </div>
  );
}
