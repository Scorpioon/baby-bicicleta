import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../../store/useUIStore';
import { StationSheetStub } from '../../../features/station/StationSheetStub/StationSheetStub';
import { StationInspectionStub } from '../../../features/station/StationInspectionStub/StationInspectionStub';
import { ReservationLiveMode } from '../../../features/reservation/ReservationLiveMode/ReservationLiveMode';
import { PickupModeStub } from '../../../features/pickup/PickupModeStub/PickupModeStub';
import { IncidentComposerStub } from '../../../features/incident/IncidentComposerStub/IncidentComposerStub';
import { IncidentSubmittedState } from '../../../features/incident/IncidentSubmittedState/IncidentSubmittedState';

export const BottomSheetHost = () => {
  const { sheetState, setSheetHeight } = useUIStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sheetState === 'SHEET_CLOSED') {
      setSheetHeight(0);
    } else if (containerRef.current) {
      setSheetHeight(containerRef.current.offsetHeight);
    }
  }, [sheetState, setSheetHeight]);

  // Use ResizeObserver for dynamic height changes inside live modes
  useEffect(() => {
    if (!containerRef.current || sheetState === 'SHEET_CLOSED') return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) setSheetHeight(entry.target.getBoundingClientRect().height);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [sheetState, setSheetHeight]);

  if (sheetState === 'SHEET_CLOSED') return null;

  return (
    <motion.div
      ref={containerRef}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'var(--color-surface-base)',
        borderTopLeftRadius: 'var(--radius-sheet)', borderTopRightRadius: 'var(--radius-sheet)',
        boxShadow: 'var(--shadow-sheet)', zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ width: 40, height: 4, backgroundColor: 'var(--color-border)', borderRadius: 2, margin: '12px auto' }} />
      <div style={{ padding: '0 20px 24px', position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {sheetState === 'SHEET_STATION_VIEW' && <StationSheetStub key="station" />}
          {sheetState === 'SHEET_STATION_INSPECT' && <StationInspectionStub key="inspect" />}
          {sheetState === 'SHEET_RESERVATION_LIVE' && <ReservationLiveMode key="live" />}
          {sheetState === 'SHEET_PICKUP_MODE' && <PickupModeStub key="pickup" />}
          {sheetState === 'SHEET_INCIDENT_COMPOSER' && <IncidentComposerStub key="composer" />}
          {sheetState === 'SHEET_INCIDENT_SUBMITTED' && <IncidentSubmittedState key="submitted" />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
