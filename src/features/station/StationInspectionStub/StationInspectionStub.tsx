import { motion } from 'framer-motion';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';
import { AlertCircle } from 'lucide-react';

export const StationInspectionStub = () => {
  const { selectedStationId } = useCoreStore();
  const setSheetState = useUIStore(s => s.setSheetState);
  
  const station = mockStations.find(s => s.id === selectedStationId);
  if (!station) return null;

  return (
    <motion.div id="station_inspection_stub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Estado de la estación</h2>
      </div>
      <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
        Exploración detallada de {station.name}. (Stub de la v0.2)
      </p>
      
      <div style={{ backgroundColor: '#FEE2E2', padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <AlertCircle size={20} color="var(--color-trust-red)" style={{ marginTop: 2 }} />
        <div>
          <span style={{ fontWeight: 600, color: 'var(--color-trust-red)' }}>Incidentes activos</span>
          <p style={{ fontSize: 13, color: 'var(--color-text-main)', marginTop: 4 }}>3 bicis reportadas con problemas de frenos en la última hora.</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button fullWidth variant="secondary" onClick={() => setSheetState('SHEET_INCIDENT_COMPOSER')}>Reportar problema</Button>
        <Button fullWidth variant="ghost" onClick={() => setSheetState('SHEET_STATION_VIEW')}>Volver al mapa</Button>
      </div>
    </motion.div>
  );
};
