// src/stores/auditFilterStore.ts
import { create } from 'zustand';
import { AuditFilters } from '@/types/audit.types';

interface AuditFiltersState {
  filters: AuditFilters;
  isOpen: boolean;
  setFilter: (key: keyof AuditFilters, value: any) => void;
  setFilters: (filters: AuditFilters) => void;
  resetFilters: () => void;
  openFilters: () => void;
  closeFilters: () => void;
  toggleFilters: () => void;
}

const initialFilters: AuditFilters = {
  module: '',
  severity: undefined,
  status: undefined,
  startDate: '',
  endDate: '',
  search: '',
};

export const useAuditFilterStore = create<AuditFiltersState>((set) => ({
  filters: initialFilters,
  isOpen: false,
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: initialFilters }),
  openFilters: () => set({ isOpen: true }),
  closeFilters: () => set({ isOpen: false }),
  toggleFilters: () => set((state) => ({ isOpen: !state.isOpen })),
}));