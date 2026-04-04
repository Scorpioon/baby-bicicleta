// BeBe v0.2.3 Pickup Minimum UI
import React from 'react';
import { motion } from 'framer-motion';
import { useCoreStore } from '../../../store/useCoreStore';
import { useUIStore } from '../../../store/useUIStore';
import { mockStations } from '../../../data/mocks/stations';
import { Button } from '../../../components/ui/Button/Button';
import { ArrowLeft, QrCode, Hash } from 'lucide-react';

interface ActionRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

const ActionRow = ({ icon, title, subtitle, onClick }: ActionRowProps) => (
  <div 
    onClick={onClick}
    style={{ 
      display: 'flex', alignItems: 'center', gap: 16, padding: '16px', 
      backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)', 
      cursor: 'pointer', border: '1px solid var(--color-border)', marginBottom: 12,
      transition: 'background-color 0.2s ease'
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-border)'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)'}
  >
    <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-base)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-main)', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div style={{ flexGrow: 1 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.3 }}>{subtitle}</div>
    </div>
  </div>
);

export const PickupModeStub = () => {
  const { reservation, selectedStationId } = useCoreStore();
  const setSheetState = useUIStore(s => s.setSheetState);
  
  const isFromReservation = reservation.status === 'SUCCESS';
  const activeStationId = isFromReservation ? reservation.stationId : selectedStationId;
  const station = mockStations.find(s => s.id === activeStationId);

  const handleBack = () => {
    setSheetState(isFromReservation ? 'SHEET_RESERVATION_LIVE' : 'SHEET_STATION_VIEW');
  };

  if (!station) return null;

  return (
    <motion.div id="pickup_mode_v1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      {/* Top Header / Back Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button 
          onClick={handleBack}
          style={{ background: 'var(--color-surface-soft)', border: '1px solid var(--color-border)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ArrowLeft size={18} color="var(--color-text-main)" />
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-main)', margin: 0, letterSpacing: '-0.02em' }}>
          Desbloquear bici
        </h2>
      </div>

      {/* Station Context */}
      <div style={{ marginBottom: 24, padding: '0 4px' }}>
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
          Estación actual
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>
          {station.name}
        </h3>
      </div>

      {/* Action Paths */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ActionRow 
          icon={<QrCode size={24} />} 
          title="Escanear código QR" 
          subtitle="Apunta la cámara al manillar o guardabarros de la bici" 
        />
        
        <ActionRow 
          icon={<Hash size={24} />} 
          title="Introducir número" 
          subtitle="Úsalo si el QR está dañado o no se lee bien" 
        />
      </div>

      {/* Exit Path */}
      <div style={{ marginTop: 12 }}>
        <Button fullWidth variant="ghost" onClick={handleBack}>
          Cancelar
        </Button>
      </div>
    </motion.div>
  );
};
