'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface LeaderboardMember {
  userId: string;
  userName: string;
  completionRate: number;
  completedMilestones: number;
  totalMilestones: number;
}

interface LeaderboardStandingProps {
  sortedLeaderboard: LeaderboardMember[];
  currentUserId?: string;
  isAdmin: boolean;
}

export function LeaderboardStanding({
  sortedLeaderboard,
  currentUserId,
  isAdmin,
}: LeaderboardStandingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'top' | 'mine'>('all');

  // Determine rank of the current user
  const myRankIndex = useMemo(() => {
    return sortedLeaderboard.findIndex(m => m.userId === currentUserId);
  }, [sortedLeaderboard, currentUserId]);

  // Filtered members based on search query & selected tab
  const displayedMembers = useMemo(() => {
    let list = sortedLeaderboard.map((m, idx) => ({ ...m, rank: idx + 1 }));

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => m.userName.toLowerCase().includes(q));
    }

    // Apply tab filter
    if (activeTab === 'top') {
      list = list.filter(m => m.completionRate >= 50);
    } else if (activeTab === 'mine' && myRankIndex !== -1) {
      // Show my rank + 2 ranks above and below
      const start = Math.max(0, myRankIndex - 2);
      const end = Math.min(sortedLeaderboard.length, myRankIndex + 3);
      const sublistIds = new Set(
        sortedLeaderboard.slice(start, end).map(m => m.userId)
      );
      list = list.filter(m => sublistIds.has(m.userId));
    }

    return list;
  }, [sortedLeaderboard, searchQuery, activeTab, myRankIndex]);

  // Deterministic avatar gradient
  const getAvatarGrad = (name: string) => {
    const charCodeSum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const grads = [
      'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
      'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    ];
    return grads[charCodeSum % grads.length];
  };

  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="flex items-center justify-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/50 shadow-sm animate-pulse">
          🥇 <span>1st</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex items-center justify-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full bg-slate-55 text-slate-700 border border-slate-200/50 shadow-sm">
          🥈 <span>2nd</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex items-center justify-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full bg-orange-50/50 text-orange-850 border border-orange-200/30 shadow-sm">
          🥉 <span>3rd</span>
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center text-xs font-extrabold w-8 h-8 rounded-full bg-slate-50 border border-slate-100 text-slate-400">
        #{rank}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section with titles, search, and filters */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 pb-4 border-b border-slate-100/80">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Leaderboard Standings
          </h2>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
            Compare study velocity and curriculum milestones
          </p>
        </div>

        {/* Live Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          {/* iOS Style Search Input */}
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search cohort member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-100 rounded-full pl-10 pr-8 py-2.5 text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Segmented Selector Tabs */}
          <div className="bg-slate-50 p-1.5 rounded-full border border-slate-100/60 flex items-center text-[10px] font-black uppercase tracking-wider text-slate-500 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-indigo-650 shadow-xs'
                  : 'hover:text-slate-700'
              }`}
            >
              All Members
            </button>
            <button
              onClick={() => setActiveTab('top')}
              className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'top'
                  ? 'bg-white text-indigo-650 shadow-xs'
                  : 'hover:text-slate-700'
              }`}
            >
              Top Performers
            </button>
            {currentUserId && !isAdmin && (
              <button
                onClick={() => setActiveTab('mine')}
                className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                  activeTab === 'mine'
                    ? 'bg-white text-indigo-650 shadow-xs'
                    : 'hover:text-slate-700'
                }`}
              >
                My Standing
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Spacious Card List Container */}
      <div className="flex flex-col gap-4">
        {displayedMembers.map((member) => {
          const isMe = member.userId === currentUserId;
          
          // Determine status badges and colors
          let statusLabel = 'Starting';
          let statusClass = 'bg-slate-50/50 border-slate-100 text-slate-500';
          let statusIcon = (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <circle cx="12" cy="12" r="10" />
            </svg>
          );
          
          if (member.completionRate >= 80) {
            statusLabel = 'Mastery';
            statusClass = 'bg-emerald-50 border-emerald-100/40 text-emerald-700';
            statusIcon = (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            );
          } else if (member.completionRate >= 50) {
            statusLabel = 'Advanced';
            statusClass = 'bg-indigo-50 border-indigo-100/40 text-indigo-750';
            statusIcon = (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            );
          } else if (member.completionRate >= 10) {
            statusLabel = 'Progressing';
            statusClass = 'bg-amber-50 border-amber-100/40 text-amber-700';
            statusIcon = (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            );
          }

          return (
            <div
              key={member.userId}
              className={`p-5 md:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all duration-300 rounded-[24px] border ${
                isMe
                  ? 'bg-gradient-to-r from-indigo-50/35 via-indigo-50/10 to-transparent border-indigo-200/80 shadow-[0_12px_30px_rgba(99,102,241,0.03)]'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.015)] hover:-translate-y-0.5'
              }`}
            >
              {/* Profile details */}
              <div className="flex items-center gap-5 flex-1 min-w-0">
                {/* Rank indicator */}
                <div className="flex-shrink-0 w-16 flex justify-start">
                  {renderRankBadge(member.rank)}
                </div>

                {/* Avatar with deterministic gradient scale */}
                <div
                  style={{ background: getAvatarGrad(member.userName) }}
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-sm shadow-md border-2 border-white flex-shrink-0 hover:scale-105 transition-transform select-none"
                >
                  {member.userName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 space-y-1">
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-2 truncate">
                    {member.userName}
                    {isMe && (
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100/40 text-indigo-650 select-none animate-pulse">
                        You
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span>{member.completedMilestones} completed</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{member.totalMilestones} total milestones</span>
                  </div>
                </div>
              </div>

              {/* Progress and status indicators */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-6 w-full lg:w-3/5">
                
                {/* Progress bar column */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex justify-between items-baseline text-xs font-bold text-slate-400">
                    <span>Curriculum Coverage</span>
                    <span className="font-extrabold text-slate-800">{member.completionRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-650 via-indigo-500 to-indigo-400 transition-all duration-700"
                      style={{ width: `${member.completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Status indicator column */}
                <div className="flex items-center justify-between sm:justify-start gap-4">
                  <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${statusClass}`}>
                    {statusIcon}
                    <span>{statusLabel}</span>
                  </div>

                  {/* Inspect action trigger */}
                  <Link href={`/progress/${member.userId}`} className="flex-shrink-0">
                    <button
                      className={`rounded-full pl-5 pr-4 py-3 text-[10px] font-black uppercase tracking-wider shadow-sm transition-all border border-transparent cursor-pointer flex items-center gap-2 group/btn ${
                        isMe
                          ? 'bg-indigo-50 text-indigo-650 hover:bg-indigo-100/80'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <span>Inspect</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-0.5 transition-transform duration-200">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          );
        })}

        {displayedMembers.length === 0 && (
          <div className="text-center py-20 rounded-[28px] bg-slate-50/20 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">🔍</span>
            <h4 className="text-sm font-black text-slate-700">No members match your criteria</h4>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Try adjusting your search terms or selecting a different filter tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
