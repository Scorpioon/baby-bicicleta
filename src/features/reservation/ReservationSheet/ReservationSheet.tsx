import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';
import { Card } from '../../../components/ui/Card/Card';

export const ReservationSheet = () => {
  const { reservation, setReservationStatus, cancelReservation, selectStation } = useCoreStore();
  const setSheetState = useUIStore(s => s.setSheetState);
  const [timeLeftStr, setTimeLeftStr] = useState('10:00');
  
  const station = mockStations.find(s => s.id === reservation.stationId) || mockStations[0];
  const alternatives = mockStations.filter(s => s.id !== station.id).slice(0, 2);

  useEffect(() => {
    if (reservation.status !== 'SUCCESS' || !reservation.expiresAt) return;
    
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((reservation.expiresAt! - Date.now()) / 1000));
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      setTimeLeftStr(`${mins}:${secs.toString().padStart(2, '0')}`);
      
      if (remaining === 0) setReservationStatus('EXPIRED');
    }, 1000);
    return () => clearInterval(interval);
  }, [reservation.status, reservation.expiresAt, setReservationStatus]);

  const handleClose = () => {
    setSheetState('SHEET_STATION_VIEW');
  };

  const handleCancel = () => {
    cancelReservation();
    setSheetState('SHEET_STATION_VIEW');
  };

  const handleSelectAlt = (id: string) => {
    cancelReservation();
    selectStation(id);
    setSheetState('SHEET_STATION_VIEW');
  };

  return (
    <motion.div id="reserve_state_sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Context Header */}
      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 16, marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{station.name}</h2>
        <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Reservando en esta estación</div>
      </div>

      {reservation.status === 'RESERVING' && (
        <div id="reserve_loading_state" style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ width: 40, height: 40, border: '4px solid var(--color-surface-soft)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18 }}>Asegurando tu bici...</h3>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {reservation.status === 'SUCCESS' && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <h3 id="reserve_success_title" style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-trust-green)', marginBottom: 8 }}>¡Reserva confirmada!</h3>
          <div id="reserve_success_countdown" style={{ fontSize: 48, fontWeight: 900, fontFamily: 'monospace', marginBottom: 24 }}>
            {timeLeftStr}
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
            Tienes 10 minutos para recoger tu bici en {station.name}.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Button variant="primary" onClick={handleClose}>Entendido</Button>
            <Button variant="ghost" onClick={handleCancel}>Cancelar reserva</Button>
          </div>
        </div>
      )}

      {reservation.status === 'FAILED' && (
        <div style={{ padding: '8px 0' }}>
          <h3 id="reserve_failure_title" style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-trust-red)', marginBottom: 8 }}>No se pudo reservar</h3>
          <p id="reserve_failure_reason" style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
            Alguien se adelantó o la bici acaba de ser reportada como averiada.
          </p>
          <h4 style={{ fontSize: 16, marginBottom: 12 }}>Alternativas cercanas:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {alternatives.map((alt, i) => (
              <Card key={alt.id} id={`reserve_failure_alt_${i + 1}`} onClick={() => handleSelectAlt(alt.id)} style={{ cursor: 'pointer', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{alt.name}</span>
                  <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{alt.mechanicalCount + alt.electricCount} bicis</span>
                </div>
              </Card>
            ))}
          </div>
          <Button fullWidth variant="secondary" onClick={handleCancel}>Volver a la estación</Button>
        </div>
      )}

      {reservation.status === 'EXPIRED' && (
        <div id="reserve_expired_state" style={{ textAlign: 'center', padding: '24px 0' }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Reserva caducada</h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>El tiempo de reserva se ha agotado.</p>
          <Button fullWidth variant="primary" onClick={handleCancel}>Entendido</Button>
        </div>
      )}
    </motion.div>
  );
};
