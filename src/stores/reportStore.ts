// src/stores/reportStore.ts
import { create } from 'zustand';

interface ReportStore {
  selectedReportId: number | null;
  setSelectedReport: (id: number | null) => void;
  exportReport: (id: number) => void;
  viewReport: (id: number) => void;
  setActions: (actions: { exportReport: (id: number) => void; viewReport: (id: number) => void }) => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  selectedReportId: null,
  setSelectedReport: (id) => set({ selectedReportId: id }),
  exportReport: () => {},
  viewReport: () => {},
  setActions: (actions) => set({ exportReport: actions.exportReport, viewReport: actions.viewReport }),
}));