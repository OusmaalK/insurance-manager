// src/lib/api/policy-ai.ts
// API client pour l'IA des contrats
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/policies/ai';

export const policyAiApi = {
  // Prédire le renouvellement d'un contrat
  async predictRenewal(policyId: number): Promise<any> {
    try {
      const response = await apiClient.post(`${BASE_URL}/predict-renewal/${policyId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to predict renewal:', error);
      return null;
    }
  },

  // Analyser les clauses du contrat
  async analyzeClauses(policyId: number): Promise<any> {
    try {
      const response = await apiClient.post(`${BASE_URL}/analyze-clauses/${policyId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to analyze clauses:', error);
      return null;
    }
  },

  // Optimiser la prime
  async optimizePremium(policyId: number): Promise<any> {
    try {
      const response = await apiClient.post(`${BASE_URL}/optimize-premium/${policyId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to optimize premium:', error);
      return null;
    }
  },

  // Comparer avec les offres du marché
  async compareWithMarket(policyId: number): Promise<any> {
    try {
      const response = await apiClient.get(`${BASE_URL}/market-comparison/${policyId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to compare with market:', error);
      return null;
    }
  },
};

export default policyAiApi;