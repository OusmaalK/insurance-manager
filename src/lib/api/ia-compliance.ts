// src/lib/api/ia-compliance.ts
// API client pour la conformité IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/settings/ia';

export const iaComplianceApi = {
  // Vérifier la conformité RGPD
  async checkGDPRCompliance(): Promise<{ compliant: boolean; issues: string[] }> {
    try {
      const response = await apiClient.get(`${BASE_URL}/compliance/gdpr`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to check GDPR compliance:', error);
      return { compliant: false, issues: ['Erreur de vérification'] };
    }
  },

  // Obtenir le rapport de conformité
  async getComplianceReport(): Promise<any> {
    try {
      const response = await apiClient.get(`${BASE_URL}/compliance/report`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get compliance report:', error);
      return null;
    }
  },

  // Vérifier les logs de consentement
  async getConsentLogs(params?: { userId?: number; startDate?: string; endDate?: string }): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.userId) queryParams.append('userId', params.userId.toString());
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      
      const url = queryParams.toString() ? `${BASE_URL}/consent-logs?${queryParams}` : `${BASE_URL}/consent-logs`;
      const response = await apiClient.get(url);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get consent logs:', error);
      return [];
    }
  },

  // Mettre à jour les préférences de consentement
  async updateConsent(userId: number, preferences: Record<string, boolean>): Promise<boolean> {
    try {
      await apiClient.post(`${BASE_URL}/consent`, { userId, preferences });
      return true;
    } catch (error) {
      console.error('Failed to update consent:', error);
      return false;
    }
  },
};

export default iaComplianceApi;