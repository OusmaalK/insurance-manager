// src/stores/companyFormStore.ts
'use client';

import { create } from 'zustand';
import { CompanyFormData } from '@/types/company.types';

interface CompanyFormState {
  isOpen: boolean;
  initialData: CompanyFormData | null;
  onSubmit: ((data: CompanyFormData) => Promise<void>) | null;
  openForm: (onSubmit: (data: CompanyFormData) => Promise<void>, initialData?: CompanyFormData) => void;
  closeForm: () => void;
  submitForm: (data: CompanyFormData) => Promise<void>;
}

export const useCompanyFormStore = create<CompanyFormState>((set, get) => ({
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