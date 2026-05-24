// src/lib/api/ia-settings.ts
// API client pour les paramètres IA
// <70 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/settings/ia';

export interface IASettings {
  fraud_detection: {
    enabled: boolean;
    sensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
    auto_alert_threshold: number;
    daily_analysis: boolean;
  };
  auto_approval: {
    enabled: boolean;
    max_amount: number;
    min_risk_score: number;
    required_documents: string[];
  };
  notifications: {
    on_fraud_detected: boolean;
    on_risk_alert: boolean;
    on_report_ready: boolean;
    email_notifications: boolean;
    push_notifications: boolean;
  };
  privacy: {
    data_retention_days: number;
    anonymize_data: boolean;
    allow_training: boolean;
  };
}

export const iaSettingsApi = {
  // Récupérer tous les paramètres
  async getAll(): Promise<IASettings | null> {
    try {
      const response = await apiClient.get(BASE_URL);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get IA settings:', error);
      return null;
    }
  },

  // Récupérer une catégorie
  async getCategory(category: string): Promise<any> {
    try {
      const response = await apiClient.get(`${BASE_URL}/${category}`);
      return (response as any).data || response;
    } catch (error) {
      console.error(`Failed to get ${category} settings:`, error);
      return null;
    }
  },

  // Mettre à jour un paramètre
  async updateSetting(category: string, key: string, value: any): Promise<boolean> {
    try {
      await apiClient.put(`${BASE_URL}/${category}/${key}`, { value });
      return true;
    } catch (error) {
      console.error('Failed to update setting:', error);
      return false;
    }
  },

  // Mise à jour par lot
  async batchUpdate(updates: Array<{ category: string; key: string; value: any }>): Promise<boolean> {
    try {
      await apiClient.post(`${BASE_URL}/batch`, { updates });
      return true;
    } catch (error) {
      console.error('Failed to batch update settings:', error);
      return false;
    }
  },

  // Réinitialiser
  async resetAll(): Promise<boolean> {
    try {
      await apiClient.post(`${BASE_URL}/reset`);
      return true;
    } catch (error) {
      console.error('Failed to reset settings:', error);
      return false;
    }
  },
};

export default iaSettingsApi;