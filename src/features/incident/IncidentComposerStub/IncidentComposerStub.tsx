// BeBe v0.2.4 Incident Minimum UI v1
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '../../../store/useUIStore';
import { useCoreStore } from '../../../store/useCoreStore';
import { mockTaxonomy } from '../../../data/mocks/taxonomy';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';

interface CategoryRowProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryRow = ({ label, isSelected, onClick }: CategoryRowProps) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '8px', cursor: 'pointer',
      border: isSelected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
      backgroundColor: isSelected ? '#FFF1F2' : 'var(--color-surface-soft)',
      transition: 'all 0.15s ease'
    }}
  >
    <span style={{ fontSize: 15, fontWeight: isSelected ? 700 : 600, color: isSelected ? 'var(--color-accent)' : 'var(--color-text-main)' }}>
      {label}
    </span>
    {isSelected && <CheckCircle2 size={20} color="var(--color-accent)" strokeWidth={2.5} />}
  </div>
);

export const IncidentComposerStub = () => {
  const { setSheetState, incidentReturnState } = useUIStore();
  const { selectedStationId } = useCoreStore();
  
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const station = mockStations.find(s => s.id === selectedStationId);

  return (
    <motion.div id="incident_composer_v1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setSheetState(incidentReturnState)}
          style={{ background: 'var(--color-surface-soft)', border: '1px solid var(--color-border)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <ArrowLeft size={18} color="var(--color-text-main)" />
        </button>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-main)', margin: 0, letterSpacing: '-0.02em' }}>
            Reportar problema
          </h2>
          {station && (
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              en {station.name}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          ¿Qué ocurre aquí?
        </div>
        {mockTaxonomy.map(tax => (
          <CategoryRow
            key={tax.id}
            id={tax.id}
            label={tax.label}
            isSelected={selected === tax.id}
            onClick={() => setSelected(tax.id)}
          />
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <textarea
          placeholder="Detalles adicionales (opcional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ 
            width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', 
            resize: 'none', fontFamily: 'inherit', fontSize: 14, backgroundColor: 'var(--color-surface-soft)',
            color: 'var(--color-text-main)'
          }}
          rows={3}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button fullWidth disabled={!selected} onClick={() => setSheetState('SHEET_INCIDENT_SUBMITTED')}>
          Enviar reporte
        </Button>
        <Button fullWidth variant="ghost" onClick={() => setSheetState(incidentReturnState)}>
          Cancelar
        </Button>
      </div>
    </motion.div>
  );
};
