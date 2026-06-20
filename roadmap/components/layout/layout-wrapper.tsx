'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PopupNotificationModal } from '@/components/notifications/popup-notification-modal';
import { useToast } from '@/components/ui/toast';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface LayoutWrapperProps {
  user: {
    name: string;
    email: string;
  } | null;
  isAdmin: boolean;
  children: React.ReactNode;
}

interface SearchResult {
  type: string;
  title: string;
  subtitle: string;
  url: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function LayoutWrapper({ user, isAdmin, children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const toast = useToast();

  // Search suggestions states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification states
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [selectedNotificationForModal, setSelectedNotificationForModal] = useState<NotificationItem | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Handle client-side initialization
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Handle toast notifications after client is initialized and hydrated
  useEffect(() => {
    if (!isClient) return;

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === 'success') {
        toast.success('Signed in successfully. Welcome back!', 'Welcome');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [isClient, toast]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = (await res.json()) as NotificationItem[];
        const unread = data.filter((n: NotificationItem) => !n.is_read).length;
        setNotifications(data);
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  // Fetch notifications dynamically on mount and route changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll notifications every 30 seconds for live updates
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, pathname]);

  // Close dropdowns on outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationPopup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight matching keyword text inside suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;
    const escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-indigo-100 text-indigo-900 rounded px-0.5 font-bold">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Handle keyword searching with auto suggestions
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setFocusedIndex(-1);
    
    if (value.trim().length >= 2) {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  // Handle keyboard selections in suggestions dropdown
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchDropdown || searchResults.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      if (focusedIndex >= 0 && focusedIndex < searchResults.length) {
        e.preventDefault();
        const target = searchResults[focusedIndex];
        setSearchQuery('');
        setShowSearchDropdown(false);
        setFocusedIndex(-1);
        setShowMobileSearch(false);
        router.push(target.url);
      }
    } else if (e.key === 'Escape') {
      setShowSearchDropdown(false);
      setFocusedIndex(-1);
    }
  };

  // Mark specific notification as read in Supabase
  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read_single', id })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  // Mark all notifications as read in Supabase
  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read_all' })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newState));
    }
  };

  const displayName = user?.name || user?.email || (isAdmin ? 'Admin User' : 'Cohort User');
  const userInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sidebarWidth = isCollapsed ? '72px' : '240px';

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-800 font-sans">
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-955/40 backdrop-blur-xs z-[200] md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isClient={isClient}
        isAdmin={isAdmin}
        pathname={pathname}
        displayName={displayName}
        userInitials={userInitials}
        userEmail={user?.email || ''}
      />

      {/* Main Container */}
      <div
        style={{
          paddingLeft: isClient && typeof window !== 'undefined' && window.innerWidth >= 768
            ? sidebarWidth
            : '0px',
          transition: 'padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="flex-1 flex flex-col min-w-0 h-full overflow-hidden"
      >
        {/* Top Header */}
        <Header
          isAdmin={isAdmin}
          displayName={displayName}
          userInitials={userInitials}
          unreadCount={unreadCount}
          notifications={notifications}
          showMobileSearch={showMobileSearch}
          setShowMobileSearch={setShowMobileSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          showSearchDropdown={showSearchDropdown}
          setShowSearchDropdown={setShowSearchDropdown}
          focusedIndex={focusedIndex}
          isSearching={isSearching}
          showNotificationPopup={showNotificationPopup}
          setShowNotificationPopup={setShowNotificationPopup}
          searchRef={searchRef}
          notificationRef={notificationRef}
          handleMarkAsRead={handleMarkAsRead}
          handleMarkAllAsRead={handleMarkAllAsRead}
          setSelectedNotificationForModal={setSelectedNotificationForModal}
          setIsMobileOpen={setIsMobileOpen}
          handleSearchChange={handleSearchChange}
          handleSearchKeyDown={handleSearchKeyDown}
          highlightMatch={highlightMatch}
        />

        {/* Page Content Container (Corner curved inset panel) */}
        <div className="flex-1 bg-[#edf0f5] rounded-tl-[40px] md:rounded-tl-[48px] overflow-hidden flex flex-col min-h-0 relative">
          {/* iOS-Style Ambient Glow Visual Blobs in Background */}
          <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-[110px] pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-sky-400/8 to-indigo-400/8 blur-[120px] pointer-events-none z-0" />
          <div className="absolute top-[35%] left-[25%] w-[320px] h-[320px] rounded-full bg-gradient-to-br from-pink-500/5 to-rose-400/5 blur-[95px] pointer-events-none z-0" />
          
          <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full relative z-10">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Detail Popup Notification Modal */}
      <PopupNotificationModal
        notification={selectedNotificationForModal}
        onClose={() => setSelectedNotificationForModal(null)}
        onToggleRead={async (id, currentReadState) => {
          await handleMarkAsRead(id);
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: !currentReadState } : n));
        }}
      />
    </div>
  );
}
