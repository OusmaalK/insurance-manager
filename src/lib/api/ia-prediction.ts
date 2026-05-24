// src/lib/api/ia-prediction.ts
// API client pour les prédictions IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';
import { PolicyRenewalPrediction } from '@/types/policy.types';
import { AmountPredictionResponse } from '@/types/claim.types';

const BASE_URL = '/policies/ai';

export const iaPredictionApi = {
  // Prédiction de renouvellement
  async predictRenewal(policyId: number): Promise<PolicyRenewalPrediction | null> {
    try {
      const response = await apiClient.post(`${BASE_URL}/predict-renewal/${policyId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to predict renewal:', error);
      return null;
    }
  },

  // Prédictions par lots
  async batchPredictRenewals(policyIds: number[]): Promise<PolicyRenewalPrediction[]> {
    try {
      const results = await Promise.all(
        policyIds.map(id => this.predictRenewal(id))
      );
      return results.filter((r): r is PolicyRenewalPrediction => r !== null);
    } catch (error) {
      console.error('Failed to batch predict renewals:', error);
      return [];
    }
  },

  // Prédiction de montant de sinistre
  async predictClaimAmount(claimId: number): Promise<AmountPredictionResponse | null> {
    try {
      const response = await apiClient.post(`/claims/ai/predict-amount/${claimId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to predict claim amount:', error);
      return null;
    }
  },

  // Statistiques des prédictions
  async getPredictionStats(params?: { period?: string }): Promise<any> {
    try {
      const url = params?.period ? `${BASE_URL}/stats?period=${params.period}` : `${BASE_URL}/stats`;
      const response = await apiClient.get(url);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get prediction stats:', error);
      return null;
    }
  },
};

export default iaPredictionApi;