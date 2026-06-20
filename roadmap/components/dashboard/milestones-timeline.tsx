import React from 'react';
import Link from 'next/link';

export function NextMilestonesTimeline() {
  return (
    <div 
      className="bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-300 space-y-5"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-[1.1rem] font-bold text-slate-900 flex items-center gap-2.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <div className="bg-indigo-50 border border-indigo-100/50 text-indigo-600 rounded-[12px] p-1.5 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          Next Milestones
        </h3>
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Timeline</span>
      </div>

      {/* Vertical timeline items */}
      <div className="relative pl-6 space-y-6 border-l-2 border-slate-100">
        {/* Timeline item 1 */}
        <div className="relative">
          {/* Node marker dot */}
          <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white flex items-center justify-center shadow-[0_2px_4px_rgba(79,70,229,0.2)]" />
          <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">COMING NEXT WEEK</span>
          <h4 className="text-[13px] font-extrabold text-slate-800 mt-1">Supervised Learning Algorithms</h4>
          <p className="text-[11.5px] text-slate-400 font-semibold mt-1 leading-relaxed">Linear regression, SGD classifiers, and regularization loss functions.</p>
        </div>

        {/* Timeline item 2 */}
        <div className="relative">
          {/* Node marker dot */}
          <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white flex items-center justify-center shadow-sm" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">WEEK 4</span>
          <h4 className="text-[13px] font-extrabold text-slate-700 mt-1">Unsupervised Algorithms & Clustering</h4>
          <p className="text-[11.5px] text-slate-400 font-semibold mt-1 leading-relaxed">K-Means clustering, PCA dimensionality reduction, and anomaly metrics.</p>
        </div>

        {/* Timeline item 3 */}
        <div className="relative">
          {/* Node marker dot */}
          <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white flex items-center justify-center shadow-sm" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">MONTH 2</span>
          <h4 className="text-[13px] font-extrabold text-slate-700 mt-1">Neural Network Foundations</h4>
          <p className="text-[11.5px] text-slate-400 font-semibold mt-1 leading-relaxed">Introduction to PyTorch tensors, activations, and backpropagation models.</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-center">
        <Link href="/progress" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
          View Cohort Analytics leaderboard →
        </Link>
      </div>
    </div>
  );
}
