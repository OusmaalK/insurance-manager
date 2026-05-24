// src/lib/api/ia-reports.ts
// API client pour les rapports IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/reports/ia';

export const iaReportsApi = {
  // Générer un rapport IA
  async generateReport(params: { 
    type: string; 
    period: 'WEEKLY' | 'MONTHLY'; 
    format?: 'pdf' | 'excel';
    includeCharts?: boolean;
  }): Promise<any> {
    try {
      const response = await apiClient.post(`${BASE_URL}/generate`, params);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to generate IA report:', error);
      return null;
    }
  },

  // Obtenir les insights IA
  async getInsights(params?: { period?: string; type?: string }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.append('period', params.period);
      if (params?.type) queryParams.append('type', params.type);
      const url = queryParams.toString() ? `${BASE_URL}/insights?${queryParams}` : `${BASE_URL}/insights`;
      const response = await apiClient.get(url);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get insights:', error);
      return null;
    }
  },

  // Exporter un rapport IA
  async exportReport(reportId: number, format: 'pdf' | 'excel'): Promise<Blob | null> {
    try {
      const response = await apiClient.get(`${BASE_URL}/export/${reportId}?format=${format}`, { responseType: 'blob' });
      return response as Blob;
    } catch (error) {
      console.error('Failed to export IA report:', error);
      return null;
    }
  },
};

export default iaReportsApi;