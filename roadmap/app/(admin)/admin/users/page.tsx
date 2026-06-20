import React from 'react';
import { ProgressService } from '@/features/progress/progress.service';
import { UserManagement } from '@/components/admin/UserManagement';

export default async function AdminUsersPage() {
  const groupProgress = await ProgressService.getGroupProgress();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          User Management
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Create, register, and delete learning cohort members.
        </p>
      </div>

      <UserManagement users={groupProgress} />
    </div>
  );
}
