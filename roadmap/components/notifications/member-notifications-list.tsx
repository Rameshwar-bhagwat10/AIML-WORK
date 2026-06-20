'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PopupNotificationModal } from './popup-notification-modal';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface MemberNotificationsListProps {
  initialNotifications: NotificationItem[];
}

export function MemberNotificationsList({ initialNotifications }: MemberNotificationsListProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotification, setActiveNotification] = useState<NotificationItem | null>(null);

  // Sync state if initialNotifications changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const handleMarkAsRead = async (id: string, currentReadState: boolean) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read_single', id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: !currentReadState } : n))
        );
        // Sync active modal if it matches
        if (activeNotification && activeNotification.id === id) {
          setActiveNotification((prev) => prev ? { ...prev, is_read: !currentReadState } : null);
        }
      }
    } catch (err) {
      console.error('Error toggling notification state:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read_all' }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  // Helper: Relative Date Formatter in iOS style
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Helper: Get Icon & Colors for Categories based on Title/Message keywords
  const getCategoryDetails = (title: string, message: string) => {
    const text = (title + ' ' + message).toLowerCase();
    
    if (text.includes('milestone') || text.includes('roadmap') || text.includes('curriculum')) {
      return {
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
        ),
        bgClass: 'bg-indigo-50 text-indigo-650 border border-indigo-100',
        label: 'Milestone'
      };
    }
    if (text.includes('streak') || text.includes('velocity') || text.includes('accomplish')) {
      return {
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
        bgClass: 'bg-amber-50 text-amber-650 border border-amber-100',
        label: 'Study Metric'
      };
    }
    if (text.includes('welcome') || text.includes('user') || text.includes('profile')) {
      return {
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ),
        bgClass: 'bg-emerald-50 text-emerald-650 border border-emerald-100',
        label: 'Account'
      };
    }
    if (text.includes('system') || text.includes('alert') || text.includes('admin') || text.includes('error')) {
      return {
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        ),
        bgClass: 'bg-rose-50 text-rose-650 border border-rose-100',
        label: 'System Alert'
      };
    }
    
    // Default
    return {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      bgClass: 'bg-blue-50 text-blue-650 border border-blue-100',
      label: 'Notification'
    };
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  // Filtering + Searching logic
  const displayedNotifications = useMemo(() => {
    let list = notifications;

    // Filter tab
    if (filter === 'unread') {
      list = list.filter((n) => !n.is_read);
    } else if (filter === 'read') {
      list = list.filter((n) => n.is_read);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      );
    }

    return list;
  }, [notifications, filter, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* 3 iOS Notification Metrics Widget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Widget 1: Unread notifications */}
        <div className="bg-gradient-to-br from-indigo-50/40 via-white to-indigo-50/10 border border-indigo-100/50 shadow-[0_8px_30px_rgba(99,102,241,0.02)] rounded-[24px] p-5 flex items-center justify-between relative overflow-hidden hover:shadow-[0_12px_40px_rgba(99,102,241,0.05)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unread Logs</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {unreadCount}
              </span>
              {unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50/60 border border-blue-100/50 flex items-center justify-center text-blue-600 relative z-10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          {/* Subtle Bell Outline SVG in Background */}
          <div className="absolute bottom-[-10px] right-[-10px] w-24 h-24 opacity-[0.08] pointer-events-none text-indigo-600">
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        </div>

        {/* Widget 2: Cohort Release Updates */}
        <div className="bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/10 border border-emerald-100/50 shadow-[0_8px_30px_rgba(16,185,129,0.02)] rounded-[24px] p-5 flex items-center justify-between relative overflow-hidden hover:shadow-[0_12px_40px_rgba(16,185,129,0.05)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Log Status</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-emerald-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Live Sync
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50/60 border border-emerald-100/50 flex items-center justify-center text-emerald-600 relative z-10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          {/* Subtle Sync / Earth Waves SVG in Background */}
          <div className="absolute bottom-[-15px] right-[-15px] w-24 h-24 opacity-[0.08] pointer-events-none text-emerald-600">
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
          </div>
        </div>

        {/* Widget 3: Total logs archived */}
        <div className="bg-gradient-to-br from-slate-50/80 via-white to-slate-100/30 border border-slate-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.01)] rounded-[24px] p-5 flex items-center justify-between relative overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Archive</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {notifications.length}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">items</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-500 relative z-10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          {/* Subtle Folder/Archive Stack SVG in Background */}
          <div className="absolute bottom-[-10px] right-[-10px] w-24 h-24 opacity-[0.08] pointer-events-none text-slate-400">
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Interactive Controls (Search & Segment Filters) */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pb-4 border-b border-slate-100/80">
        {/* iOS segmented slider tabs */}
        <div className="bg-slate-50 p-1.5 rounded-full border border-slate-100/60 flex items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-indigo-650 shadow-xs'
                : 'hover:text-slate-700'
            }`}
          >
            All Logs ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              filter === 'unread'
                ? 'bg-white text-indigo-650 shadow-xs'
                : 'hover:text-slate-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              filter === 'read'
                ? 'bg-white text-indigo-650 shadow-xs'
                : 'hover:text-slate-700'
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {/* Live Controls: Search & Mark All */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-full pl-10 pr-8 py-2.5 text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 transition-all duration-200"
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

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 border border-indigo-100/50 text-indigo-650 hover:bg-indigo-100/80 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Mark all read</span>
              <span className="w-4.5 h-4.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-black leading-none">
                {unreadCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Spacious Notification Card Stack */}
      <div className="flex flex-col gap-4">
        {displayedNotifications.map((item) => {
          const category = getCategoryDetails(item.title, item.message);

          return (
            <div
              key={item.id}
              onClick={() => setActiveNotification(item)}
              className={`p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 rounded-[24px] border cursor-pointer group ${
                item.is_read
                  ? 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.012)] hover:-translate-y-0.5'
                  : 'bg-gradient-to-r from-indigo-50/35 via-indigo-50/10 to-transparent border-indigo-150 shadow-[0_12px_30px_rgba(99,102,241,0.02)] hover:-translate-y-0.5'
              }`}
            >
              {/* Main Content Details */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Dynamic Category Icon wrapper */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${category.bgClass}`} title={category.label}>
                  {category.icon}
                </div>

                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Unread indicator dot */}
                    {!item.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 animate-pulse" />
                    )}
                    <h3 className="text-sm font-black text-slate-800 leading-tight">
                      {item.title}
                    </h3>
                    {!item.is_read && (
                      <span className="text-[8px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full select-none leading-none">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-2 max-w-3xl">
                    {item.message}
                  </p>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider select-none">
                    Received {formatRelativeTime(item.created_at)}
                  </span>
                </div>
              </div>

              {/* Action buttons (spacious layout) */}
              <div className="flex items-center justify-end gap-3 self-end md:self-auto flex-shrink-0">
                {/* Mark read/unread toggle circle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(item.id, item.is_read);
                  }}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer bg-transparent shadow-xs hover:scale-105 ${
                    item.is_read
                      ? 'border-emerald-250 text-emerald-600 hover:bg-emerald-50'
                      : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                  title={item.is_read ? 'Mark as unread' : 'Mark as read'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>

                {/* Inspect trigger */}
                <button className="h-9 rounded-full pl-4 pr-3 py-2 text-[10px] font-black uppercase tracking-wider shadow-xs transition-all border-0 cursor-pointer bg-slate-900 text-white hover:bg-slate-800 hover:scale-102 flex items-center gap-1.5 group-hover:bg-slate-800">
                  <span>View</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}

        {displayedNotifications.length === 0 && (
          <div className="text-center py-20 rounded-[28px] bg-slate-50/20 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">📬</span>
            <h4 className="text-sm font-black text-slate-700">All notifications cleared</h4>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              No matching updates in your logs right now. You are fully caught up!
            </p>
          </div>
        )}
      </div>

      {/* Modal Popup Viewer */}
      <PopupNotificationModal
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
        onToggleRead={handleMarkAsRead}
      />
    </div>
  );
}
