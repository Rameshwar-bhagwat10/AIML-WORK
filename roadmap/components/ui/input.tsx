import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = '',
  style,
  ...props
}: InputProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-inset)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius)',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    width: '100%',
    ...style,
  };

  const errorStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: 'var(--danger)',
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        style={inputStyle}
        className={`custom-input ${className}`}
        {...props}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}
