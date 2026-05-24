// src/stores/iaSettingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_SETTINGS } from '@/types/ia-settings.types';

interface IASettingsStore {
  // État
  settings: any;
  isSaving: boolean;
  isTesting: boolean;
  testResult: { success: boolean; message: string } | null;
  activeTab: string;
  
  // Actions
  setSettings: (settings: any) => void;
  updateSection: (section: string, data: any) => void;
  updateField: (section: string, field: string, value: any) => void;
  setActiveTab: (tab: string) => void;
  setTestResult: (result: { success: boolean; message: string } | null) => void;
  setSaving: (isSaving: boolean) => void;
  setTesting: (isTesting: boolean) => void;
  resetSettings: () => void;
  applyRecommendation: (recommendationId: number) => Promise<void>; // NOUVEAU
}

export const useIASettingsStore = create<IASettingsStore>()(
  persist(
    (set, get) => ({
      // État initial
      settings: DEFAULT_SETTINGS,
      isSaving: false,
      isTesting: false,
      testResult: null,
      activeTab: 'fraud',

      // Actions
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
              ...currentSettings[section],
              [field]: value
            }
          }
        });
      },
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setTestResult: (result) => set({ testResult: result }),
      
      setSaving: (isSaving) => set({ isSaving }),
      
      setTesting: (isTesting) => set({ isTesting }),
      
      resetSettings: () => set({ settings: DEFAULT_SETTINGS, testResult: null }),

      // NOUVELLE FONCTION : Appliquer une recommandation IA
      applyRecommendation: async (recommendationId: number) => {
        const { settings, updateSection, updateField } = get();
        
        // Simuler un délai d'application
        set({ isSaving: true });
        
        try {
          // Simulation d'appel API (à remplacer par un vrai appel)
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Appliquer les recommandations en fonction de l'ID
          switch (recommendationId) {
            case 1: // Activer la double authentification
              if (settings?.security) {
                updateField('security', 'twoFactorEnabled', true);
              }
              break;
              
            case 2: // Augmenter le cache API
              if (settings?.performance) {
                updateField('performance', 'cacheDuration', 300);
              }
              break;
              
            case 3: // Passer au plan Enterprise
              if (settings?.billing) {
                updateField('billing', 'plan', 'ENTERPRISE');
              }
              break;
              
            case 4: // Activer l'auto-approbation
              if (settings?.autoApproval) {
                updateField('autoApproval', 'enabled', true);
                updateField('autoApproval', 'maxAmount', 10000);
              }
              break;
              
            case 5: // Augmenter la sensibilité anti-fraude
              if (settings?.fraudDetection) {
                updateField('fraudDetection', 'sensitivityLevel', 'high');
                updateField('fraudDetection', 'alertThreshold', 85);
              }
              break;
              
            default:
              console.warn(`Recommandation ${recommendationId} non reconnue`);
          }
          
          // Optionnel: ajouter la recommandation à un historique
          const appliedRecommendations = settings?.appliedRecommendations || [];
          updateSection('appliedRecommendations', [...appliedRecommendations, recommendationId]);
          
          // Afficher un message de succès (optionnel via le store)
          set({ 
            testResult: { 
              success: true, 
              message: `Recommandation appliquée avec succès` 
            }
          });
          
          // Effacer le message après 3 secondes
          setTimeout(() => {
            set({ testResult: null });
          }, 3000);
          
        } catch (error) {
          console.error('Erreur lors de l\'application de la recommandation:', error);
          set({ 
            testResult: { 
              success: false, 
              message: `Erreur lors de l'application de la recommandation` 
            }
          });
        } finally {
          set({ isSaving: false });
        }
      },
    }),
    {
      name: 'ia-settings-storage',
      partialize: (state) => ({ 
        settings: state.settings,
        // Ne pas persister les états temporaires
        // isSaving, isTesting, testResult, activeTab ne sont pas persistés
      }),
    }
  )
);