// src/modules/ia-core/hooks/useIAPrediction.ts
// Hook pour les prédictions IA
// <100 lignes

import { useState, useCallback } from 'react';
import { apiClient } from '@/modules/api/client/client';
import { IAPrediction } from '../types/ia.types';

interface UseIAPredictionOptions {
  autoFetch?: boolean;
}

export const useIAPrediction = (options: UseIAPredictionOptions = {}) => {
  const { autoFetch = false } = options;
  
  const [prediction, setPrediction] = useState<IAPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prédire le renouvellement d'un contrat
  const predictRenewal = useCallback(async (policyId: number): Promise<IAPrediction | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<IAPrediction>(`/policies/${policyId}/predict-renewal`);
      const data = (response as any).data;
      setPrediction(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to predict renewal');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Prédire le montant d'un sinistre
  const predictClaimAmount = useCallback(async (claimId: number): Promise<IAPrediction | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<IAPrediction>(`/claims/${claimId}/predict-amount`);
      const data = (response as any).data;
      setPrediction(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to predict claim amount');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Prédire la fraude
  const predictFraud = useCallback(async (claimId: number): Promise<IAPrediction | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<IAPrediction>(`/claims/${claimId}/predict-fraud`);
      const data = (response as any).data;
      setPrediction(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to predict fraud');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Prédire le risque client
  const predictClientRisk = useCallback(async (companyId: number): Promise<IAPrediction | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<IAPrediction>(`/companies/${companyId}/predict-risk`);
      const data = (response as any).data;
      setPrediction(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to predict client risk');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir la probabilité formatée
  const getFormattedProbability = useCallback((value: number): string => {
    return `${Math.round(value)}%`;
  }, []);

  // Obtenir le niveau de confiance
  const getConfidenceLevel = useCallback((confidence: number): 'FAIBLE' | 'MOYEN' | 'ÉLEVÉ' => {
    if (confidence >= 0.8) return 'ÉLEVÉ';
    if (confidence >= 0.5) return 'MOYEN';
    return 'FAIBLE';
  }, []);

  return {
    prediction,
    isLoading,
    error,
    predictRenewal,
    predictClaimAmount,
    predictFraud,
    predictClientRisk,
    getFormattedProbability,
    getConfidenceLevel,
  };
};

export default useIAPrediction;