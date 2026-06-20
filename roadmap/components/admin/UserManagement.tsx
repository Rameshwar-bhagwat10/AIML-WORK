'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/progress/progress-bar';
import { useToast } from '@/components/ui/toast';

interface UserProgressData {
  userId: string;
  userName: string;
  completionRate: number;
  completedMilestones: number;
  totalMilestones: number;
  role?: 'admin' | 'member';
}

interface UserManagementProps {
  users: UserProgressData[];
}

export function UserManagement({ users }: UserManagementProps) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'member' | 'admin'>('member');

  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<{ id: string; name: string } | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      toast.success(`User "${name || email}" successfully registered.`, 'User Created');
      setEmail('');
      setPassword('');
      setName('');
      setRole('member');
      setShowAddForm(false);
      
      // Refresh the page data
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred.', 'Error Creating User');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUserClick = (userId: string, userName: string) => {
    setDeleteConfirmUser({ id: userId, name: userName });
  };

  const executeDeleteUser = async (userId: string, userName: string) => {
    setDeletingId(userId);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      toast.success(`User "${userName}" successfully deleted.`, 'User Deleted');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during deletion.', 'Error Deleting User');
    } finally {
      setDeletingId(null);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-inset)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '10px 16px',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
  };

  return (
    <div className="space-y-6">

      {/* Top action header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          👥 Active cohort members ({users.length})
        </h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="font-semibold text-xs py-2.5 px-4 rounded-xl transition-all"
          style={{ background: 'var(--primary)', color: 'var(--text-on-accent)' }}
        >
          {showAddForm ? 'Close Registration Form' : '➕ Register New User'}
        </Button>
      </div>

      {/* User Creation Section */}
      {showAddForm && (
        <Card className="rounded-2xl p-5 md:p-6 animate-fade-in" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>New Cohort Member Registration</h3>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Alex Smith"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="alex@example.com"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Temporary Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Access Level Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'member' | 'admin')}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="member">Member (Regular Cohort Access)</option>
                <option value="admin">Admin (System Controls Access)</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
                className="py-2 px-4 text-xs font-semibold rounded-lg transition-colors border-0"
                style={{ background: 'transparent', color: 'var(--text-muted)' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="py-2.5 px-5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                style={{ background: 'var(--primary)', color: 'var(--text-on-accent)' }}
              >
                {loading && (
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" style={{ color: 'var(--text-on-accent)' }}>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Register Account
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Cohort Users Table */}
      <Card className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-inset)' }}>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Name / Email</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>System Role</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider w-1/3" style={{ color: 'var(--text-muted)' }}>Milestone Progress</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-right" style={{ color: 'var(--text-muted)' }}>Administrative Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} className="transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.userName}</span>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{user.userId}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded" style={{
                      background: user.role === 'admin' ? 'var(--primary-light)' : 'var(--bg-inset)',
                      border: `1px solid ${user.role === 'admin' ? 'rgba(79, 70, 229, 0.15)' : 'var(--border-color)'}`,
                      color: user.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
                    }}>
                      {user.role || 'member'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                        <span>Tasks: {user.completedMilestones}/{user.totalMilestones}</span>
                        <span>{user.completionRate}%</span>
                      </div>
                      <ProgressBar value={user.completionRate} showLabel={false} height={4} />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      onClick={() => handleDeleteUserClick(user.userId, user.userName)}
                      disabled={deletingId === user.userId}
                      variant="danger"
                      size="sm"
                      className="py-1.5 px-3 rounded-lg text-xs font-semibold"
                    >
                      {deletingId === user.userId ? 'Deleting...' : 'Delete'}
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-sm italic" style={{ color: 'var(--text-muted)' }}>
                    No registered cohort members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Custom User Deletion Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-white border border-slate-200/50 rounded-[24px] p-6 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col items-center text-center space-y-4 animate-scale-up"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-lg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-800">Delete Cohort Member</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Are you absolutely sure you want to delete user <strong className="text-slate-700">"{deleteConfirmUser.name}"</strong>? This will erase all their progress logs permanently.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 py-2.5 rounded-full text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 transition-all select-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const targetUser = deleteConfirmUser;
                  setDeleteConfirmUser(null);
                  await executeDeleteUser(targetUser.id, targetUser.name);
                }}
                className="flex-1 py-2.5 rounded-full text-xs font-bold border-0 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/10 transition-all select-none cursor-pointer"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
