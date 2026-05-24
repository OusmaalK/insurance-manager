// src/lib/api/ia-commission.ts
// API client pour les commissions IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/commissions/ai';

export const iaCommissionApi = {
  // Prévisions de commissions
  async getForecast(params?: { period?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'; companyId?: number }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.append('period', params.period);
      if (params?.companyId) queryParams.append('companyId', params.companyId.toString());
      
      const url = queryParams.toString() ? `${BASE_URL}/forecast?${queryParams}` : `${BASE_URL}/forecast`;
      const response = await apiClient.get(url);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get commission forecast:', error);
      return null;
    }
  },

  // Optimisation des commissions
  async optimizeCommissions(params?: { companyId?: number; target?: number }): Promise<any> {
    try {
      const response = await apiClient.post(`${BASE_URL}/optimize`, params || {});
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to optimize commissions:', error);
      return null;
    }
  },

  // Rapports de commissions
  async getCommissionReport(params?: { period?: string; format?: 'pdf' | 'excel' }): Promise<Blob | null> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.append('period', params.period);
      if (params?.format) queryParams.append('format', params.format);
      
      const url = queryParams.toString() ? `${BASE_URL}/report?${queryParams}` : `${BASE_URL}/report`;
      const response = await apiClient.get(url, { responseType: 'blob' });
      return response as Blob;
    } catch (error) {
      console.error('Failed to get commission report:', error);
      return null;
    }
  },
};

export default iaCommissionApi;