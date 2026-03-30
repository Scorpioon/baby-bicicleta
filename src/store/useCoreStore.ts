import { create } from 'zustand';

type CoreLifecycle = 'IDLE' | 'STATION_SELECTED';

interface CoreState {
  lifecycle: CoreLifecycle;
  selectedStationId: string | null;
  selectStation: (id: string) => void;
  clearSelection: () => void;
}

export const useCoreStore = create<CoreState>((set) => ({
  lifecycle: 'IDLE',
  selectedStationId: null,
  selectStation: (id) => set({ lifecycle: 'STATION_SELECTED', selectedStationId: id }),
  clearSelection: () => set({ lifecycle: 'IDLE', selectedStationId: null }),
}));
