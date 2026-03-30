import { motion } from 'framer-motion';
import { useUIStore } from '../../../store/useUIStore';
import { Button } from '../../../components/ui/Button/Button';

export const IncidentSubmittedState = () => {
  const setSheetState = useUIStore(s => s.setSheetState);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ width: 48, height: 48, backgroundColor: 'var(--color-trust-green-soft)', color: 'var(--color-trust-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>
        ✓
      </div>
      <h3 style={{ fontSize: 20, marginBottom: 8 }}>Gracias por avisar</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
        Tu reporte ayuda a mantener la red fiable para todos.
      </p>
      <Button fullWidth variant="secondary" onClick={() => setSheetState('SHEET_STATION_VIEW')}>Cerrar</Button>
    </motion.div>
  );
};
