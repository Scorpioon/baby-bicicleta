// CCOS FILE VERSION: v0.2.21a
// CCOS LAST PATCH: navigation_cancellation_ui
// CCOS CHANGE TYPE: FEATURE
// CCOS FEATURE ID: BEBE_0221a_ID_1001
import { MapView } from '../../components/core/MapView/MapView';
import { BottomSheetHost } from '../../components/core/BottomSheetHost/BottomSheetHost';
import { useCoreStore } from '../../store/useCoreStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Layout = () => {
  const { destinationStationId, clearDestination } = useCoreStore();
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <MapView />
      
      <AnimatePresence>
        {destinationStationId && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute',
              top: 'env(safe-area-inset-top, 16px)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 110,
              marginTop: 16
            }}
          >
            <button
              onClick={() => clearDestination()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'var(--color-surface-base)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sheet)',
                padding: '8px 16px 8px 12px',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 14,
                color: 'var(--color-text-main)'
              }}
            >
              <div style={{ backgroundColor: 'var(--color-surface-soft)', borderRadius: '50%', padding: 4, display: 'flex' }}>
                <X size={14} color="var(--color-text-muted)" strokeWidth={3} />
              </div>
              Cancelar ruta
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomSheetHost />
    </div>
  );
};
