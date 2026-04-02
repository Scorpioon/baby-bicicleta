import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';

type RailState = 'collapsed' | 'semi-pulled';

export const ReservationLiveMode = () => {
  const { reservation, setReservationStatus, cancelReservation } = useCoreStore();
  const setSheetState = useUIStore(s => s.setSheetState);
  
  const [railState, setRailState] = useState<RailState>('collapsed');
  const [timeLeftStr, setTimeLeftStr] = useState('10:00');
  
  const station = mockStations.find(s => s.id === reservation.stationId) || mockStations[0];

  useEffect(() => {
    if (reservation.status !== 'SUCCESS' || !reservation.expiresAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((reservation.expiresAt! - Date.now()) / 1000));
      setTimeLeftStr(`${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, '0')}`);
      if (remaining === 0) setReservationStatus('EXPIRED');
    }, 1000);
    return () => clearInterval(interval);
  }, [reservation.status, reservation.expiresAt, setReservationStatus]);

  const handleCancel = () => {
    cancelReservation();
    setSheetState('SHEET_STATION_VIEW');
  };

  return (
    <motion.div id="reserve_live_rail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {reservation.status === 'RESERVING' && (
        <div id="reserve_loading_state" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
          <div style={{ width: 20, height: 20, border: '3px solid var(--color-surface-soft)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontWeight: 600, fontSize: 16 }}>Asegurando bici...</span>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {reservation.status === 'SUCCESS' && (
        <AnimatePresence mode="wait">
          {railState === 'collapsed' ? (
            <motion.div id="reserve_rail_collapsed" key="collapsed" onClick={() => setRailState('semi-pulled')} style={{ padding: '8px 0', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, backgroundColor: 'var(--color-trust-green)', borderRadius: '50%' }} />
                <span style={{ fontWeight: 600, fontSize: 16 }}>
                  Bici reservada · <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--color-trust-green)' }}>{timeLeftStr}</span>
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div id="reserve_rail_pulled" key="semi-pulled" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ marginBottom: 24, paddingRight: 12 }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 2, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Caminando hacia {station.name}
                </h3>
                <p style={{ fontSize: 15, color: 'var(--color-text-muted)', margin: 0 }}>
                  Reserva expira en <span style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--color-trust-green)' }}>{timeLeftStr}</span>
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
                <Button id="reserve_pickup_trigger" variant="primary" onClick={() => setSheetState('SHEET_PICKUP_MODE')}>Coger bici</Button>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', cursor: 'pointer', padding: 8 }} onClick={() => setRailState('collapsed')}>
                  Ocultar detalles
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {reservation.status === 'FAILED' && (
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
             <div style={{ width: 8, height: 8, backgroundColor: 'var(--color-trust-red)', borderRadius: '50%' }} />
             <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-trust-red)' }}>Reserva fallida</span>
          </div>
          <p style={{ fontSize: 15, color: 'var(--color-text-muted)', marginBottom: 20 }}>Alguien se adelantó o la bici acaba de ser reportada averiada.</p>
          <Button fullWidth variant="primary" onClick={handleCancel}>Buscar otra estación</Button>
        </div>
      )}
    </motion.div>
  );
};
