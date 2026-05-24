// src/lib/api/ia-audit.ts
// API client pour l'audit IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/audit/ia';

export const iaAuditApi = {
  // Récupérer les logs IA
  async getLogs(params?: { 
    startDate?: string; 
    endDate?: string; 
    userId?: number; 
    action?: string;
    limit?: number;
  }): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.userId) queryParams.append('userId', params.userId.toString());
      if (params?.action) queryParams.append('action', params.action);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const url = queryParams.toString() ? `${BASE_URL}/logs?${queryParams}` : `${BASE_URL}/logs`;
      const response = await apiClient.get(url);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get audit logs:', error);
      return [];
    }
  },

  // Récupérer les métriques de performance IA
  async getPerformanceMetrics(params?: { period?: 'DAY' | 'WEEK' | 'MONTH' }): Promise<any> {
    try {
      const url = params?.period ? `${BASE_URL}/performance?period=${params.period}` : `${BASE_URL}/performance`;
      const response = await apiClient.get(url);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      return null;
    }
  },

  // Exporter les logs
  async exportLogs(params?: { startDate?: string; endDate?: string; format?: 'json' | 'csv' }): Promise<Blob | null> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.format) queryParams.append('format', params.format);
      
      const url = queryParams.toString() ? `${BASE_URL}/export?${queryParams}` : `${BASE_URL}/export`;
      const response = await apiClient.get(url, { responseType: 'blob' });
      return response as Blob;
    } catch (error) {
      console.error('Failed to export logs:', error);
      return null;
    }
  },
};

export default iaAuditApi;