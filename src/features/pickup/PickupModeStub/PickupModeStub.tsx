import { motion } from 'framer-motion';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { Button } from '../../../components/ui/Button/Button';
import { QrCode } from 'lucide-react';

export const PickupModeStub = () => {
  const { reservation } = useCoreStore();
  const setSheetState = useUIStore(s => s.setSheetState);
  
  const isFromReservation = reservation.status === 'SUCCESS';

  return (
    <motion.div id="pickup_mode_stub" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Desbloquear Bici</h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          {isFromReservation ? 'Tienes una bici reservada. Desliza para liberar.' : 'Acércate a una bici y escanea el QR.'}
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface-soft)', height: 160, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
        <QrCode size={48} color="var(--color-text-muted)" />
        <span style={{ fontSize: 14, fontWeight: 600 }}>Cámara / QR Stub</span>
      </div>

      <Button fullWidth variant="ghost" onClick={() => setSheetState(isFromReservation ? 'SHEET_RESERVATION_LIVE' : 'SHEET_STATION_VIEW')}>
        Cancelar
      </Button>
    </motion.div>
  );
};
