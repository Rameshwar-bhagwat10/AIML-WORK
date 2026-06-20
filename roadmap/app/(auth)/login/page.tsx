'use client';

import React, { useState } from 'react';
import { loginAction } from './actions';
import { useToast } from '@/components/ui/toast';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('logout') === 'success') {
        toast.success('You have been signed out successfully.', 'Signed Out');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await loginAction(formData);
      if (result && result.error) {
        toast.error(result.error, 'Login Failed');
      }
    } catch (err: any) {
      if (err.message === 'NEXT_REDIRECT' || err.digest?.includes('NEXT_REDIRECT') || err.message?.includes('NEXT_REDIRECT')) {
        throw err;
      }
      toast.error(err.message || 'An unexpected error occurred.', 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-card-enter">
      {/* Transparent Logo */}
      <div
        className="animate-slide-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #4f46e5',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#111827',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.025em',
          }}
        >
          DevRoadmap
        </span>
      </div>

      {/* Heading */}
      <h1
        className="animate-slide-up"
        style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#111827',
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          marginBottom: '8px',
        }}
      >
        Accelerate Your AI Journey
      </h1>
      <p
        className="animate-slide-up"
        style={{
          fontSize: '0.9rem',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: '#6b7280',
          marginBottom: '28px',
          animationDelay: '0.05s',
          lineHeight: 1.4,
        }}
      >
        Sign in to track progress and master ML engineering.
      </p>



      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Email */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <label
            htmlFor="login-email"
            style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 500,
              color: '#6b7280',
              marginBottom: '6px',
            }}
          >
            Your Email
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '0.88rem',
              fontFamily: 'inherit',
              color: '#111827',
              background: '#ffffff',
              border: '1.5px solid #e5e7eb',
              borderRadius: '10px',
              outline: 'none',
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4f46e5';
              e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.08)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Password */}
        <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <label
            htmlFor="login-password"
            style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 500,
              color: '#6b7280',
              marginBottom: '6px',
            }}
          >
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 42px 10px 14px',
                fontSize: '0.88rem',
                fontFamily: 'inherit',
                color: '#111827',
                background: '#ffffff',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                outline: 'none',
                transition: 'border-color 200ms ease, box-shadow 200ms ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4f46e5';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.08)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: showPassword ? '#4f46e5' : '#d1d5db',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 200ms ease',
              }}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s', paddingTop: '6px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '12px 20px',
              borderRadius: '10px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#ffffff',
              background: '#1f2937',
              fontFamily: 'inherit',
              transition: 'all 200ms ease',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = '#111827';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = '#1f2937';
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 019.75 7.75" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
