import React from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AdminNotifications } from '@/components/admin/admin-notifications';

export const metadata: Metadata = {
  title: 'Admin Notifications Dashboard | DevRoadmap',
  description: 'Broadcast milestone updates or send direct instructions to individual students.',
};

export default async function AdminNotificationsPage() {
  const supabase = await createClient();

  // Fetch cohort members and historical sent notifications concurrently
  const [membersRes, notificationsRes] = await Promise.all([
    supabase
      .from('users')
      .select('id, name, email')
      .eq('role', 'member')
      .order('name', { ascending: true }),
    supabase
      .from('notifications')
      .select(`
        id,
        title,
        message,
        is_read,
        created_at,
        user_id,
        users:user_id (name, email)
      `)
      .order('created_at', { ascending: false })
  ]);

  const membersList = membersRes.data || [];
  const notificationsList = (notificationsRes.data || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    is_read: n.is_read,
    created_at: n.created_at,
    user_id: n.user_id,
    users: n.users ? { name: n.users.name, email: n.users.email } : null
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          Notifications Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Broadcast milestone updates or send direct instructions to individual students.
        </p>
      </div>

      <AdminNotifications 
        members={membersList} 
        initialNotifications={notificationsList} 
      />
    </div>
  );
}
