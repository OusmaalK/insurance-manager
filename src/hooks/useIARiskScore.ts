// src/hooks/useIARiskScore.ts
// Hook pour le scoring de risque IA
// <80 lignes

'use client';

import { useState, useCallback } from 'react';
import { companiesApi } from '@/modules/api/companies/companies.api';
import { CompanyRiskAnalysis } from '@/types/company.types';

export const useIARiskScore = () => {
  const [riskAnalysis, setRiskAnalysis] = useState<CompanyRiskAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeCompanyRisk = useCallback(async (companyId: number): Promise<CompanyRiskAnalysis | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await companiesApi.analyzeRisk(companyId);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        if (data.risk_score !== undefined) {
          setRiskAnalysis(data);
          return data;
        }
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to analyze company risk');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRiskLevel = useCallback((score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
    if (score >= 75) return 'CRITICAL';
    if (score >= 55) return 'HIGH';
    if (score >= 35) return 'MEDIUM';
    return 'LOW';
  }, []);

  const getRiskColor = useCallback((level: string): string => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  }, []);

  const getRiskBadgeColor = useCallback((level: string): string => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100 text-red-700';
      case 'HIGH': return 'bg-orange-100 text-orange-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  }, []);

  return {
    riskAnalysis,
    isLoading,
    error,
    analyzeCompanyRisk,
    getRiskLevel,
    getRiskColor,
    getRiskBadgeColor,
  };
};

export default useIARiskScore;