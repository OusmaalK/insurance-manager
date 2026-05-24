// src/stores/notificationFilterStore.ts
import { create } from 'zustand';

interface NotificationFilterState {
  isOpen: boolean;
  filters: {
    type: string;
    priority: string;
    category: string;
    search: string;
    status: string;
    period: string;
  };
  openFilters: () => void;
  closeFilters: () => void;
  toggleFilters: () => void;
  setFilter: (key: string, value: string) => void;
  resetFilters: () => void;
  getActiveFilters: () => Record<string, string>;
}

const initialState = {
  type: '',
  priority: '',
  category: '',
  search: '',
  status: '',
  period: '',
};

export const useNotificationFilterStore = create<NotificationFilterState>((set, get) => ({
  isOpen: false,
  filters: initialState,
  openFilters: () => set({ isOpen: true }),
  closeFilters: () => set({ isOpen: false }),
  toggleFilters: () => set((state) => ({ isOpen: !state.isOpen })),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  resetFilters: () => set({ filters: initialState }),
  getActiveFilters: () => {
    const { filters } = get();
    const active: Record<string, string> = {};
    if (filters.type) active.type = filters.type;
    if (filters.priority) active.priority = filters.priority;
    if (filters.category) active.category = filters.category;
    if (filters.search) active.search = filters.search;
    if (filters.status) active.status = filters.status;
    return active;
  },
}));