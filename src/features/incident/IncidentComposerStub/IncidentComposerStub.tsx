import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../../store/useUIStore';
import { mockTaxonomy } from '../../../data/mocks/taxonomy';
import { Button } from '../../../components/ui/Button/Button';
import { Card } from '../../../components/ui/Card/Card';

export const IncidentComposerStub = () => {
  const setSheetState = useUIStore(s => s.setSheetState);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h3 style={{ fontSize: 18, marginBottom: 16 }}>¿Qué ocurre aquí?</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {mockTaxonomy.map(tax => (
          <Card 
            key={tax.id} 
            onClick={() => setSelected(tax.id)}
            style={{ 
              cursor: 'pointer', textAlign: 'center', padding: '12px 8px',
              borderColor: selected === tax.id ? 'var(--color-accent)' : 'var(--color-border)',
              backgroundColor: selected === tax.id ? '#FFF1F2' : 'var(--color-surface-base)'
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500 }}>{tax.label}</div>
          </Card>
        ))}
      </div>

      <textarea 
        placeholder="Nota opcional..." 
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: 24, resize: 'none', fontFamily: 'inherit' }} 
        rows={2} 
      />

      <div style={{ display: 'flex', gap: 12 }}>
        <Button fullWidth variant="ghost" onClick={() => setSheetState('SHEET_STATION_VIEW')}>Cancelar</Button>
        <Button fullWidth disabled={!selected} onClick={() => setSheetState('SHEET_INCIDENT_SUBMITTED')}>Enviar</Button>
      </div>
    </motion.div>
  );
};
