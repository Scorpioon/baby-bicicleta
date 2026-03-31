import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';

export const ActiveReservationPill = () => {
  const { reservation } = useCoreStore();
  const setSheetState = useUIStore(s => s.setSheetState);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (reservation.status !== 'SUCCESS' || !reservation.expiresAt) return;
    
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((reservation.expiresAt! - Date.now()) / 1000));
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [reservation]);

  if (reservation.status !== 'SUCCESS') return null;

  return (
    <AnimatePresence>
      <motion.div
        id="reserve_active_pill"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        onClick={() => setSheetState('SHEET_RESERVATION')}
        style={{
          position: 'absolute', top: 'env(safe-area-inset-top, 16px)', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'var(--color-text-main)', color: 'white',
          padding: '12px 24px', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 50, cursor: 'pointer', fontWeight: 600
        }}
      >
        <div style={{ width: 8, height: 8, backgroundColor: 'var(--color-trust-green)', borderRadius: '50%' }} />
        <span>Bici reservada</span>
        <span style={{ color: 'var(--color-trust-green-soft)', fontFamily: 'monospace', fontSize: '16px' }}>{timeLeft}</span>
      </motion.div>
    </AnimatePresence>
  );
};
