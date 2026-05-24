// src/stores/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsStore {
  settings: any;
  setSettings: (settings: any) => void;
  updateSection: (section: string, data: any) => void;
  updateField: (section: string, field: string, value: any) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: null,
      
      setSettings: (settings) => set({ settings }),
      
      updateSection: (section, data) => {
        const currentSettings = get().settings;
        set({
          settings: { ...currentSettings, [section]: data }
        });
      },
      
      updateField: (section, field, value) => {
        const currentSettings = get().settings;
        set({
          settings: {
            ...currentSettings,
            [section]: {
              ...currentSettings?.[section],
              [field]: value
            }
          }
        });
      },
      
      resetSettings: () => set({ settings: null }),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);