// src/hooks/useClaimAI.ts
// Hook pour l'IA des sinistres
// <120 lignes

'use client';

import { useState, useCallback } from 'react';
import { claimsApi } from '@/modules/api/claims/claims.api';
import { FraudAnalysis, ClaimPredictions } from '@/types/claim.types';

export const useClaimAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fraudAnalysis, setFraudAnalysis] = useState<FraudAnalysis | null>(null);
  const [predictions, setPredictions] = useState<ClaimPredictions | null>(null);

  // Détecter la fraude IA
  const detectFraud = useCallback(async (claimId: number): Promise<FraudAnalysis | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await claimsApi.detectFraud(claimId);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        setFraudAnalysis(data);
        return data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la détection de fraude');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Prédire le montant du sinistre
  const predictAmount = useCallback(async (claimId: number): Promise<ClaimPredictions | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await claimsApi.predictAmount(claimId);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        setPredictions(data);
        return data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la prédiction');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-approbation IA
  const autoApprove = useCallback(async (claimId: number) => {
    setIsLoading(true);
    try {
      const response = await claimsApi.autoApprove(claimId);
      if (response && typeof response === 'object') {
        return (response as any).data || response;
      }
      return null;
    } catch (err) {
      console.error('autoApprove error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    fraudAnalysis,
    predictions,
    detectFraud,
    predictAmount,
    autoApprove,
  };
};

export default useClaimAI;