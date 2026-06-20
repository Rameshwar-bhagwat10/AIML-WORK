'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface RoadmapCardProps {
  month: string;
  week: string;
  title: string;
  completed: boolean;
  tasksCount: number;
  completedTasksCount: number;
  isUnlocked?: boolean;
  isStudying?: boolean;
}

// Map roadmap-specific tag badges dynamically based on month and week numbers
function getRoadmapTags(monthNum: number, weekNum: number): string[] {
  // Month 1: Python Foundations
  if (monthNum === 1) {
    if (weekNum === 1) return ['Python', 'Basics'];
    if (weekNum === 2) return ['Functions', 'I/O'];
    if (weekNum === 3) return ['NumPy', 'Pandas'];
    if (weekNum === 4) return ['Matplotlib', 'EDA'];
  }
  // Month 2: Mathematics for AI
  if (monthNum === 2) {
    if (weekNum === 1) return ['Descriptive Stats', 'Outliers'];
    if (weekNum === 2) return ['Bayes', 'Probability'];
    if (weekNum === 3) return ['Linear Algebra', 'Vectors'];
    if (weekNum === 4) return ['Calculus', 'G-Descent'];
  }
  // Month 3: Machine Learning
  if (monthNum === 3) {
    if (weekNum === 1) return ['Supervised', 'Regression'];
    if (weekNum === 2) return ['Classification', 'KNN'];
    if (weekNum === 3) return ['Random Forest', 'XGBoost'];
    if (weekNum === 4) return ['Clustering', 'PCA'];
  }
  // Month 4: Deep Learning
  if (monthNum === 4) {
    if (weekNum === 1) return ['Neural Nets', 'PyTorch'];
    if (weekNum === 2) return ['CNN', 'ResNet'];
    if (weekNum === 3) return ['NLP', 'Embeddings'];
    if (weekNum === 4) return ['Transformers', 'Deployment'];
  }
  // Month 5: Generative AI
  if (monthNum === 5) {
    if (weekNum === 1) return ['LLMs', 'Prompt Eng'];
    if (weekNum === 2) return ['RAG', 'Vector DB'];
    if (weekNum === 3) return ['AI Agents', 'Function Call'];
    if (weekNum === 4) return ['FastAPI', 'Docker'];
  }
  // Month 6: Job Prep
  if (monthNum === 6) {
    if (weekNum === 1) return ['ATS Resume', 'GitHub'];
    if (weekNum === 2) return ['LinkedIn', 'Networking'];
    if (weekNum === 3) return ['SQL', 'System Design'];
    if (weekNum === 4) return ['Mock Interviews', 'Prep'];
  }
  return ['Syllabus', 'Practice'];
}

