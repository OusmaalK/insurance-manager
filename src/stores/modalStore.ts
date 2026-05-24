// src/stores/modalStore.ts
// Store pour gérer l'état des modales sans props fonctions
'use client';

import { create } from 'zustand';

interface ModalState {
  modals: Record<string, boolean>;
  modalData: Record<string, any>;
  openModal: (id: string, data?: any) => void;
  closeModal: (id: string) => void;
  getModalData: (id: string) => any;
}

export const useModalStore = create<ModalState>((set, get) => ({
  modals: {},
  modalData: {},
  
  openModal: (id: string, data?: any) => {
    set((state) => ({
      modals: { ...state.modals, [id]: true },
      modalData: { ...state.modalData, [id]: data },
    }));
  },
  
  closeModal: (id: string) => {
    set((state) => ({
      modals: { ...state.modals, [id]: false },
    }));
  },
  
  getModalData: (id: string) => {
    return get().modalData[id];
  },
}));