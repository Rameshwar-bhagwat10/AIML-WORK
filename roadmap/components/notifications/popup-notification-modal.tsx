'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface PopupNotificationModalProps {
  notification: NotificationItem | null;
  onClose: () => void;
  onToggleRead: (id: string, currentReadState: boolean) => void;
}

export function PopupNotificationModal({
  notification,
  onClose,
  onToggleRead,
}: PopupNotificationModalProps) {
  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      {/* Glass backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300"
      />
      
      {/* Modal Dialog */}
      <Card 
        glass
        className="relative w-full max-w-md p-6 overflow-hidden shadow-[0_24px_50px_-12px_rgba(0,0,0,0.1)] animate-scale-up flex flex-col gap-5 border border-slate-100 bg-white/95 rounded-[32px]"
      >
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400" />
        
        {/* Header */}
        <div className="flex justify-between items-center pt-2">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
            notification.is_read 
              ? 'bg-slate-50 text-slate-400 border border-slate-150' 
              : 'bg-indigo-50 text-indigo-650 border border-indigo-100'
          }`}>
            {notification.is_read ? '✓ Read' : '● Unread Update'}
          </span>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all border-0 bg-transparent cursor-pointer flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-black text-slate-800 tracking-tight leading-snug" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {notification.title}
          </h3>
          <p className="text-xs text-slate-650 leading-relaxed bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100/60 select-text font-semibold whitespace-pre-wrap">
            {notification.message}
          </p>
        </div>

        {/* Footer info & action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 mt-1">
          <div className="leading-tight">
            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Timestamp</span>
            <span className="text-[10px] font-extrabold text-slate-500 block mt-0.5">
              {new Date(notification.created_at).toLocaleString()}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onToggleRead(notification.id, notification.is_read);
                onClose();
              }}
              className={`rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-wider shadow-sm transition-all border cursor-pointer ${
                notification.is_read
                  ? 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent'
              }`}
            >
              {notification.is_read ? 'Mark as Unread' : 'Mark as Read'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
