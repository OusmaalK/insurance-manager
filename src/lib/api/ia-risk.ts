// src/lib/api/ia-risk.ts
// API client pour l'analyse de risque IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';
import { CompanyRiskAnalysis } from '@/types/company.types';

const BASE_URL = '/companies/ai';

export const iaRiskApi = {
  // Analyser le risque d'une entreprise
  async analyzeRisk(companyId: number): Promise<CompanyRiskAnalysis | null> {
    try {
      const response = await apiClient.post(`${BASE_URL}/analyze-risk/${companyId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to analyze risk:', error);
      return null;
    }
  },

  // Obtenir le score de risque
  async getRiskScore(companyId: number): Promise<number | null> {
    try {
      const response = await apiClient.get(`/companies/${companyId}/risk-score`);
      const data = (response as any).data || response;
      return data.risk_score ?? null;
    } catch (error) {
      console.error('Failed to get risk score:', error);
      return null;
    }
  },

  // Entreprises à haut risque
  async getHighRiskCompanies(threshold: number = 70): Promise<any[]> {
    try {
      const response = await apiClient.get(`/companies/high-risk?threshold=${threshold}`);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get high risk companies:', error);
      return [];
    }
  },

  // Statistiques de risque
  async getRiskStats(params?: { period?: string; sector?: string }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.append('period', params.period);
      if (params?.sector) queryParams.append('sector', params.sector);
      const url = queryParams.toString() ? `${BASE_URL}/stats?${queryParams}` : `${BASE_URL}/stats`;
      const response = await apiClient.get(url);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get risk stats:', error);
      return null;
    }
  },
};

export default iaRiskApi;