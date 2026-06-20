import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { UserService } from '@/features/users/user.service';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await UserService.getUserById(user.id) : null;
  const displayName = profile?.name || user?.email || 'Cohort User';

  return (
    <LayoutWrapper
      user={{
        name: displayName,
        email: user?.email || 'member@aitracker.com',
      }}
      isAdmin={false}
    >
      {children}
    </LayoutWrapper>
  );
}
