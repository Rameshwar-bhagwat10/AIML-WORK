'use client';

import React, { useRef } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    wrapperRef.current.style.setProperty('--mouse-x', `${x}px`);
    wrapperRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      className="auth-viewport-wrapper"
    >
      <div className="auth-card-container">
        {/* Left Visual Panel */}
        <div className="auth-left-panel">
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
            }}
          >
            {/* Hero image background */}
            <img
              src="/login-hero.png"
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* Dark overlay gradient from bottom */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 10, 40, 0.85) 0%, rgba(15, 10, 40, 0.3) 40%, transparent 70%)',
              }}
            />
          </div>

          {/* Text overlay on image */}
          <div
            className="animate-slide-up"
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '48px 40px',
              maxWidth: '520px',
            }}
          >
            <h2
              style={{
                fontSize: '3.4rem',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                marginBottom: '16px',
                fontFamily: "'Outfit', sans-serif",
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              Master AI,{'\n'}
              one day at a time.
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 450,
                letterSpacing: '-0.01em',
              }}
            >
              Your structured learning roadmap for AI & ML engineering.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-right-panel">
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              background: 'transparent',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
