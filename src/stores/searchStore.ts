// src/stores/searchStore.ts
'use client';

import { create } from 'zustand';

interface SearchState {
  searchValue: string;
  onSearchCallback: ((search: string) => void) | null;
  setSearchValue: (value: string) => void;
  performSearch: () => void;
  clearSearch: () => void;
  registerSearchCallback: (callback: (search: string) => void) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchValue: '',
  onSearchCallback: null,
  setSearchValue: (value) => set({ searchValue: value }),
  performSearch: () => {
    const { onSearchCallback, searchValue } = get();
    if (onSearchCallback) {
      onSearchCallback(searchValue);
    }
  },
  clearSearch: () => {
    const { onSearchCallback } = get();
    set({ searchValue: '' });
    if (onSearchCallback) {
      onSearchCallback('');
    }
  },
  registerSearchCallback: (callback) => set({ onSearchCallback: callback }),
}));