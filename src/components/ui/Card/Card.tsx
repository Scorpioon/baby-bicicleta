import React from 'react';

interface CardProps {
  id?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ id, children, style, onClick }) => (
  <div
    id={id}
    onClick={onClick}
    style={{
      backgroundColor: 'var(--color-surface-base)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-card)',
      ...style
    }}
  >
    {children}
  </div>
);