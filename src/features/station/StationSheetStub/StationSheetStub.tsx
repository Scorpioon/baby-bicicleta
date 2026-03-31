import { motion } from 'framer-motion';
import { Bike, Zap, Lock, Clock, AlertCircle } from 'lucide-react';
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
    setSheetState('SHEET_RESERVATION');
    
    // Mock network request
    setTimeout(() => {
      // 70% success rate mock
      if (Math.random() > 0.3) {
        setReservationStatus('SUCCESS', Date.now() + 10 * 60 * 1000); // 10 minutes
      } else {
        setReservationStatus('FAILED');
      }
    }, 1500);
  };

  return (
    <motion.div 
      id="station_sheet"
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 id="station_header" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{station.name}</h2>
          <div id="station_distance_hint" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 14 }}>
            <Clock size={14} /><span>a {station.distanceMinutes} min andando</span>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span id="station_confidence_chip">
            <Chip label={station.confidenceLabel} trustLevel={station.confidenceState as 'HIGH'|'MEDIUM'|'LOW'} />
          </span>
        </div>
        <p id="station_confidence_copy" style={{ fontSize: 14, color: 'var(--color-text-main)', lineHeight: 1.4 }}>{station.confidenceCopy}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ textAlign: 'center', padding: '12px 8px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
          <Bike size={20} style={{ margin: '0 auto 8px', color: 'var(--color-text-muted)' }} />
          <div id="station_mechanical_count" style={{ fontSize: 24, fontWeight: 800 }}>{station.mechanicalCount}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Mecánicas</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px 8px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
          <Zap size={20} style={{ margin: '0 auto 8px', color: '#3B82F6' }} />
          <div id="station_electric_count" style={{ fontSize: 24, fontWeight: 800 }}>{station.electricCount}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Eléctricas</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px 8px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
          <Lock size={20} style={{ margin: '0 auto 8px', color: 'var(--color-text-muted)' }} />
          <div id="station_dock_count" style={{ fontSize: 24, fontWeight: 800 }}>{station.dockCount}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Anclajes</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 4 }}>
        <Button id="station_cta_reserve" fullWidth variant="primary" onClick={handleReserve} disabled={station.mechanicalCount === 0 && station.electricCount === 0}>
          Reservar bici
        </Button>
        <Button id="station_cta_report_issue" fullWidth variant="secondary" onClick={() => setSheetState('SHEET_INCIDENT_COMPOSER')}>
          Reportar problema
        </Button>
      </div>
    </motion.div>
  );
};
