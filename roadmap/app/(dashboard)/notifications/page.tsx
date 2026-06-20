import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MemberNotificationsList } from '@/components/notifications/member-notifications-list';

export const revalidate = 0; // Disable static rendering

export const metadata: Metadata = {
  title: 'Notifications Hub | DevRoadmap',
  description: 'Stay updated with milestone releases, schedule shifts, and personalized cohort notices.',
};

export default async function MemberNotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  // Fetch initial notifications
  const { data: notificationsData } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          Notifications Hub
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Stay updated with milestone releases, schedule shifts, and personalized cohort notices.
        </p>
      </div>

      <MemberNotificationsList initialNotifications={notificationsData || []} />
    </div>
  );
}
