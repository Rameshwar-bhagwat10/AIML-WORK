import React from 'react';
import Link from 'next/link';

export function Navbar() {
  const navbarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 'var(--sidebar-width)',
    height: 'var(--navbar-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    borderBottom: '1px solid var(--border-color)',
    zIndex: 100,
  };

  return (
    <header style={navbarStyle} className="glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Overview</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>System Active</span>
        </div>
        <Link href="/login">
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            background: 'var(--grad-primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            U
          </div>
        </Link>
      </div>
    </header>
  );
}
