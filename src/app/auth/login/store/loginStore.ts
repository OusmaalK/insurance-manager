// src/app/auth/login/store/loginStore.ts
'use client';

import { create } from 'zustand';
import type { LoginCredentials } from '../types';

interface LoginStore {
  onSubmit: ((credentials: LoginCredentials) => Promise<void>) | null;
  onDemoSelect: ((email: string, password: string) => void) | null;
  isLoading: boolean;
  error: string | null;
  setActions: (actions: { 
    onSubmit: (credentials: LoginCredentials) => Promise<void>;
    onDemoSelect: (email: string, password: string) => void;
  }) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useLoginStore = create<LoginStore>((set) => ({
  onSubmit: null,
  onDemoSelect: null,
  isLoading: false,
  error: null,
  setActions: (actions) => {
    set((state) => {
      if (state.onSubmit === actions.onSubmit && state.onDemoSelect === actions.onDemoSelect) {
        return {};
      }
      return { 
        onSubmit: actions.onSubmit, 
        onDemoSelect: actions.onDemoSelect 
      };
    });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));