export function RoadmapCard({
  month,
  week,
  title,
  completed,
  tasksCount,
  completedTasksCount,
  isUnlocked = true,
  isStudying = false,
}: RoadmapCardProps) {
  const percent = tasksCount > 0 ? Math.round((completedTasksCount / tasksCount) * 100) : 0;
  
  // Resolve month and week numbers
  const monthNumStr = month.match(/\d+/) ? month.match(/\d+/)![0] : '1';
  const weekNumStr = week.replace(/\D/g, '') || '1';
  const mIndex = parseInt(monthNumStr, 10);
  const wIndex = parseInt(weekNumStr, 10);

  // Assign visual icon based on month
  const getSubjectIcon = (monthStr: string) => {
    const lower = monthStr.toLowerCase();
    if (lower.includes('python') || lower.includes('programming') || lower.includes('1')) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" stroke="#f43f5e" fill="#fff1f2" strokeWidth="2" />
          <path d="M12 7v10M8 12h8" stroke="#f43f5e" strokeWidth="2" />
        </svg>
      );
    }
    if (lower.includes('math') || lower.includes('data') || lower.includes('2')) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" stroke="#3b82f6" fill="#eff6ff" strokeWidth="2" />
          <polyline points="9 15 12 9 15 15" stroke="#3b82f6" strokeWidth="2" />
        </svg>
      );
    }
    if (lower.includes('machine') || lower.includes('model') || lower.includes('3')) {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" stroke="#10b981" fill="#ecfdf5" strokeWidth="2" />
          <path d="M9.5 9.5c.5-.5 1.5-.5 2 0l.5.5.5-.5c.5-.5 1.5-.5 2 0v2.5l-2.5 2.5-2.5-2.5v-2.5z" fill="#10b981" />
        </svg>
      );
    }
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="#f59e0b" fill="#fef3c7" strokeWidth="2" />
        <path d="M12 8v8" stroke="#f59e0b" />
      </svg>
    );
  };

  // Assign difficulty dynamically
  let difficulty = 'Intermediate';
  if (wIndex <= 4) {
    difficulty = 'Beginner';
  } else if (wIndex >= 12) {
    difficulty = 'Advanced';
  }

  // Get dynamic tags based on actual scientific topics
  const roadmapTags = getRoadmapTags(mIndex, wIndex);

  // iOS Light Design Color styles matching the background
  const cardBorderClass = isStudying
    ? 'border-indigo-200 bg-gradient-to-br from-indigo-50/75 via-white to-blue-50/20 shadow-[0_8px_30px_rgb(99,102,241,0.06)]'
    : isUnlocked === false
    ? 'border-slate-100 bg-slate-50/20 opacity-75'
    : 'border-slate-100 bg-white shadow-[0_6px_20px_rgb(0,0,0,0.01)]';

  const cardShadowStyle = isStudying
    ? { boxShadow: '0 8px 25px -5px rgba(99, 102, 241, 0.08), 0 4px 10px -2px rgba(99, 102, 241, 0.04)' }
    : { boxShadow: '0 6px 20px -2px rgba(0, 0, 0, 0.01), 0 2px 6px -1px rgba(0, 0, 0, 0.005)' };

  return (
    <Card 
      glass 
      className={`animate-fade-in p-6 flex flex-col gap-4 transition-all duration-300 ${
        isUnlocked !== false ? 'hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.03)]' : ''
      } border rounded-[24px] relative group overflow-hidden ${cardBorderClass}`}
      style={cardShadowStyle}
    >
      {/* Current Focus Highlight Ribbon Banner */}
      {isStudying && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-indigo-500 text-white font-black text-[9px] px-3 py-1.5 rounded-bl-xl tracking-wider uppercase flex items-center gap-1 shadow-sm select-none z-10">
          <span>📚</span> Current Focus
        </div>
      )}

      {/* Top Header Row (Logo Circle only) */}
      <div className="flex justify-between items-center w-full">
        <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center bg-white shadow-sm flex-shrink-0">
          {getSubjectIcon(month)}
        </div>
      </div>

      {/* Corporate Subtitle / Meta info */}
      <div className="space-y-1">
        <span className={`text-[10px] font-extrabold tracking-wider uppercase block ${
          isStudying ? 'text-indigo-600' : 'text-slate-400'
        }`}>
          Month {monthNumStr}  •  {difficulty}
        </span>
        
        <h3 className={`text-[14px] font-bold text-slate-800 leading-snug tracking-tight transition-colors line-clamp-2 ${
          isUnlocked !== false ? 'group-hover:text-indigo-600' : ''
        }`}>
          {title}
        </h3>
      </div>

      {/* Dynamic scientific topic tags */}
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {roadmapTags.map((tag, i) => (
          <span 
            key={i} 
            className={`text-[9px] font-extrabold px-2.5 py-1 rounded-lg border ${
              isStudying 
                ? 'bg-indigo-50/40 border-indigo-100/30 text-indigo-600/90' 
                : 'bg-slate-50 border-slate-100 text-slate-500'
            }`}
          >
            {tag}
          </span>
        ))}
        
        {/* Dynamic status badge (only for unlocked, no Locked badges) */}
        {isUnlocked !== false && (
          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
            completed 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
              : 'bg-amber-50 border-amber-100 text-amber-700'
          }`}>
            {completed ? '✓ Done' : '⚡ Active'}
          </span>
        )}
      </div>

      {/* Premium iOS progress bar */}
      <div className="w-full h-1.5 bg-slate-50/80 border border-slate-100 rounded-full overflow-hidden mt-1 relative">
        <div 
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${isUnlocked === false ? 0 : percent}%`, 
            background: completed 
              ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
              : 'linear-gradient(90deg, #4f46e5 0%, #818cf8 100%)' 
          }}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-slate-50 my-1 w-full" />

      {/* Footer Details */}
      <div className="flex justify-between items-center w-full mt-0.5">
        <div className="leading-tight">
          <span className="text-[13px] font-black text-slate-800 block">
            {isUnlocked === false ? '0% Completed' : `${percent}% Completed`}
          </span>
          <span className={`text-[9px] font-extrabold uppercase tracking-wider block mt-0.5 ${
            isUnlocked === false ? 'text-slate-400' : 'text-slate-450'
          }`}>
            {isUnlocked === false ? 'Complete previous work' : `${completedTasksCount}/${tasksCount} Checkpoints`}
          </span>
        </div>

        <Link href={`/roadmap/${monthNumStr}/${weekNumStr}`}>
          <button
            className={`rounded-full px-5 py-2.5 text-[11px] font-bold transition-all border-0 cursor-pointer shadow-sm ${
              isUnlocked === false
                ? 'bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-650 flex items-center gap-1'
                : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-102 flex items-center gap-1'
            }`}
          >
            {isUnlocked === false ? (
              <>
                <span className="text-[10px]">🔒</span> Preview
              </>
            ) : (
              'Study now'
            )}
          </button>
        </Link>
      </div>

    </Card>
  );
}
