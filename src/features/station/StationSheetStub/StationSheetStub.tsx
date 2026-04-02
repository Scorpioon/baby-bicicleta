import { motion } from 'framer-motion';
import { Cog, Zap, ArrowDownToLine, ChevronRight, Heart, Footprints, CornerUpRight, AlertTriangle } from 'lucide-react';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';
import { Chip } from '../../../components/ui/Chip/Chip';

export const StationSheetStub = () => {
  const { selectedStationId, selectStation, startReservation, setReservationStatus } = useCoreStore();
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

  const fallbackStation = station.fallbackStationId ? mockStations.find(s => s.id === station.fallbackStationId) : null;

  const handleFallback = () => {
    if (fallbackStation) {
      selectStation(fallbackStation.id);
    }
  };

  const isHealthy = station.confidenceState === 'HIGH';
  const isBroken = station.status === 'BROKEN';
  const isEmpty = station.mechanicalCount === 0 && station.electricCount === 0;

  return (
    <motion.div 
      id="station_sheet"
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: isHealthy && !isBroken ? 20 : 0 }}>
        <button style={{ background: 'none', border: 'none', padding: '2px 0 0 0', cursor: 'pointer', flexShrink: 0 }}>
          <Heart size={24} color={station.isFavorite ? 'var(--color-accent)' : 'var(--color-text-muted)'} fill={station.isFavorite ? 'var(--color-accent)' : 'none'} />
        </button>
        
        <div style={{ flexGrow: 1, marginTop: -2 }}>
          <h1 id="station_header" style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--color-text-main)' }}>
            Bicing #{station.stationNumber} - {station.streetName}
          </h1>
          <div id="station_distance_hint" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 14 }}>
            <Footprints size={14} /><span>a {station.distanceMinutes} min andando</span>
          </div>
        </div>

        <button style={{ backgroundColor: 'var(--color-surface-soft)', border: '1px solid var(--color-border)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <CornerUpRight size={20} color="var(--color-text-main)" />
        </button>
      </div>

      {/* CONDITIONAL WARNING STRIP */}
      {(!isHealthy || isBroken) && (
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 12, 
          padding: '12px 0', margin: '16px 0',
          borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' 
        }}>
          <span id="station_confidence_chip" style={{ flexShrink: 0 }}>
            <Chip label={station.confidenceLabel} trustLevel={station.confidenceState as 'MEDIUM'|'LOW'} />
          </span>
          <p id="station_confidence_copy" style={{ fontSize: 13, color: 'var(--color-text-main)', lineHeight: 1.35, margin: 0 }}>
            {station.confidenceCopy}
          </p>
        </div>
      )}

      {/* BROKEN FALLBACK ANTI-ANXIETY */}
      {isBroken && fallbackStation && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertTriangle size={18} color="var(--color-trust-red)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flexGrow: 1 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-trust-red)', marginBottom: 4 }}>Estación inoperativa</h4>
              <p style={{ fontSize: 13, color: 'var(--color-trust-red)', opacity: 0.9, marginBottom: 12, lineHeight: 1.4 }}>
                Alternativa: <strong>{fallbackStation.name}</strong><br />
                {fallbackStation.mechanicalCount + fallbackStation.electricCount} bicis · {fallbackStation.dockCount} anclajes · a {fallbackStation.distanceMinutes} min.
              </p>
              <Button variant="secondary" style={{ padding: '8px 16px', fontSize: 13, backgroundColor: 'white' }} onClick={handleFallback}>
                Ir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3 METRICS + 1 ACTION TILE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', opacity: isBroken ? 0.4 : 1, pointerEvents: isBroken ? 'none' : 'auto' }}>
        <div style={{ textAlign: 'center', padding: '14px 4px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
          <Cog size={20} strokeWidth={2.5} style={{ margin: '0 auto 6px', color: 'var(--color-text-main)' }} />
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>{station.mechanicalCount}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '14px 4px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
          <Zap size={20} strokeWidth={2.5} style={{ margin: '0 auto 6px', color: '#3B82F6' }} />
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>{station.electricCount}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '14px 4px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
          <ArrowDownToLine size={20} strokeWidth={2.5} style={{ margin: '0 auto 6px', color: 'var(--color-text-main)' }} />
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>{station.dockCount}</div>
        </div>
        
        <div 
          onClick={() => setSheetState('SHEET_STATION_INSPECT')}
          style={{ 
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
            padding: '14px 4px', backgroundColor: 'transparent', border: '1px solid var(--color-border)', 
            borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'background-color 0.2s ease'
          }}
        >
          <ChevronRight size={24} style={{ color: 'var(--color-text-main)', marginBottom: 4 }} />
          <div style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', lineHeight: 1.1, color: 'var(--color-text-main)' }}>Estado</div>
        </div>
      </div>

      {/* BOTTOM CTAS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 16 }}>
        <Button id="station_cta_reserve" fullWidth variant="secondary" onClick={handleReserve} disabled={isEmpty || isBroken}>
          Reservar bici
        </Button>
        <Button id="station_cta_pickup" fullWidth variant="primary" onClick={() => setSheetState('SHEET_PICKUP_MODE')} disabled={isEmpty || isBroken}>
          Coger bici
        </Button>
      </div>
    </motion.div>
  );
};
