// src/lib/api/ia-dashboard.ts
// API client pour le dashboard IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/dashboard/ia';

export const iaDashboardApi = {
  // Obtenir les métriques du dashboard
  async getMetrics(params?: { period?: 'DAY' | 'WEEK' | 'MONTH' }): Promise<any> {
    try {
      const url = params?.period ? `${BASE_URL}/metrics?period=${params.period}` : `${BASE_URL}/metrics`;
      const response = await apiClient.get(url);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get dashboard metrics:', error);
      return null;
    }
  },

  // Obtenir les graphiques
  async getCharts(params?: { period?: string; type?: string }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.append('period', params.period);
      if (params?.type) queryParams.append('type', params.type);
      const url = queryParams.toString() ? `${BASE_URL}/charts?${queryParams}` : `${BASE_URL}/charts`;
      const response = await apiClient.get(url);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get charts:', error);
      return null;
    }
  },

  // Obtenir les alertes
  async getAlerts(limit?: number): Promise<any[]> {
    try {
      const url = limit ? `${BASE_URL}/alerts?limit=${limit}` : `${BASE_URL}/alerts`;
      const response = await apiClient.get(url);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get alerts:', error);
      return [];
    }
  },

  // Obtenir les recommandations
  async getRecommendations(): Promise<any[]> {
    try {
      const response = await apiClient.get(`${BASE_URL}/recommendations`);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return [];
    }
  },
};

export default iaDashboardApi;