import React from 'react';

/**
 * Global Button Component
 * Mapped to Duare Design System
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  fullWidth = false,
  className = '' 
}) {
  
  const baseStyle = {
    fontFamily: 'var(--font-family-primary)',
    fontWeight: 700,
    borderRadius: 'var(--r-md)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all var(--t-fast)',
    border: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
  };

  // Size logic
  if (size === 'sm') {
    baseStyle.padding = '8px 16px';
    baseStyle.fontSize = '14px';
  } else if (size === 'md') {
    baseStyle.padding = '12px 24px';
    baseStyle.fontSize = '16px';
  } else if (size === 'lg') {
    baseStyle.padding = '16px 32px';
    baseStyle.fontSize = '18px';
  }

  // Variant logic
  if (variant === 'primary') {
    baseStyle.backgroundColor = 'var(--brand)';
    baseStyle.color = 'var(--primary-white)';
    if (!disabled) baseStyle.boxShadow = '0 4px 14px 0 rgba(21,40,160,0.39)';
  } else if (variant === 'secondary') {
    baseStyle.backgroundColor = 'var(--gray-dark)';
    baseStyle.color = 'var(--primary-white)';
  } else if (variant === 'outline') {
    baseStyle.backgroundColor = 'transparent';
    baseStyle.color = 'var(--brand)';
    baseStyle.border = '2px solid var(--brand)';
  } else if (variant === 'ghost') {
    baseStyle.backgroundColor = 'transparent';
    baseStyle.color = 'var(--txt-1)';
  }

  return (
    <button 
      style={baseStyle} 
      onClick={onClick} 
      disabled={disabled}
      className={`duare-btn ${className}`}
      onMouseEnter={e => {
        if (disabled) return;
        if (variant === 'primary') e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        if (disabled) return;
        if (variant === 'primary') e.currentTarget.style.transform = 'translateY(0)';
      }}
      onMouseDown={e => {
        if (disabled) return;
        e.currentTarget.style.transform = 'translateY(1px)';
      }}
      onMouseUp={e => {
        if (disabled) return;
        if (variant === 'primary') e.currentTarget.style.transform = 'translateY(-2px)';
      }}
    >
      {children}
    </button>
  );
}
