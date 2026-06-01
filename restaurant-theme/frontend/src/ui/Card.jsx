import React from 'react';

/**
 * Global Card Component
 * Mapped to Duare Design System
 */
export default function Card({ 
  children, 
  padding = 'var(--s-4)',
  interactive = false,
  className = '',
  onClick
}) {
  
  const style = {
    backgroundColor: 'var(--bg-card)',
    borderRadius: 'var(--r-lg)',
    boxShadow: 'var(--shadow-sm)',
    padding: padding,
    transition: 'all var(--t-smooth)',
    cursor: interactive ? 'pointer' : 'default',
    border: '1px solid var(--bdr-2)'
  };

  return (
    <div 
      style={style} 
      className={`duare-card ${className}`}
      onClick={onClick}
      onMouseEnter={e => {
        if (interactive) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          e.currentTarget.style.borderColor = 'var(--bdr-1)';
        }
      }}
      onMouseLeave={e => {
        if (interactive) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--bdr-2)';
        }
      }}
    >
      {children}
    </div>
  );
}
