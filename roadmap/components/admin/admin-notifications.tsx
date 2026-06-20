'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface Member {
  id: string;
  name: string;
  email: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user_id: string;
  users: {
    name: string;
    email: string;
  } | null;
}

interface AdminNotificationsProps {
  members: Member[];
  initialNotifications: NotificationItem[];
}

export function AdminNotifications({ members, initialNotifications }: AdminNotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [recipientType, setRecipientType] = useState<'all' | 'single'>('all');
  const [recipientId, setRecipientId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          recipientType,
          recipientId: recipientType === 'single' ? recipientId : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Notification sent successfully to recipients!', 'Message Sent');
        setTitle('');
        setMessage('');
        setRecipientId('');
        
        // Refresh notifications log
        const refreshRes = await fetch('/api/notifications');
        if (refreshRes.ok) {
          const freshData = await refreshRes.json();
          setNotifications(freshData);
        }
      } else {
        toast.error(data.error || 'Failed to send notification', 'Broadcast Error');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred', 'Broadcast Error');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Notification Form (5 Cols) */}
      <form onSubmit={handleSend} className="lg:col-span-5 flex flex-col gap-5">
        <Card glass className="p-6" style={{ gap: '1.25rem' }}>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Broadcast Message</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Send roadmap updates or general notifications to your cohort.</p>
          </div>

          {/* Recipient Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipient Target</label>
            <select
              value={recipientType}
              onChange={(e) => {
                const val = e.target.value as 'all' | 'single';
                setRecipientType(val);
                if (val === 'all') setRecipientId('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="all">📢 All Cohort Members (Broadcast)</option>
              <option value="single">👤 Specific Student (Direct Message)</option>
            </select>
          </div>

          {/* Member Selection (only visible if single recipient is selected) */}
          {recipientType === 'single' && (
            <div className="flex flex-col gap-1.5 animate-slide-up">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Student</label>
              <select
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Choose Member --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notification Title</label>
            <input
              type="text"
              placeholder="e.g. New Milestone Released"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Message Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Content</label>
            <textarea
              placeholder="Enter message details here..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              style={{ fontFamily: 'inherit' }}
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading || (recipientType === 'single' && !recipientId)} 
            className="w-full py-2.5 font-bold uppercase tracking-wider text-xs"
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </Button>

        </Card>
      </form>

      {/* Right Column: Sent Notifications History (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Delivery History</h2>
          <span className="text-xs font-semibold text-slate-400">Total sent: {notifications.length} logs</span>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {notifications.map((item) => {
            const recipientName = item.users?.name || 'Unknown User';
            const recipientEmail = item.users?.email || '';
            const initial = recipientName.charAt(0).toUpperCase();

            return (
              <Card 
                key={item.id} 
                glass 
                style={{ padding: '1rem 1.25rem', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
                className="hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  {/* Left part: Title & content */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-800 leading-tight truncate max-w-[200px]">{item.title}</h3>
                      <span className={`badge-status text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.is_read ? 'badge-mastery' : 'badge-progressing'
                      }`}>
                        {item.is_read ? '✓ Read' : '○ Unread'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-md">{item.message}</p>
                    <span className="text-[9px] text-slate-400 font-semibold block">
                      Sent at: {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Right part: Recipient Avatar info */}
                  <div className="flex items-center gap-2.5 pl-0 md:pl-3 border-0 md:border-l border-slate-200/80 flex-shrink-0 w-full md:w-auto">
                    <div style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      background: getAvatarGrad(recipientName), 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      color: 'white'
                    }}>
                      {initial}
                    </div>
                    <div className="text-left leading-none min-w-0">
                      <h4 className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{recipientName}</h4>
                      <span className="text-[9px] text-slate-400 truncate max-w-[120px] block mt-0.5">{recipientEmail}</span>
                    </div>
                  </div>

                </div>
              </Card>
            );
          })}

          {notifications.length === 0 && (
            <div className="text-center py-16 rounded-2xl" style={{ border: '1px dashed var(--border-color)', background: 'var(--bg-inset)' }}>
              <span className="text-3xl">📨</span>
              <p className="text-sm mt-3 font-semibold" style={{ color: 'var(--text-muted)' }}>No notifications sent yet.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
