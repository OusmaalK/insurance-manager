// src/stores/notificationStore.ts
import { create } from 'zustand';

interface NotificationStore {
  selectedNotificationId: number | null;
  isDeleteConfirmOpen: boolean;
  openDeleteConfirm: (id: number) => void;
  closeDeleteConfirm: () => void;
  setSelectedNotification: (id: number | null) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  selectedNotificationId: null,
  isDeleteConfirmOpen: false,
  openDeleteConfirm: (id) => set({ selectedNotificationId: id, isDeleteConfirmOpen: true }),
  closeDeleteConfirm: () => set({ selectedNotificationId: null, isDeleteConfirmOpen: false }),
  setSelectedNotification: (id) => set({ selectedNotificationId: id }),
}));