// BeBe v0.2.4 Incident Minimum UI v1
import React from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../../store/useUIStore';
import { Button } from '../../../components/ui/Button/Button';
import { Check } from 'lucide-react';

export const IncidentSubmittedState = () => {
  const { setSheetState, incidentReturnState } = useUIStore();

  return (
    <motion.div id="incident_submitted_v1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} style={{ textAlign: 'center', padding: '32px 0 16px' }}>
      <div style={{ width: 64, height: 64, backgroundColor: 'var(--color-trust-green-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <Check size={32} color="var(--color-trust-green)" strokeWidth={3} />
      </div>
      
      <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>
        Reporte enviado
      </h3>
      
      <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginBottom: 32, lineHeight: 1.4, padding: '0 16px' }}>
        Gracias por avisar. Tu colaboración ayuda a mantener la red fiable para todos.
      </p>
      
      <Button fullWidth variant="secondary" onClick={() => setSheetState(incidentReturnState)}>
        Volver a la estación
      </Button>
    </motion.div>
  );
};
