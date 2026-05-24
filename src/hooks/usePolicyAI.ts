// src/hooks/usePolicyAI.ts
// Hook pour l'IA des contrats
// <120 lignes

'use client';

import { useState, useCallback } from 'react';
import { policiesApi } from '@/modules/api/policies/policies.api';
import { PolicyRiskAnalysis, PolicyPredictions, ClauseAnalysis } from '@/types/policy.types';

export const usePolicyAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<PolicyRiskAnalysis | null>(null);
  const [predictions, setPredictions] = useState<PolicyPredictions | null>(null);
  const [clauseAnalysis, setClauseAnalysis] = useState<ClauseAnalysis | null>(null);

  // Analyser le risque du contrat
  const analyzeRisk = useCallback(async (policyId: number): Promise<PolicyRiskAnalysis | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await policiesApi.analyzeRisk(policyId);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        setRiskAnalysis(data);
        return data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'analyse du risque');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir les prédictions
  const getPredictions = useCallback(async (policyId: number): Promise<PolicyPredictions | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await policiesApi.getPredictions(policyId);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        setPredictions(data);
        return data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des prédictions');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyser les clauses du contrat
  const analyzeClauses = useCallback(async (policyId: number, text?: string): Promise<ClauseAnalysis | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await policiesApi.analyzeClauses(policyId, text);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        setClauseAnalysis(data);
        return data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'analyse des clauses');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Prédire le renouvellement
  const predictRenewal = useCallback(async (policyId: number) => {
    setIsLoading(true);
    try {
      const response = await policiesApi.predictRenewal(policyId);
      if (response && typeof response === 'object') {
        return (response as any).data || response;
      }
      return null;
    } catch (err) {
      console.error('predictRenewal error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Prime optimale
  const getOptimalPremium = useCallback(async (policyId: number) => {
    setIsLoading(true);
    try {
      const response = await policiesApi.getOptimalPremium(policyId);
      if (response && typeof response === 'object') {
        return (response as any).data || response;
      }
      return null;
    } catch (err) {
      console.error('getOptimalPremium error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    riskAnalysis,
    predictions,
    clauseAnalysis,
    analyzeRisk,
    getPredictions,
    analyzeClauses,
    predictRenewal,
    getOptimalPremium,
  };
};

export default usePolicyAI;