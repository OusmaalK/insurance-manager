// src/lib/api/company-ai.ts
// API client pour l'IA des entreprises
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/companies/ai';

export const companyAiApi = {
  // Analyser le risque d'une entreprise
  async analyzeRisk(companyId: number): Promise<any> {
    try {
      const response = await apiClient.post(`${BASE_URL}/analyze-risk/${companyId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to analyze company risk:', error);
      return null;
    }
  },

  // Obtenir des recommandations de produits
  async getRecommendations(companyId: number): Promise<any> {
    try {
      const response = await apiClient.get(`${BASE_URL}/recommendations/${companyId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return null;
    }
  },

  // Analyser le secteur d'activité
  async analyzeSector(sector: string): Promise<any> {
    try {
      const response = await apiClient.post(`${BASE_URL}/analyze-sector`, { sector });
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to analyze sector:', error);
      return null;
    }
  },

  // Prédire l'évolution du risque
  async predictRiskTrend(companyId: number, months: number = 6): Promise<any> {
    try {
      const response = await apiClient.get(`${BASE_URL}/risk-trend/${companyId}?months=${months}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to predict risk trend:', error);
      return null;
    }
  },
};

export default companyAiApi;