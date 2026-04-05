// BeBe v0.2.11 - Bike List Scroll Hotfix
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Cog, Zap, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';

/**
 * LOCAL-ONLY TYPES (Step 1)
 */
interface LocalBikeStatus {
  id: string;
  type: 'MECHANICAL' | 'ELECTRIC';
  battery?: number;
  trustLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  trustLabel: string;
}

/**
 * LOCAL MOCK DATA
 * Scoped to this component to prevent global schema pollution.
 */
const getLocalBikes = (stationId: string): LocalBikeStatus[] => {
  const data: Record<string, LocalBikeStatus[]> = {
    'st_1': [
      { id: 'B-102', type: 'MECHANICAL', trustLevel: 'HIGH', trustLabel: 'Excelente' },
      { id: 'B-992', type: 'MECHANICAL', trustLevel: 'MEDIUM', trustLabel: 'Revisar frenos' },
      { id: 'E-401', type: 'ELECTRIC', battery: 88, trustLevel: 'HIGH', trustLabel: 'Excelente' },
      { id: 'E-402', type: 'ELECTRIC', battery: 100, trustLevel: 'HIGH', trustLabel: 'Excelente' },
      { id: 'B-993', type: 'MECHANICAL', trustLevel: 'LOW', trustLabel: 'Sill\u00edn roto' },
      { id: 'B-994', type: 'MECHANICAL', trustLevel: 'HIGH', trustLabel: 'Ok' }
    ],
    'st_2': [
      { id: 'E-112', type: 'ELECTRIC', battery: 12, trustLevel: 'LOW', trustLabel: 'Bater\u00eda baja' }
    ],
    'st_3': [
      { id: 'B-001', type: 'MECHANICAL', trustLevel: 'HIGH', trustLabel: 'Ok' },
      { id: 'B-005', type: 'MECHANICAL', trustLevel: 'LOW', trustLabel: 'Cadena suelta' }
    ]
  };
  return data[stationId] || [];
};

const BikeRow = ({ bike }: { bike: LocalBikeStatus }) => {
  const getTrustColor = () => {
    switch (bike.trustLevel) {
      case 'HIGH': return 'var(--color-trust-green)';
      case 'MEDIUM': return 'var(--color-trust-yellow)';
      case 'LOW': return 'var(--color-trust-red)';
      default: return 'var(--color-text-muted)';
    }
  };
  
  const TrustIcon = bike.trustLevel === 'HIGH' ? ShieldCheck : (bike.trustLevel === 'MEDIUM' ? Shield : ShieldAlert);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 12, 
      padding: '10px 0', 
      borderBottom: '1px solid var(--color-border)' 
    }}>
      {bike.type === 'ELECTRIC' ? (
        <Zap size={16} color="#3B82F6" />
      ) : (
        <Cog size={16} color="var(--color-text-muted)" />
      )}
      <div style={{ flexGrow: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{bike.id}</span>
          {bike.battery !== undefined && (
            <span style={{ fontSize: 10, fontWeight: 800, color: '#3B82F6' }}>{bike.battery}%</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
          <TrustIcon size={11} color={getTrustColor()} strokeWidth={3} />
          <span style={{ fontSize: 11, fontWeight: 600, color: getTrustColor() }}>{bike.trustLabel}</span>
        </div>
      </div>
    </div>
  );
};

export const StationInspectionStub = () => {
  const { selectedStationId } = useCoreStore();
  const setSheetState = useUIStore(s => s.setSheetState);
  
  const station = mockStations.find(s => s.id === selectedStationId);
  const bikes = selectedStationId ? getLocalBikes(selectedStationId) : [];

  if (!station) return null;

  return (
    <motion.div 
      id="station_inspection_v0_2_11" 
      initial={{ opacity: 0, x: 10 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -10 }}
      style={{ paddingBottom: 16 }}
    >
      {/* Header with Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button 
          onClick={() => setSheetState('SHEET_STATION_VIEW')}
          style={{ 
            background: 'var(--color-surface-soft)', 
            border: 'none', 
            borderRadius: '50%', 
            width: 32, 
            height: 32, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>{station.name}</h2>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} /> Actualizado {station.dataFreshnessLabel}
          </div>
        </div>
      </div>

      {/* Station Context Summary */}
      <div style={{ 
        backgroundColor: 'var(--color-surface-soft)', 
        padding: '12px 16px', 
        borderRadius: 'var(--radius-md)', 
        marginBottom: 20 
      }}>
        <span style={{ 
          fontSize: 10, 
          fontWeight: 900, 
          color: 'var(--color-text-muted)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          Estado de confianza
        </span>
        <p style={{ fontSize: 13, marginTop: 4, fontWeight: 500, lineHeight: 1.4 }}>
          {station.confidenceCopy}
        </p>
      </div>

      {/* Per-bike Detail List (Bounded Scroll Area) */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ 
          fontSize: 11, 
          fontWeight: 800, 
          color: 'var(--color-text-muted)', 
          textTransform: 'uppercase', 
          marginBottom: 8, 
          paddingLeft: 2 
        }}>
          {"Bicis en estaci\u00f3n"} ({bikes.length})
        </h4>
        <div style={{ 
          maxHeight: '220px', 
          overflowY: 'auto', 
          overscrollBehavior: 'contain', 
          padding: '0 4px',
          borderTop: bikes.length > 0 ? '1px solid var(--color-border)' : 'none',
          borderBottom: bikes.length > 0 ? '1px solid var(--color-border)' : 'none'
        }}>
          {bikes.length > 0 ? (
            bikes.map(bike => <BikeRow key={bike.id} bike={bike} />)
          ) : (
            <div style={{ padding: '16px 0', fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              No hay detalles de bicis disponibles.
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button 
          fullWidth 
          variant="secondary" 
          onClick={() => setSheetState('SHEET_INCIDENT_COMPOSER')}
        >
          Reportar problema
        </Button>
      </div>
    </motion.div>
  );
};
