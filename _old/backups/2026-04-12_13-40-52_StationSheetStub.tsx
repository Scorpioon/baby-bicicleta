// CCOS FILE VERSION: v0.2.19d
// CCOS LAST PATCH: map_destination_framing
// CCOS CHANGE TYPE: FEATURE
// CCOS FEATURE ID: BEBE_0219d_ID_1003
import { motion } from 'framer-motion';
import { Cog, Zap, ArrowDownToLine, ChevronRight, Heart, CornerUpRight } from 'lucide-react';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';
import { Chip } from '../../../components/ui/Chip/Chip';

// BeBe v0.2.18 - Alternative station handoff micro-layer
// Custom lightweight SVG for "Person Walking"
interface WalkIconProps { size?: number | string; color?: string; }
const WalkIcon = ({ size = 14, color = 'currentColor' }: WalkIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2"></circle>
    <path d="M12 7l-2 4 2 5"></path>
    <path d="M10 11l-3-2"></path>
    <path d="M12 7l4 2-1 4"></path>
    <path d="M12 16l-2 5"></path>
    <path d="M12 16l3 5"></path>
  </svg>
);

export const StationSheetStub = () => {
  const { selectedStationId, selectStation, startReservation, setReservationStatus, setDestination } = useCoreStore();
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

  const handleFallback = (id?: string) => {
    if (!id) return;
    setDestination(id);
    selectStation(id);
    setSheetState('SHEET_STATION_VIEW');
  };

  const isHealthy = station.confidenceState === 'HIGH';
  const isBroken = station.status === 'BROKEN';
  const isEmpty = station.mechanicalCount === 0 && station.electricCount === 0;

  const fallbackStations = station.fallbackStationIds 
    ? station.fallbackStationIds.map(id => mockStations.find(s => s.id === id)).filter(Boolean) 
    : [];

  const formatId = (idStr: string) => String(idStr).padStart(4, '0');

  return (
    <motion.div 
      id="station_sheet"
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: isHealthy && !isBroken ? 20 : 0 }}>
        <div style={{ flexGrow: 1, marginTop: -2 }}>
          <h1 id="station_header" style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--color-text-main)' }}>
            Bicing #{formatId(station.stationNumber)} - {station.streetName}
          </h1>
          <div id="station_distance_hint" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 14 }}>
            <WalkIcon size={14} /><span>a {station.distanceMinutes} min andando</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button style={{ backgroundColor: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Heart size={20} color={station.isFavorite ? 'var(--color-accent)' : 'var(--color-text-muted)'} fill={station.isFavorite ? 'var(--color-accent)' : 'none'} />
          </button>
          <button style={{ backgroundColor: 'var(--color-surface-soft)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CornerUpRight size={20} color="var(--color-text-main)" />
          </button>
        </div>
      </div>

      {/* CONDITIONAL WARNING STRIP */}
      {(!isHealthy || isBroken) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', margin: '16px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
          <span id="station_confidence_chip" style={{ flexShrink: 0 }}>
            <Chip label={station.confidenceLabel} trustLevel={station.confidenceState as 'MEDIUM'|'LOW'} />
          </span>
          <p id="station_confidence_copy" style={{ fontSize: 13, color: 'var(--color-text-main)', lineHeight: 1.35, margin: 0 }}>
            {station.confidenceCopy}
          </p>
        </div>
      )}

      {/* MULTI-ROW FALLBACK (Unified List Container) */}
      {isBroken && fallbackStations.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-trust-red)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Alternativas operativas
          </h4>
          <div style={{ backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            {fallbackStations.map((alt, i) => (
              <div key={alt!.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: i < fallbackStations.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 12 }}>
                    #{formatId(alt!.stationNumber)} - {alt!.streetName}
                  </span>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', opacity: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{alt!.mechanicalCount + alt!.electricCount} bicis</span>
                    <span style={{ opacity: 0.5 }}>-</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><WalkIcon size={12} /> {alt!.distanceMinutes} min</span>
                  </div>
                </div>
                {/* Native button bypasses any generic Button.tsx merge collisions */}
                <button 
                  onClick={() => handleFallback(alt!.id)}
                  style={{ backgroundColor: 'var(--color-surface-base)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '6px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                >
                  Ir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 METRICS + 1 ACTION TILE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        <div style={{ textAlign: 'center', padding: '14px 4px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)', opacity: isBroken ? 0.4 : 1, pointerEvents: isBroken ? 'none' : 'auto' }}>
          <Cog size={20} strokeWidth={2.5} style={{ margin: '0 auto 6px', color: 'var(--color-text-main)' }} />
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>{station.mechanicalCount}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '14px 4px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)', opacity: isBroken ? 0.4 : 1, pointerEvents: isBroken ? 'none' : 'auto' }}>
          <Zap size={20} strokeWidth={2.5} style={{ margin: '0 auto 6px', color: '#3B82F6' }} />
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>{station.electricCount}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '14px 4px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)', opacity: isBroken ? 0.4 : 1, pointerEvents: isBroken ? 'none' : 'auto' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 16, opacity: isBroken ? 0.4 : 1, filter: isBroken ? 'grayscale(100%)' : 'none', pointerEvents: isBroken ? 'none' : 'auto' }}>
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






