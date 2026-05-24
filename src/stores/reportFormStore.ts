// src/stores/reportFormStore.ts
import { create } from 'zustand';

interface ReportFormStore {
  onSubmit: ((data: any) => Promise<void>) | null;
  onCancel: (() => void) | null;
  setActions: (actions: { onSubmit: (data: any) => Promise<void>; onCancel: () => void }) => void;
}

export const useReportFormStore = create<ReportFormStore>((set) => ({
  onSubmit: null,
  onCancel: null,
  setActions: (actions) => set({ onSubmit: actions.onSubmit, onCancel: actions.onCancel }),
}));