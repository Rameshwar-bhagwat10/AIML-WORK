import React from 'react';

export default function WeekLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Navigation skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded" style={{ background: 'var(--bg-inset)' }}></div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-28 rounded-lg" style={{ background: 'var(--bg-inset)' }}></div>
          <div className="h-8 w-24 rounded-lg" style={{ background: 'var(--bg-inset)' }}></div>
        </div>
      </div>

      {/* Week Header Skeleton */}
      <div className="rounded-2xl p-6 md:p-8 space-y-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        <div className="pb-5 space-y-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="h-3 w-16 rounded" style={{ background: 'rgba(79, 70, 229, 0.1)' }}></div>
          <div className="h-7 w-48 rounded" style={{ background: 'var(--bg-inset)' }}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-28 rounded" style={{ background: 'var(--bg-inset)' }}></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 rounded-lg" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)' }}></div>
                <div className="h-10 rounded-lg" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)' }}></div>
                <div className="h-10 rounded-lg" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)' }}></div>
                <div className="h-10 rounded-lg" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)' }}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-36 rounded" style={{ background: 'var(--bg-inset)' }}></div>
              <div className="flex gap-2">
                <div className="h-7 w-16 rounded-lg" style={{ background: 'var(--bg-inset)' }}></div>
                <div className="h-7 w-20 rounded-lg" style={{ background: 'var(--bg-inset)' }}></div>
                <div className="h-7 w-12 rounded-lg" style={{ background: 'var(--bg-inset)' }}></div>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:border-l md:pl-8" style={{ borderColor: 'var(--border-color)' }}>
            <div className="h-24 rounded-xl" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)' }}></div>
            <div className="h-20 rounded-xl" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-subtle)' }}></div>
          </div>
        </div>
      </div>

      {/* Days grid skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-36 rounded" style={{ background: 'var(--bg-inset)' }}></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl p-5 space-y-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
              <div className="flex justify-between items-center pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div className="h-6 w-20 rounded" style={{ background: 'var(--bg-inset)' }}></div>
                <div className="h-4 w-12 rounded" style={{ background: 'var(--bg-inset)' }}></div>
              </div>
              <div className="space-y-2.5">
                <div className="h-11 rounded-lg" style={{ background: 'var(--bg-inset)' }}></div>
                <div className="h-11 rounded-lg" style={{ background: 'var(--bg-inset)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
