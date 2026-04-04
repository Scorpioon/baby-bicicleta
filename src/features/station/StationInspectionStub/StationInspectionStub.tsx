// BeBe v0.2.4 Incident Minimum UI v1
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Clock, Cog, Zap, ArrowDownToLine } from 'lucide-react';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';
import { Chip } from '../../../components/ui/Chip/Chip';

// Explicit Prop Typing for ad-hoc components
interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color?: string;
}

const StatRow = ({ icon, label, value, color = 'var(--color-text-main)' }: StatRowProps) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {icon}
      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)' }}>{label}</span>
    </div>
    <span style={{ fontSize: 16, fontWeight: 800, color }}>{value}</span>
  </div>
);

export const StationInspectionStub = () => {
  const { selectedStationId } = useCoreStore();
  const { setSheetState, setIncidentReturnState } = useUIStore();
  
  const station = mockStations.find(s => s.id === selectedStationId);
  if (!station) return null;

  const formatId = (idStr: string) => String(idStr).padStart(4, '0');

  const handleReport = () => {
    setIncidentReturnState('SHEET_STATION_INSPECT');
    setSheetState('SHEET_INCIDENT_COMPOSER');
  };

  return (
    <motion.div id="station_inspection_v1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      {/* Top Header / Back Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button 
          onClick={() => setSheetState('SHEET_STATION_VIEW')}
          style={{ background: 'var(--color-surface-soft)', border: '1px solid var(--color-border)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ArrowLeft size={18} color="var(--color-text-main)" />
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-main)', margin: 0, letterSpacing: '-0.02em' }}>
          Estado detallado
        </h2>
      </div>

      {/* Identity */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          #{formatId(station.stationNumber)} - {station.streetName}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>
          <Clock size={13} />
          <span>Actualizado {station.dataFreshnessLabel}</span>
        </div>
      </div>

      {/* Trust & Confidence Module (Always visible in inspection) */}
      <div style={{ backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: 24, border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Chip label={station.confidenceLabel} trustLevel={station.confidenceState as 'HIGH'|'MEDIUM'|'LOW'} />
        </div>
        <p style={{ fontSize: 14, color: 'var(--color-text-main)', margin: 0, lineHeight: 1.4 }}>
          {station.confidenceCopy}
        </p>
      </div>

      {/* Issue Hints Module */}
      {station.issueHint && (
        <div style={{ backgroundColor: '#FEF2F2', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start', border: '1px solid #FECACA' }}>
          <AlertTriangle size={18} color="var(--color-trust-red)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-trust-red)', display: 'block', marginBottom: 2 }}>Incidencias detectadas</span>
            <p style={{ fontSize: 13, color: 'var(--color-trust-red)', margin: 0, opacity: 0.9, lineHeight: 1.4 }}>{station.issueHint}</p>
          </div>
        </div>
      )}

      {/* Inventory Rollup */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', marginBottom: 8 }}>Inventario en tiempo real</h4>
        <StatRow icon={<Cog size={18} strokeWidth={2.5} color="var(--color-text-main)" />} label="Bicis mecánicas" value={station.mechanicalCount} />
        <StatRow icon={<Zap size={18} strokeWidth={2.5} color="#3B82F6" />} label="Bicis eléctricas" value={station.electricCount} color="#3B82F6" />
        <StatRow icon={<ArrowDownToLine size={18} strokeWidth={2.5} color="var(--color-text-main)" />} label="Anclajes libres" value={station.dockCount} />
      </div>

      {/* Bottom Action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button fullWidth variant="secondary" onClick={handleReport}>
          Reportar un problema
        </Button>
      </div>
    </motion.div>
  );
};
