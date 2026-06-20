import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ProgressService } from '@/features/progress/progress.service';
import { ProgressBar } from '@/components/progress/progress-bar';

export default async function AdminDashboardPage() {
  const groupProgress = await ProgressService.getGroupProgress();
  const totalUsers = groupProgress.length;
  const averageProgress = totalUsers > 0 
    ? Math.round(groupProgress.reduce((sum, u) => sum + u.completionRate, 0) / totalUsers)
    : 0;

  // Active users: completed at least one task
  const activeUsers = groupProgress.filter(u => u.completedMilestones > 0).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          Overview Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          System health and cohort analytics overview.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-2xl flex flex-col justify-between h-40" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Total Cohort Members
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black" style={{ color: 'var(--primary)' }}>{totalUsers}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>users registered</span>
          </div>
          <Link href="/admin/users" className="text-xs font-semibold transition-colors" style={{ color: 'var(--primary)' }}>
            Manage members &rarr;
          </Link>
        </Card>

        <Card className="p-6 rounded-2xl flex flex-col justify-between h-40" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Average Completion
          </span>
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-4xl font-black" style={{ color: 'var(--success)' }}>{averageProgress}%</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>cohort average</span>
            </div>
            <ProgressBar value={averageProgress} showLabel={false} height={5} />
          </div>
        </Card>

        <Card className="p-6 rounded-2xl flex flex-col justify-between h-40" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Active Learners
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black" style={{ color: '#d97706' }}>{activeUsers}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>of {totalUsers} engaged ({totalUsers > 0 ? Math.round(activeUsers/totalUsers*100) : 0}%)</span>
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Completed at least 1 milestone</span>
        </Card>
      </div>

      {/* Detailed Leaderboard list in Admin Dashboard */}
      <div className="rounded-2xl p-6 space-y-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          🏆 Cohort Standings
        </h2>
        <div className="space-y-4">
          {groupProgress
            .sort((a, b) => b.completionRate - a.completionRate)
            .map((member, idx) => (
              <div key={member.userId} className="flex items-center justify-between pb-3 last:border-0 last:pb-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded w-6 text-center" style={{ color: 'var(--text-muted)', background: 'var(--bg-inset)', border: '1px solid var(--border-color)' }}>
                    #{idx + 1}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{member.userName}</span>
                </div>
                <div className="flex items-center gap-4 w-1/2 justify-end">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    {member.completedMilestones}/{member.totalMilestones} Tasks
                  </span>
                  <span className="text-sm font-bold w-12 text-right" style={{ color: 'var(--text-primary)' }}>
                    {member.completionRate}%
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
