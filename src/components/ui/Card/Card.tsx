import React from 'react';

export const Card: React.FC<{ children: React.ReactNode, style?: React.CSSProperties, onClick?: () => void }> = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{
    backgroundColor: 'var(--color-surface-base)', borderRadius: 'var(--radius-md)',
    padding: '16px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', ...style
  }}>
    {children}
  </div>
);
