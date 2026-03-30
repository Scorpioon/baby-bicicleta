import { create } from 'zustand';

export type SheetState = 'SHEET_CLOSED' | 'SHEET_STATION_VIEW' | 'SHEET_INCIDENT_COMPOSER' | 'SHEET_INCIDENT_SUBMITTED';

interface UIState {
  sheetState: SheetState;
  sheetHeightPx: number;
  setSheetState: (state: SheetState) => void;
  setSheetHeight: (height: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sheetState: 'SHEET_CLOSED',
  sheetHeightPx: 0,
  setSheetState: (state) => set({ sheetState: state }),
  setSheetHeight: (height) => set({ sheetHeightPx: height }),
}));
