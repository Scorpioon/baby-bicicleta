import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<Props> = ({ variant = 'primary', fullWidth, style, children, ...props }) => {
  const baseStyle: React.CSSProperties = {
    padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: 'none',
    fontWeight: 600, fontSize: '16px', cursor: 'pointer',
    width: fullWidth ? '100%' : 'auto', transition: 'all 0.2s', ...style
  };
  
  const variants = {
    primary: { backgroundColor: 'var(--color-accent)', color: 'white' },
    secondary: { backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)' },
    ghost: { backgroundColor: 'transparent', color: 'var(--color-text-muted)' }
  };

  return <button style={{ ...baseStyle, ...variants[variant] }} {...props}>{children}</button>;
};
