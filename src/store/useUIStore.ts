import { create } from 'zustand';

export type SheetState = 
  | 'SHEET_CLOSED' 
  | 'SHEET_STATION_VIEW' 
  | 'SHEET_STATION_INSPECT'
  | 'SHEET_INCIDENT_COMPOSER' 
  | 'SHEET_INCIDENT_SUBMITTED' 
  | 'SHEET_RESERVATION_LIVE'
  | 'SHEET_PICKUP_MODE';

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
