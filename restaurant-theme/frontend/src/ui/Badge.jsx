import React from 'react';

/**
 * Global Badge Component
 * Mapped to Duare Design System
 */
export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  
  let bg = 'var(--gray-light)';
  let color = 'var(--txt-2)';
  
  if (variant === 'primary') {
    bg = 'var(--brand)';
    color = 'var(--primary-white)';
  } else if (variant === 'success') {
    bg = 'var(--accent-green)';
    color = 'var(--primary-white)';
  } else if (variant === 'danger') {
    bg = 'var(--accent-orange)';
    color = 'var(--primary-white)';
  } else if (variant === 'purple') {
    bg = 'var(--accent-purple)';
    color = 'var(--primary-white)';
  }

  const px = size === 'sm' ? 6 : size === 'md' ? 8 : 12;
  const py = size === 'sm' ? 2 : size === 'md' ? 4 : 6;
  const fz = size === 'sm' ? 11 : size === 'md' ? 12 : 14;

  const style = {
    backgroundColor: bg,
    color: color,
    padding: `${py}px ${px}px`,
    borderRadius: 'var(--r-md)',
    fontSize: `${fz}px`,
    fontFamily: 'var(--font-family-primary)',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1.2
  };

  return (
    <span style={style} className={`duare-badge ${className}`}>
      {children}
    </span>
  );
}
