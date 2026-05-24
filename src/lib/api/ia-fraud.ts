// src/lib/api/ia-fraud.ts
// API client pour la détection de fraude IA
// <70 lignes

import { apiClient } from '@/modules/api/client/client';
import { FraudAnalysisResponse, IAAlert } from '@/types/claim.types';

const BASE_URL = '/claims/ai';

export const iaFraudApi = {
  // Analyser la fraude d'un sinistre
  async analyzeFraud(claimId: number): Promise<FraudAnalysisResponse | null> {
    try {
      const response = await apiClient.post(`${BASE_URL}/analyze-fraud/${claimId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to analyze fraud:', error);
      return null;
    }
  },

  // Analyse de fraude par lots
  async batchAnalyzeFraud(claimIds: number[]): Promise<FraudAnalysisResponse[]> {
    try {
      const results = await Promise.all(
        claimIds.map(id => this.analyzeFraud(id))
      );
      return results.filter((r): r is FraudAnalysisResponse => r !== null);
    } catch (error) {
      console.error('Failed to batch analyze fraud:', error);
      return [];
    }
  },

  // Récupérer les alertes de fraude
  async getAlerts(status?: 'NEW' | 'READ' | 'RESOLVED'): Promise<IAAlert[]> {
    try {
      const url = status ? `${BASE_URL}/alerts?status=${status}` : `${BASE_URL}/alerts`;
      const response = await apiClient.get(url);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get fraud alerts:', error);
      return [];
    }
  },

  // Résoudre une alerte
  async resolveAlert(alertId: number, notes?: string): Promise<boolean> {
    try {
      await apiClient.post(`${BASE_URL}/alerts/${alertId}/resolve`, { notes });
      return true;
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      return false;
    }
  },

  // Marquer une alerte comme lue
  async markAlertAsRead(alertId: number): Promise<boolean> {
    try {
      await apiClient.post(`${BASE_URL}/alerts/${alertId}/read`);
      return true;
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
      return false;
    }
  },

  // Obtenir les statistiques IA
  async getStats(): Promise<any> {
    try {
      const response = await apiClient.get(`${BASE_URL}/stats`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get IA stats:', error);
      return null;
    }
  },
};

export default iaFraudApi;