// src/modules/ia-core/hooks/useIARiskScore.ts
// Hook pour le scoring de risque IA
// <90 lignes

import { useState, useCallback } from 'react';
import { apiClient } from '@/modules/api/client/client';
import { IARiskAnalysis, RiskFactor } from '../types/ia.types';

interface UseIARiskScoreOptions {
  autoFetch?: boolean;
}

export const useIARiskScore = (options: UseIARiskScoreOptions = {}) => {
  const { autoFetch = false } = options;
  
  const [riskAnalysis, setRiskAnalysis] = useState<IARiskAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analyser le risque d'une entreprise
  const analyzeCompanyRisk = useCallback(async (companyId: number): Promise<IARiskAnalysis | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<IARiskAnalysis>(`/companies/${companyId}/analyze-risk`);
      const data = (response as any).data;
      setRiskAnalysis(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to analyze company risk');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyser le risque d'un contrat
  const analyzePolicyRisk = useCallback(async (policyId: number): Promise<IARiskAnalysis | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<IARiskAnalysis>(`/policies/${policyId}/analyze-risk`);
      const data = (response as any).data;
      setRiskAnalysis(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to analyze policy risk');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyser le risque d'un sinistre
  const analyzeClaimRisk = useCallback(async (claimId: number): Promise<IARiskAnalysis | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<IARiskAnalysis>(`/claims/${claimId}/analyze-risk`);
      const data = (response as any).data;
      setRiskAnalysis(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to analyze claim risk');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir le niveau de risque
  const getRiskLevel = useCallback((score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  }, []);

  // Obtenir la couleur du risque
  const getRiskColor = useCallback((level: string): string => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  }, []);

  return {
    riskAnalysis,
    isLoading,
    error,
    analyzeCompanyRisk,
    analyzePolicyRisk,
    analyzeClaimRisk,
    getRiskLevel,
    getRiskColor,
  };
};

export default useIARiskScore;