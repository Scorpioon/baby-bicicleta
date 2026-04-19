// CCOS FILE VERSION: v0.2.19j
// CCOS LAST PATCH: nav_semantics_step1
// CCOS CHANGE TYPE: FEATURE
// CCOS FEATURE ID: BEBE_0219j_ID_1001
import { create } from 'zustand';

export type ResStatus = 'IDLE' | 'RESERVING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';

interface CoreState {
  lifecycle: 'IDLE' | 'STATION_SELECTED';
  selectedStationId: string | null;
  userLocation: { lng: number; lat: number } | null;
  destinationStationId: string | null;
  travelMode: 'WALK' | 'BIKE' | 'IDLE';
  setDestination: (id: string, mode?: 'WALK' | 'BIKE') => void;
  clearDestination: () => void;
  reservation: {
    status: ResStatus;
    stationId: string | null;
    expiresAt: number | null;
  };
  selectStation: (id: string) => void;
  clearSelection: () => void;
  startReservation: (id: string) => void;
  setReservationStatus: (status: ResStatus, expiresAt?: number | null) => void;
  cancelReservation: () => void;
}

export const useCoreStore = create<CoreState>((set) => ({
  lifecycle: 'IDLE',
  selectedStationId: null,
  userLocation: { lng: 2.1750, lat: 41.3880 },
  destinationStationId: null,
  travelMode: 'IDLE',
  setDestination: (id, mode = 'WALK') => set({ destinationStationId: id, travelMode: mode }),
  clearDestination: () => set({ destinationStationId: null, travelMode: 'IDLE' }),
  reservation: { status: 'IDLE', stationId: null, expiresAt: null },
  selectStation: (id) => set({ lifecycle: 'STATION_SELECTED', selectedStationId: id }),
  clearSelection: () => set({ lifecycle: 'IDLE', selectedStationId: null }),
  startReservation: (id) => set({ reservation: { status: 'RESERVING', stationId: id, expiresAt: null } }),
  setReservationStatus: (status, expiresAt = null) => set((state) => ({ 
    reservation: { ...state.reservation, status, expiresAt } 
  })),
  cancelReservation: () => set({ reservation: { status: 'IDLE', stationId: null, expiresAt: null } }),
}));

