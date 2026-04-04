// BeBe v0.2.4 Incident Minimum UI v1
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
  incidentReturnState: SheetState;
  setSheetState: (state: SheetState) => void;
  setSheetHeight: (height: number) => void;
  setIncidentReturnState: (state: SheetState) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sheetState: 'SHEET_CLOSED',
  sheetHeightPx: 0,
  incidentReturnState: 'SHEET_STATION_VIEW',
  setSheetState: (state) => set({ sheetState: state }),
  setSheetHeight: (height) => set({ sheetHeightPx: height }),
  setIncidentReturnState: (state) => set({ incidentReturnState: state }),
}));
