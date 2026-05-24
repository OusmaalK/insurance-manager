// src/modules/ia-core/hooks/useIAFraudDetection.ts
// Hook pour la détection de fraude IA
// <90 lignes

import { useState, useCallback } from 'react';
import { apiClient } from '@/modules/api/client/client';
import { IAFraudAnalysis, FraudIndicator } from '../types/ia.types';

interface UseIAFraudDetectionOptions {
  autoFetch?: boolean;
}

export const useIAFraudDetection = (options: UseIAFraudDetectionOptions = {}) => {
  const { autoFetch = false } = options;
  
  const [fraudAnalysis, setFraudAnalysis] = useState<IAFraudAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analyser la fraude d'un sinistre
  const analyzeClaimFraud = useCallback(async (claimId: number): Promise<IAFraudAnalysis | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<IAFraudAnalysis>(`/claims/${claimId}/analyze-fraud`);
      const data = (response as any).data;
      setFraudAnalysis(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to analyze claim fraud');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyser la fraude par lots
  const batchAnalyzeFraud = useCallback(async (claimIds: number[]): Promise<IAFraudAnalysis[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        claimIds.map(id => apiClient.post<IAFraudAnalysis>(`/claims/${id}/analyze-fraud`))
      );
      return results.map(r => (r as any).data);
    } catch (err: any) {
      setError(err.message || 'Failed to batch analyze fraud');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir les alertes de fraude
  const getFraudAlerts = useCallback(async (status?: 'NEW' | 'READ' | 'RESOLVED'): Promise<any[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const url = status ? `/claims/ai/alerts?status=${status}` : '/claims/ai/alerts';
      const response = await apiClient.get(url);
      return (response as any).data || [];
    } catch (err: any) {
      setError(err.message || 'Failed to get fraud alerts');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Résoudre une alerte de fraude
  const resolveFraudAlert = useCallback(async (alertId: number, notes?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/claims/ai/alerts/${alertId}/resolve`, { notes });
      return (response as any).success === true;
    } catch (err: any) {
      setError(err.message || 'Failed to resolve fraud alert');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir le niveau de risque de fraude
  const getFraudRiskLevel = useCallback((score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  }, []);

  // Obtenir la couleur du risque de fraude
  const getFraudRiskColor = useCallback((level: string): string => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  }, []);

  return {
    fraudAnalysis,
    isLoading,
    error,
    analyzeClaimFraud,
    batchAnalyzeFraud,
    getFraudAlerts,
    resolveFraudAlert,
    getFraudRiskLevel,
    getFraudRiskColor,
  };
};

export default useIAFraudDetection;