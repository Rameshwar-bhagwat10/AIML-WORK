'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  isExiting?: boolean;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300); // match animation exit duration
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const defaultTitle = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
    }[type];

    const newToast: Toast = {
      id,
      type,
      title: title || defaultTitle,
      message,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const toast = React.useMemo(() => ({
    success: (message: string, title?: string) => addToast('success', message, title),
    error: (message: string, title?: string) => addToast('error', message, title),
    warning: (message: string, title?: string) => addToast('warning', message, title),
    info: (message: string, title?: string) => addToast('info', message, title),
  }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Portal Container at top right */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3.5 pointer-events-none w-full max-w-[380px]">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [animationClass, setAnimationClass] = useState('animate-toast-slide-in');

  useEffect(() => {
    if (toast.isExiting) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimationClass('animate-toast-slide-out');
    }
  }, [toast.isExiting]);

  // Icons and gradient classes
  const getThemeDetails = () => {
    switch (toast.type) {
      case 'success':
        return {
          gradient: 'from-emerald-50 to-emerald-100/30 border-emerald-100/50',
          shadow: 'shadow-emerald-500/10',
          icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          ),
        };
      case 'error':
        return {
          gradient: 'from-red-50 to-red-100/30 border-red-100/50',
          shadow: 'shadow-red-500/10',
          icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="13" />
              <circle cx="12" cy="17" r="0.75" fill="#ef4444" stroke="#ef4444" strokeWidth="1" />
            </svg>
          ),
        };
      case 'warning':
        return {
          gradient: 'from-amber-50 to-amber-100/30 border-amber-100/50',
          shadow: 'shadow-amber-500/10',
          icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 5 9 14H3Z" />
              <line x1="12" y1="10" x2="12" y2="14" />
              <circle cx="12" cy="17" r="0.75" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" />
            </svg>
          ),
        };
      case 'info':
      default:
        return {
          gradient: 'from-blue-50 to-blue-100/30 border-blue-100/50',
          shadow: 'shadow-blue-500/10',
          icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <circle cx="12" cy="8" r="0.75" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1" />
            </svg>
          ),
        };
    }
  };

  const theme = getThemeDetails();

  return (
    <div
      className={`pointer-events-auto flex items-center w-full bg-white border border-slate-150/70 p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] select-none relative group overflow-hidden ${animationClass}`}
      style={{
        boxShadow: '0 8px 25px -5px rgba(15, 23, 42, 0.04), 0 3px 10px -2px rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* Icon Card Box on Left */}
      <div 
        className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center bg-gradient-to-br border shadow-sm flex-shrink-0 ${theme.gradient} ${theme.shadow}`}
        style={{ width: '32px', height: '32px' }}
      >
        {theme.icon}
      </div>

      {/* Main message text */}
      <div className="flex-1 ml-3 pr-6 space-y-0.5">
        <h4 className="text-[11px] font-black text-slate-800 leading-snug">
          {toast.title}
        </h4>
        <p className="text-[10px] font-bold text-slate-500 leading-snug">
          {toast.message}
        </p>
      </div>

      {/* Close button on Top Right */}
      <button
        onClick={onClose}
        className="absolute top-1/2 -translate-y-1/2 right-3.5 text-slate-400 hover:text-slate-650 cursor-pointer p-0.5 rounded-lg hover:bg-slate-50 transition-all border-0 bg-transparent flex items-center justify-center"
        aria-label="Close message"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
