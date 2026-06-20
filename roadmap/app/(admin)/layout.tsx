import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { UserService } from '@/features/users/user.service';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await UserService.getUserById(user.id) : null;
  const displayName = profile?.name || user?.email || 'Admin User';

  return (
    <LayoutWrapper
      user={{
        name: displayName,
        email: user?.email || 'admin@aitracker.com',
      }}
      isAdmin={true}
    >
      {children}
    </LayoutWrapper>
  );
}
