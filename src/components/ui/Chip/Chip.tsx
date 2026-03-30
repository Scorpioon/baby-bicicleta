import React from 'react';

export const Chip: React.FC<{ label: string, trustLevel: 'HIGH' | 'MEDIUM' | 'LOW' }> = ({ label, trustLevel }) => {
  const colors = {
    HIGH: { bg: 'var(--color-trust-green-soft)', color: 'var(--color-trust-green)' },
    MEDIUM: { bg: 'var(--color-surface-soft)', color: 'var(--color-trust-yellow)' },
    LOW: { bg: '#FEE2E2', color: 'var(--color-trust-red)' }
  };
  
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', padding: '4px 8px',
      borderRadius: '16px', fontSize: '12px', fontWeight: 600,
      backgroundColor: colors[trustLevel].bg, color: colors[trustLevel].color
    }}>
      {label}
    </div>
  );
};
