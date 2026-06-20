'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  isAdmin: boolean;
  displayName: string;
  userInitials: string;
  unreadCount: number;
  notifications: any[];
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  showSearchDropdown: boolean;
  setShowSearchDropdown: (show: boolean) => void;
  focusedIndex: number;
  isSearching: boolean;
  showNotificationPopup: boolean;
  setShowNotificationPopup: (show: boolean) => void;
  searchRef: React.RefObject<HTMLDivElement | null>;
  notificationRef: React.RefObject<HTMLDivElement | null>;
  handleMarkAsRead: (id: string) => void;
  handleMarkAllAsRead: () => void;
  setSelectedNotificationForModal: (notification: any) => void;
  setIsMobileOpen: (open: boolean) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  highlightMatch: (text: string, query: string) => React.ReactNode;
}

export function Header({
  isAdmin,
  displayName,
  userInitials,
  unreadCount,
  notifications,
  showMobileSearch,
  setShowMobileSearch,
  searchQuery,
  setSearchQuery,
  searchResults,
  showSearchDropdown,
  setShowSearchDropdown,
  focusedIndex,
  isSearching,
  showNotificationPopup,
  setShowNotificationPopup,
  searchRef,
  notificationRef,
  handleMarkAsRead,
  handleMarkAllAsRead,
  setSelectedNotificationForModal,
  setIsMobileOpen,
  handleSearchChange,
  handleSearchKeyDown,
  highlightMatch,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="h-[78px] px-6 md:px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-[100] flex-shrink-0">
      {showMobileSearch ? (
        <div className="flex items-center gap-3 w-full animate-fade-in" ref={searchRef}>
          {/* Back button to close search on mobile */}
          <button
            onClick={() => {
              setShowMobileSearch(false);
              setSearchQuery('');
              setShowSearchDropdown(false);
            }}
            className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100/80 active:scale-95 transition-all border-0 bg-transparent cursor-pointer flex items-center justify-center"
            aria-label="Close Search"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Responsive mobile search field */}
          <div className="flex-1 relative">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 focus-within:bg-slate-200/80 text-slate-500 w-full transition-all duration-200">
              {isSearching ? (
                <div className="animate-spin h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent rounded-full flex-shrink-0" />
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              )}
              <input 
                type="text" 
                placeholder="Search roadmap..." 
                className="bg-transparent border-0 text-xs text-slate-800 focus:outline-none w-full font-semibold placeholder:text-slate-400" 
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                autoFocus
                onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
              />
            </div>

            {showSearchDropdown && (
              <div className="absolute top-[48px] left-0 bg-white/95 backdrop-blur-lg border border-slate-200/60 rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] z-[500] max-h-80 overflow-y-auto p-2.5 w-full">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 border-b border-slate-100">
                  Roadmap Search Results
                </div>
                <div className="py-1">
                  {searchResults.length > 0 ? (
                    searchResults.map((item, idx) => {
                      const isFocused = idx === focusedIndex;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery('');
                            setShowSearchDropdown(false);
                            setShowMobileSearch(false);
                            router.push(item.url);
                          }}
                          className={`w-full flex flex-col items-start text-left px-3 py-2 rounded-[12px] transition-colors border-0 cursor-pointer ${
                            isFocused ? 'bg-indigo-50/50' : 'bg-transparent hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xs font-bold text-slate-800">{highlightMatch(item.title, searchQuery)}</span>
                          <span className="text-[10px] text-slate-400 font-semibold truncate max-w-full">{highlightMatch(item.subtitle, searchQuery)}</span>
                        </button>
                      );
                    })
                  ) : (
                    searchQuery.trim().length >= 2 && (
                      <div className="text-center py-6 text-xs text-slate-400 font-semibold">
                        No results found for &ldquo;{searchQuery}&rdquo;
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            {/* Hamburger menu on mobile */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2.5 rounded-full text-slate-500 hover:bg-slate-100/80 active:scale-95 transition-all cursor-pointer border-0 bg-transparent"
              aria-label="Open Sidebar"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search Input Bar (High-Fidelity Visual with suggestion dropdown) - Desktop (Now on Left) */}
            <div ref={searchRef} className="relative hidden md:block">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200/30 focus-within:bg-slate-200/50 text-slate-400 w-64 transition-all duration-200">
                {isSearching ? (
                  <div className="animate-spin h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent rounded-full flex-shrink-0" />
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                )}
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-0 text-[12px] text-slate-700 focus:outline-none w-full font-semibold placeholder:text-slate-400" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
                />
              </div>

              {showSearchDropdown && (
                <div className="absolute top-[48px] left-0 bg-white/95 backdrop-blur-lg border border-slate-200/60 rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] z-[500] max-h-80 overflow-y-auto p-2.5 w-76 md:w-80">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 border-b border-slate-100">
                    Roadmap Search Results
                  </div>
                  <div className="py-1">
                    {searchResults.length > 0 ? (
                      searchResults.map((item, idx) => {
                        const isFocused = idx === focusedIndex;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSearchQuery('');
                              setShowSearchDropdown(false);
                              router.push(item.url);
                            }}
                            className={`w-full flex flex-col items-start text-left px-3 py-2 rounded-[12px] transition-colors border-0 cursor-pointer ${
                              isFocused ? 'bg-indigo-50/50' : 'bg-transparent hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-800">{highlightMatch(item.title, searchQuery)}</span>
                            <span className="text-[10px] text-slate-400 font-semibold truncate max-w-full">{highlightMatch(item.subtitle, searchQuery)}</span>
                          </button>
                        );
                      })
                    ) : (
                      searchQuery.trim().length >= 2 && (
                        <div className="text-center py-6 text-xs text-slate-400 font-semibold">
                          No results found for &ldquo;{searchQuery}&rdquo;
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Search Icon Toggle Button */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="md:hidden p-2 rounded-full text-slate-400 hover:bg-slate-100/80 hover:text-indigo-600 active:scale-95 transition-all border-0 bg-transparent cursor-pointer flex items-center justify-center"
              aria-label="Toggle Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Notification Bell Icon & Popup Card */}
            <div ref={notificationRef} className="relative">
              <button 
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                className="p-2.5 rounded-full text-slate-400 hover:bg-slate-100/80 hover:text-indigo-600 relative active:scale-95 transition-all border-0 bg-transparent cursor-pointer flex items-center justify-center"
              >
                {unreadCount > 0 && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '3px',
                      right: '3px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ff3b30',
                      color: '#ffffff',
                      fontSize: '9px',
                      fontWeight: 900,
                      border: '1.5px solid #ffffff',
                      boxShadow: '0 2px 4px rgba(255, 59, 48, 0.2)'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>

              {showNotificationPopup && (
                <div className="absolute top-[48px] right-0 bg-white/95 backdrop-blur-lg border border-slate-200/60 rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] z-[500] p-3.5 w-80 flex flex-col gap-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-transparent border-0 cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2 py-1 pr-1">
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => { 
                            setSelectedNotificationForModal(item);
                            if (!item.is_read) handleMarkAsRead(item.id); 
                          }}
                          className={`p-3 rounded-[14px] border text-left cursor-pointer transition-all hover:scale-[1.01] ${
                            item.is_read 
                              ? 'bg-white/50 border-slate-100/70 hover:bg-slate-100/50' 
                              : 'bg-indigo-50/30 border-indigo-100/60 hover:bg-indigo-50/50'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-slate-800 leading-tight">{item.title}</h4>
                            {!item.is_read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-600 mt-1 leading-normal line-clamp-2">{item.message}</p>
                          <span className="text-[8px] text-slate-400 font-bold block mt-1.5">
                            {new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-xs text-slate-400 font-semibold">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Premium Header User Avatar Card */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200/60">
              <div className="hidden sm:flex flex-col text-right leading-none">
                <span className="text-xs font-black text-slate-800">{displayName}</span>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">{isAdmin ? 'Admin' : 'Member'}</span>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'transparent',
                border: '1.5px solid rgba(79, 70, 229, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}>
                {userInitials}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
