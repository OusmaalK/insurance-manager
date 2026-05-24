// src/hooks/useIAPrediction.ts
// Hook pour les prédictions IA
// <80 lignes

'use client';

import { useState, useCallback } from 'react';
import { policiesApi } from '@/modules/api/policies/policies.api';
import { claimsIAApi } from '@/modules/api/claims/claims-ia.api';
import { PolicyRenewalPrediction } from '@/types/policy.types';
import { AmountPredictionResponse } from '@/types/claim.types';

export const useIAPrediction = () => {
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predictRenewal = useCallback(async (policyId: number): Promise<PolicyRenewalPrediction | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await policiesApi.predictRenewal(policyId);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        if (data.renewal_probability !== undefined) {
          setPrediction(data);
          return data;
        }
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to predict renewal');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const predictClaimAmount = useCallback(async (claimId: number): Promise<AmountPredictionResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await claimsIAApi.predictAmount(claimId);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        if (data.predicted_amount !== undefined) {
          setPrediction(data);
          return data;
        }
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to predict claim amount');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProbabilityLevel = useCallback((probability: number): 'FAIBLE' | 'MOYEN' | 'ÉLEVÉ' => {
    if (probability >= 70) return 'ÉLEVÉ';
    if (probability >= 40) return 'MOYEN';
    return 'FAIBLE';
  }, []);

  const getProbabilityColor = useCallback((probability: number): string => {
    if (probability >= 70) return 'bg-green-100 text-green-700';
    if (probability >= 40) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  }, []);

  return {
    prediction,
    isLoading,
    error,
    predictRenewal,
    predictClaimAmount,
    getProbabilityLevel,
    getProbabilityColor,
  };
};

export default useIAPrediction;