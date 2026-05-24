// src/modules/api/settings/settings.api.ts
// API Client pour le module Settings
// <100 lignes

import { apiClient } from '../client/client';
import { 
  GeneralSettings, 
  SecuritySettings, 
  BillingSettings, 
  ApiSettings, 
  SettingsStats,
  ApiKey 
} from '@/types/settings.types';

const BASE_URL = '/settings';

export const settingsApi = {
  // ============================================
  // PARAMÈTRES GÉNÉRAUX
  // ============================================

  async getGeneral(): Promise<GeneralSettings> {
    return apiClient.get<GeneralSettings>(`${BASE_URL}/general`);
  },

  async updateGeneral(data: Partial<GeneralSettings>): Promise<GeneralSettings> {
    return apiClient.put<GeneralSettings>(`${BASE_URL}/general`, data);
  },

  // ============================================
  // SÉCURITÉ
  // ============================================

  async getSecurity(): Promise<SecuritySettings> {
    return apiClient.get<SecuritySettings>(`${BASE_URL}/security`);
  },

  async updateSecurity(data: Partial<SecuritySettings>): Promise<SecuritySettings> {
    return apiClient.put<SecuritySettings>(`${BASE_URL}/security`, data);
  },

  // ============================================
  // FACTURATION
  // ============================================

  async getBilling(): Promise<BillingSettings> {
    return apiClient.get<BillingSettings>(`${BASE_URL}/billing`);
  },

  async updateBilling(data: Partial<BillingSettings>): Promise<BillingSettings> {
    return apiClient.put<BillingSettings>(`${BASE_URL}/billing`, data);
  },

  async upgradePlan(plan: string) {
    return apiClient.post(`${BASE_URL}/billing/upgrade`, { plan });
  },

  async cancelSubscription() {
    return apiClient.post(`${BASE_URL}/billing/cancel`);
  },

  // ============================================
  // API & WEBHOOKS
  // ============================================

  async getApiSettings(): Promise<ApiSettings> {
    return apiClient.get<ApiSettings>(`${BASE_URL}/api`);
  },

  async updateApiSettings(data: Partial<ApiSettings>): Promise<ApiSettings> {
    return apiClient.put<ApiSettings>(`${BASE_URL}/api`, data);
  },

  async createApiKey(name: string): Promise<ApiKey> {
    return apiClient.post<ApiKey>(`${BASE_URL}/api/keys`, { name });
  },

  async deleteApiKey(id: number): Promise<void> {
    return apiClient.delete(`${BASE_URL}/api/keys/${id}`);
  },

  async testWebhook(): Promise<{ success: boolean; message: string }> {
    return apiClient.post(`${BASE_URL}/api/webhook/test`);
  },

  // ============================================
  // STATISTIQUES
  // ============================================

  async getStats(): Promise<SettingsStats> {
    return apiClient.get<SettingsStats>(`${BASE_URL}/stats`);
  },
};

export default settingsApi;