import React from 'react';
import { cn } from '@/lib/utils/helpers';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  glow?: boolean;
}

export function Card({
  children,
  className = '',
  glass = true,
  glow = false,
  style,
  ...props
}: CardProps) {
  const cardStyle: React.CSSProperties = {
    borderRadius: 'var(--border-radius)',
    padding: '1.5rem',
    transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  return (
    <div
      style={cardStyle}
      className={cn(
        glass ? 'glass' : '',
        glow ? 'pulse-glow' : '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
