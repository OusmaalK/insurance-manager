// src/modules/api/ia-settings/ia-settings.api.ts
// API Client pour la configuration IA
// <100 lignes

import { apiClient } from '../client/client';
import { IASettings, IASettingsStats } from '@/types/ia-settings.types';

const BASE_URL = '/settings/ia';

export const iaSettingsApi = {
  // ============================================
  // CONFIGURATION
  // ============================================

  // Récupérer la configuration IA
  async getSettings(): Promise<IASettings> {
    return apiClient.get<IASettings>(BASE_URL);
  },

  // Mettre à jour la configuration IA
  async updateSettings(data: Partial<IASettings>): Promise<IASettings> {
    return apiClient.put<IASettings>(BASE_URL, data);
  },

  // Réinitialiser la configuration par défaut
  async resetSettings(): Promise<IASettings> {
    return apiClient.post<IASettings>(`${BASE_URL}/reset`);
  },

  // Tester la configuration
  async testConfiguration(): Promise<{ success: boolean; message: string }> {
    return apiClient.post(`${BASE_URL}/test`);
  },

  // ============================================
  // STATISTIQUES
  // ============================================

  // Récupérer les statistiques IA
  async getStats(): Promise<IASettingsStats> {
    return apiClient.get<IASettingsStats>(`${BASE_URL}/stats`);
  },

  // ============================================
  // LOGS
  // ============================================

  // Récupérer les logs IA
  async getLogs(params?: { page?: number; limit?: number; module?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.module) searchParams.append('module', params.module);
    const url = searchParams.toString() ? `${BASE_URL}/logs?${searchParams}` : `${BASE_URL}/logs`;
    return apiClient.get(url);
  },
};

export default iaSettingsApi;