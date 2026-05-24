// src/lib/api/ia-contract.ts
// API client pour l'analyse de contrat IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/policies/ai';

export const iaContractApi = {
  // Analyser les clauses d'un contrat
  async analyzeClauses(policyId: number): Promise<any> {
    try {
      const response = await apiClient.post(`${BASE_URL}/analyze-clauses/${policyId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to analyze clauses:', error);
      return null;
    }
  },

  // Extraire les informations clés du contrat
  async extractKeyInfo(policyId: number): Promise<any> {
    try {
      const response = await apiClient.get(`${BASE_URL}/extract/${policyId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to extract key info:', error);
      return null;
    }
  },

  // Comparer deux contrats
  async compareContracts(policyId1: number, policyId2: number): Promise<any> {
    try {
      const response = await apiClient.post(`${BASE_URL}/compare`, { policyId1, policyId2 });
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to compare contracts:', error);
      return null;
    }
  },

  // Obtenir les recommandations pour un contrat
  async getRecommendations(policyId: number): Promise<any> {
    try {
      const response = await apiClient.get(`${BASE_URL}/recommendations/${policyId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return null;
    }
  },
};

export default iaContractApi;