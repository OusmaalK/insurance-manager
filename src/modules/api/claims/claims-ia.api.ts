// src/modules/api/claims/claims-ia.api.ts
// API Client pour le module IA Claims (endpoints /api/claims/ai/*)
// <90 lignes

import { apiClient } from '../client/client';
import { 
  FraudAnalysisResponse, 
  RiskAnalysisResponse, 
  AmountPredictionResponse,
  IAStatsResponse,
  IAAlert
} from '@/types/claim.types';

// ============================================
// ENDPOINTS
// ============================================

const BASE_URL = '/claims/ai';

// ============================================
// ANALYSE IA
// ============================================

export const claimsIAApi = {
  // Analyse de fraude (endpoint backend: POST /api/claims/ai/analyze-fraud/:id)
  async analyzeFraud(claimId: number) {
    return apiClient.post<FraudAnalysisResponse>(`${BASE_URL}/analyze-fraud/${claimId}`);
  },

  // Analyse de risque (endpoint backend: POST /api/claims/ai/analyze-risk/:id)
  async analyzeRisk(claimId: number) {
    return apiClient.post<RiskAnalysisResponse>(`${BASE_URL}/analyze-risk/${claimId}`);
  },

  // Prédiction du montant (endpoint backend: POST /api/claims/ai/predict-amount/:id)
  async predictAmount(claimId: number) {
    return apiClient.post<AmountPredictionResponse>(`${BASE_URL}/predict-amount/${claimId}`);
  },

  // Analyse complète (fraude + risque + prédiction) en un appel
  async analyzeComplete(claimId: number) {
    return apiClient.post<{
      fraud: FraudAnalysisResponse;
      risk: RiskAnalysisResponse;
      amount: AmountPredictionResponse;
    }>(`${BASE_URL}/analyze-complete/${claimId}`);
  },

  // ============================================
  // STATISTIQUES ET ALERTES
  // ============================================

  // Statistiques IA (endpoint backend: GET /api/claims/ai/stats)
  async getStats() {
    return apiClient.get<IAStatsResponse>(`${BASE_URL}/stats`);
  },

  // Alertes IA (endpoint backend: GET /api/claims/ai/alerts)
  async getAlerts(status?: 'NEW' | 'READ' | 'RESOLVED') {
    const url = status ? `${BASE_URL}/alerts?status=${status}` : `${BASE_URL}/alerts`;
    return apiClient.get<IAAlert[]>(url);
  },

  // Marquer une alerte comme lue
  async markAlertAsRead(alertId: number) {
    return apiClient.post(`${BASE_URL}/alerts/${alertId}/read`);
  },

  // Résoudre une alerte
  async resolveAlert(alertId: number, notes?: string) {
    return apiClient.post(`${BASE_URL}/alerts/${alertId}/resolve`, { notes });
  },
};

export default claimsIAApi;