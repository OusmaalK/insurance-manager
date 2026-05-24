// src/stores/auditExportStore.ts
import { create } from 'zustand';

interface AuditExportState {
  isExporting: boolean;
  exportSuccess: string | null;
  isOpen: boolean;
  startExport: () => void;
  finishExport: (format: string) => void;
  resetExport: () => void;
  openDropdown: () => void;
  closeDropdown: () => void;
  toggleDropdown: () => void;
}

export const useAuditExportStore = create<AuditExportState>((set) => ({
  isExporting: false,
  exportSuccess: null,
  isOpen: false,
  startExport: () => set({ isExporting: true, exportSuccess: null }),
  finishExport: (format) => set({ 
    isExporting: false, 
    exportSuccess: format.toUpperCase(), 
    isOpen: false 
  }),
  resetExport: () => set({ isExporting: false, exportSuccess: null }),
  openDropdown: () => set({ isOpen: true }),
  closeDropdown: () => set({ isOpen: false }),
  toggleDropdown: () => set((state) => ({ isOpen: !state.isOpen })),
}));