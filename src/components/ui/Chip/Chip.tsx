import React from 'react';

export const Chip: React.FC<{ label: string, trustLevel: 'HIGH' | 'MEDIUM' | 'LOW' }> = ({ label, trustLevel }) => {
  const colors = {
    HIGH: { bg: 'var(--color-trust-green-soft)', color: 'var(--color-trust-green)' },
    MEDIUM: { bg: '#FEF3C7', color: 'var(--color-trust-yellow)' },
    LOW: { bg: '#FEE2E2', color: 'var(--color-trust-red)' }
  };
  
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', padding: '4px 8px',
      borderRadius: '6px', fontSize: '11px', fontWeight: 800,
      letterSpacing: '0.03em', textTransform: 'uppercase',
      backgroundColor: colors[trustLevel].bg, color: colors[trustLevel].color
    }}>
      {label}
    </div>
  );
};
