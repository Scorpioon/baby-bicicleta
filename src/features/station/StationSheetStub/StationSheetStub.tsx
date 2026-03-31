import { motion } from 'framer-motion';
import { Bike, Zap, Lock, Clock, ChevronRight } from 'lucide-react';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';
import { Chip } from '../../../components/ui/Chip/Chip';

export const StationSheetStub = () => {
  const { selectedStationId, startReservation, setReservationStatus } = useCoreStore();
  const setSheetState = useUIStore(s => s.setSheetState);
  
  const station = mockStations.find(s => s.id === selectedStationId);
  if (!station) return null;

  const handleReserve = () => {
    startReservation(station.id);
    setSheetState('SHEET_RESERVATION_LIVE');
    setTimeout(() => {
      if (Math.random() > 0.3) {
        setReservationStatus('SUCCESS', Date.now() + 10 * 60 * 1000);
      } else {
        setReservationStatus('FAILED');
      }
    }, 1500);
  };

  const isHealthy = station.confidenceState === 'HIGH';

  return (
    <motion.div 
      id="station_sheet"
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <div>
        <h2 id="station_header" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{station.name}</h2>
        <div id="station_distance_hint" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 14 }}>
          <Clock size={14} /><span>a {station.distanceMinutes} min andando</span>
        </div>
      </div>

      {!isHealthy && (
        <div style={{ backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)', padding: '12px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span id="station_confidence_chip">
              <Chip label={station.confidenceLabel} trustLevel={station.confidenceState as 'MEDIUM'|'LOW'} />
            </span>
          </div>
          <p id="station_confidence_copy" style={{ fontSize: 14, color: 'var(--color-text-main)' }}>{station.confidenceCopy}</p>
        </div>
      )}

      {/* 3 Metrics + 1 Action Tile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        <div style={{ textAlign: 'center', padding: '12px 4px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
          <Bike size={18} style={{ margin: '0 auto 6px', color: 'var(--color-text-muted)' }} />
          <div style={{ fontSize: 20, fontWeight: 800 }}>{station.mechanicalCount}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px 4px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
          <Zap size={18} style={{ margin: '0 auto 6px', color: '#3B82F6' }} />
          <div style={{ fontSize: 20, fontWeight: 800 }}>{station.electricCount}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px 4px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
          <Lock size={18} style={{ margin: '0 auto 6px', color: 'var(--color-text-muted)' }} />
          <div style={{ fontSize: 20, fontWeight: 800 }}>{station.dockCount}</div>
        </div>
        
        {/* Destination Tile */}
        <div 
          onClick={() => setSheetState('SHEET_STATION_INSPECT')}
          style={{ 
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
            padding: '12px 4px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-md)',
            cursor: 'pointer'
          }}
        >
          <ChevronRight size={20} style={{ color: 'var(--color-text-main)', marginBottom: 6 }} />
          <div style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', lineHeight: 1.1 }}>Estado</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 4 }}>
        <Button id="station_cta_reserve" fullWidth variant="secondary" onClick={handleReserve} disabled={station.mechanicalCount === 0 && station.electricCount === 0}>
          Reservar bici
        </Button>
        <Button id="station_cta_pickup" fullWidth variant="primary" onClick={() => setSheetState('SHEET_PICKUP_MODE')} disabled={station.mechanicalCount === 0 && station.electricCount === 0}>
          Coger bici
        </Button>
      </div>
    </motion.div>
  );
};
