// src/stores/auditModalStore.ts
import { create } from 'zustand';

interface AuditModalState {
  isOpen: boolean;
  log: any | null;
  openModal: (log: any) => void;
  closeModal: () => void;
  setLog: (log: any) => void;
}

export const useAuditModalStore = create<AuditModalState>((set) => ({
  isOpen: false,
  log: null,
  openModal: (log) => set({ isOpen: true, log }),
  closeModal: () => set({ isOpen: false, log: null }),
  setLog: (log) => set({ log }),
}));