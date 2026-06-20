import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style,
  ...props
}: ButtonProps) {
  const getStyles = () => {
    let base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--border-radius)',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      border: '1px solid transparent',
      outline: 'none',
      fontFamily: 'inherit',
    };

    let variantStyles: React.CSSProperties = {};
    if (variant === 'primary') {
      variantStyles = {
        background: 'var(--primary)',
        color: 'var(--text-on-accent)',
        boxShadow: 'var(--shadow-sm)',
      };
    } else if (variant === 'secondary') {
      variantStyles = {
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
      };
    } else if (variant === 'danger') {
      variantStyles = {
        background: 'var(--danger)',
        color: '#fff',
      };
    } else if (variant === 'ghost') {
      variantStyles = {
        background: 'transparent',
        color: 'var(--text-secondary)',
      };
    } else if (variant === 'glass') {
      variantStyles = {
        background: 'var(--bg-inset)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
      };
    }

    let sizeStyles: React.CSSProperties = {};
    if (size === 'sm') {
      sizeStyles = { padding: '6px 12px', fontSize: '0.875rem' };
    } else if (size === 'md') {
      sizeStyles = { padding: '10px 20px', fontSize: '1rem' };
    } else if (size === 'lg') {
      sizeStyles = { padding: '14px 28px', fontSize: '1.125rem' };
    }

    return { ...base, ...variantStyles, ...sizeStyles, ...style };
  };

  return (
    <button
      style={getStyles()}
      className={`custom-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
