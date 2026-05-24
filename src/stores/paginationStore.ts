// src/stores/paginationStore.ts
'use client';

import { create } from 'zustand';

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChangeCallback: ((page: number) => void) | null;
  onPageSizeChangeCallback: ((size: number) => void) | null;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  registerCallbacks: (
    onPageChange: (page: number) => void,
    onPageSizeChange?: (size: number) => void
  ) => void;
}

export const usePaginationStore = create<PaginationState>((set, get) => ({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  onPageChangeCallback: null,
  onPageSizeChangeCallback: null,
  
  setPage: (page) => {
    const { onPageChangeCallback } = get();
    set({ currentPage: page });
    if (onPageChangeCallback) onPageChangeCallback(page);
  },
  
  setPageSize: (size) => {
    const { onPageSizeChangeCallback } = get();
    set({ pageSize: size, currentPage: 1 });
    if (onPageSizeChangeCallback) onPageSizeChangeCallback(size);
  },
  
  setTotalItems: (total) => set({ totalItems: total }),
  
  registerCallbacks: (onPageChange, onPageSizeChange) => {
    set({
      onPageChangeCallback: onPageChange,
      onPageSizeChangeCallback: onPageSizeChange || null,
    });
  },
}));