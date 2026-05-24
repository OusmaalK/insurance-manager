// src/stores/policyFormStore.ts
'use client';

import { create } from 'zustand';
import { PolicyFormData } from '@/types/policy.types';

interface PolicyFormState {
  isOpen: boolean;
  initialData: PolicyFormData | null;
  onSubmit: ((data: PolicyFormData) => Promise<void>) | null;
  openForm: (onSubmit: (data: PolicyFormData) => Promise<void>, initialData?: PolicyFormData) => void;
  closeForm: () => void;
  submitForm: (data: PolicyFormData) => Promise<void>;
}

export const usePolicyFormStore = create<PolicyFormState>((set, get) => ({
  isOpen: false,
  initialData: null,
  onSubmit: null,
  openForm: (onSubmit, initialData) => set({ isOpen: true, onSubmit, initialData: initialData || null }),
  closeForm: () => set({ isOpen: false, onSubmit: null, initialData: null }),
  submitForm: async (data) => {
    const { onSubmit } = get();
    if (onSubmit) {
      await onSubmit(data);
      get().closeForm();
    }
  },
}));