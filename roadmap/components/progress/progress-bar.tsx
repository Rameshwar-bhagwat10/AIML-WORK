import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  color?: string;
  height?: number;
}

export function ProgressBar({
  value,
  showLabel = true,
  color = 'var(--grad-primary)',
  height = 8,
}: ProgressBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          <span>Completion</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{normalizedValue}%</span>
        </div>
      )}
      <div style={{ 
        width: '100%', 
        height: `${height}px`, 
        background: 'var(--bg-inset)', 
        borderRadius: `${height / 2}px`, 
        overflow: 'hidden' 
      }}>
        <div style={{ 
          width: `${normalizedValue}%`, 
          height: '100%', 
          background: color, 
          borderRadius: `${height / 2}px`,
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
        }}></div>
      </div>
    </div>
  );
}
