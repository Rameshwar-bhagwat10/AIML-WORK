'use client';

import React from 'react';
import Link from 'next/link';
import { signOutAction } from '@/app/auth/actions';

interface NavItem {
  label: string;
  href: string;
  icon: 'dashboard' | 'roadmap' | 'progress' | 'users' | 'settings' | 'notifications';
}

interface NavSection {
  section: string;
  items: NavItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isClient: boolean;
  isAdmin: boolean;
  pathname: string;
  displayName: string;
  userInitials: string;
  userEmail: string;
}

function getIcon(name: string, color = 'currentColor') {
  switch (name) {
    case 'dashboard':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case 'roadmap':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      );
    case 'progress':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case 'users':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'notifications':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
  }
}

export function Sidebar({
  isCollapsed,
  toggleSidebar,
  isMobileOpen,
  setIsMobileOpen,
  isClient,
  isAdmin,
  pathname,
  displayName,
  userInitials,
  userEmail,
}: SidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const memberNavItems: NavSection[] = [
    {
      section: 'Mail & Workspace',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { label: 'Roadmap', href: '/roadmap', icon: 'roadmap' },
        { label: 'Notifications', href: '/notifications', icon: 'notifications' },
      ],
    },
    {
      section: 'Progress Tracking',
      items: [
        { label: 'My Progress', href: '/progress', icon: 'progress' },
      ],
    },
  ];

  const adminNavItems: NavSection[] = [
    {
      section: 'Control Center',
      items: [
        { label: 'Overview', href: '/admin/dashboard', icon: 'dashboard' },
        { label: 'Users Management', href: '/admin/users', icon: 'users' },
        { label: 'Notifications', href: '/admin/notifications', icon: 'notifications' },
      ],
    },
    {
      section: 'Platform Views',
      items: [
        { label: 'View Roadmap', href: '/roadmap', icon: 'roadmap' },
        { label: 'View Progress', href: '/progress', icon: 'progress' },
      ],
    },
  ];

  const navSections = isAdmin ? adminNavItems : memberNavItems;
  const sidebarWidth = isCollapsed ? '72px' : '240px';

  return (
    <aside
      style={{
        width: sidebarWidth,
        transform: isClient && typeof window !== 'undefined' && window.innerWidth < 768
          ? isMobileOpen ? 'translateX(0)' : 'translateX(-100%)'
          : 'none',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="fixed top-0 bottom-0 left-0 bg-white/95 backdrop-blur-xl flex flex-col z-[250] md:z-[150] h-screen"
    >
      {/* Sidebar Toggle Handle (Desktop only) */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          right: isCollapsed ? '-12px' : '16px',
          top: '25px',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 160,
          boxShadow: 'none',
          border: 'none',
          background: 'transparent',
        }}
        className="hidden md:flex bg-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100/60 hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Top Header Area (Logo Section) */}
      <div className="p-5 flex flex-col" style={{ height: '78px', justifyContent: 'center' }}>
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            className="hover:scale-105 transition-transform duration-200"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col leading-tight animate-sidebar-fade">
              <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', letterSpacing: '-0.025em', fontFamily: "'Outfit', sans-serif" }}>
                {isAdmin ? 'Admin Center' : 'DevRoadmap'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase select-none animate-sidebar-fade">
                {section.section}
              </div>
            )}

            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const horizontalMargin = isCollapsed ? '' : 'mx-4';
                const alignmentClass = isCollapsed ? 'justify-center' : 'justify-start pl-6';
                const activeClass = isActive
                  ? `bg-[#007aff] text-white font-bold shadow-sm shadow-blue-500/10 ${alignmentClass}`
                  : `text-slate-500 hover:bg-slate-100/50 hover:text-slate-900 ${alignmentClass}`;
                return (
                  <li key={itemIdx}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-full transition-all duration-250 group ${activeClass} ${horizontalMargin} ${isCollapsed ? 'sidebar-tooltip' : ''}`}
                      data-tooltip={isCollapsed ? item.label : undefined}
                    >
                      <span className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {getIcon(item.icon, isActive ? '#ffffff' : undefined)}
                      </span>
                      {!isCollapsed && (
                        <span className="text-[0.85rem] tracking-tight animate-sidebar-fade">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User profile section */}
      <div className="p-3.5 bg-slate-50/40">
        {isCollapsed ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowLogoutModal(true);
            }}
            action={signOutAction}
            className="m-0 w-full flex justify-center"
          >
            <button
              type="submit"
              className="cursor-pointer border-0 bg-transparent p-0 flex items-center justify-center sidebar-tooltip"
              data-tooltip="Sign Out"
              style={{ outline: 'none' }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.15)',
                }}
                className="hover:scale-105 transition-transform duration-200"
              >
                {userInitials}
              </div>
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200/50 rounded-[20px] p-3 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(79, 70, 229, 0.15)',
                }}
              >
                {userInitials}
              </div>

              <div className="min-w-0 flex flex-col leading-tight">
                <span className="text-[0.82rem] font-black text-slate-800 truncate" title={displayName}>
                  {displayName}
                </span>
                <span className="text-[9px] text-slate-400 font-bold truncate mt-0.5" title={userEmail}>
                  {userEmail}
                </span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowLogoutModal(true);
              }}
              action={signOutAction}
              className="m-0 flex items-center"
            >
              <button
                type="submit"
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50/80 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
                title="Sign Out"
                style={{ outline: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Custom App Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-white border border-slate-200/50 rounded-[24px] p-6 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col items-center text-center space-y-4"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-lg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-800">Confirm Log Out</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Are you sure you want to end your learning session and log out?
              </p>
            </div>
            <div className="flex items-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-full text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all select-none cursor-pointer"
              >
                Cancel
              </button>
              <form action={signOutAction} className="m-0 flex-1">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full text-xs font-bold border-0 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/10 transition-all select-none cursor-pointer"
                >
                  Log Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
