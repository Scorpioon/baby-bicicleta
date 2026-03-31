import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';
import { MapPin, Clock } from 'lucide-react';

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

  const handleTriggerPickup = () => {
    setSheetState('SHEET_PICKUP_MODE');
  };

  return (
    <motion.div id="reserve_live_rail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {reservation.status === 'RESERVING' && (
        <div id="reserve_loading_state" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
          <div style={{ width: 24, height: 24, border: '3px solid var(--color-surface-soft)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontWeight: 600 }}>Asegurando bici en {station.name}...</span>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {reservation.status === 'SUCCESS' && (
        <AnimatePresence mode="wait">
          {railState === 'collapsed' ? (
            <motion.div id="reserve_rail_collapsed" key="collapsed" onClick={() => setRailState('semi-pulled')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, backgroundColor: 'var(--color-trust-green)', borderRadius: '50%' }} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>Bici reservada</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, color: 'var(--color-trust-green)' }}>{timeLeftStr}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div id="reserve_rail_pulled" key="semi-pulled" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-trust-green)', marginBottom: 4 }}>{timeLeftStr}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 14 }}>
                    <MapPin size={14} /><span>{station.name}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 14, color: 'var(--color-text-muted)' }}>
                  <Clock size={14} style={{ display: 'inline', marginRight: 4 }}/>a {station.distanceMinutes} min
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
                <Button id="reserve_pickup_trigger" variant="primary" onClick={handleTriggerPickup}>Coger bici</Button>
              </div>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', cursor: 'pointer', padding: 8 }} onClick={() => setRailState('collapsed')}>Ocultar detalles</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {reservation.status === 'FAILED' && (
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
             <div style={{ width: 10, height: 10, backgroundColor: 'var(--color-trust-red)', borderRadius: '50%' }} />
             <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-trust-red)' }}>Reserva fallida</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Alguien se adelantó o la bici fue reportada averiada.</p>
          <Button fullWidth variant="primary" onClick={handleCancel}>Buscar otra estación</Button>
        </div>
      )}
    </motion.div>
  );
};
