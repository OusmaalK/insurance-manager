// src/hooks/useIAContractAnalysis.ts
// Hook pour l'analyse de contrat IA
// <90 lignes

'use client';

import { useState, useCallback } from 'react';
import { iaContractApi } from '@/lib/api/ia-contract';

interface Clause {
  id: string;
  text: string;
  type: 'RISK' | 'NEUTRAL' | 'BENEFIT';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  recommendation: string;
}

interface KeyInfo {
  policy_number: string;
  insurer: string;
  premium: number;
  coverage: number;
  start_date: string;
  end_date: string;
  key_clauses: string[];
}

interface ComparisonResult {
  scores: { contract1: number; contract2: number };
  advantages: { contract1: string[]; contract2: string[] };
  disadvantages: { contract1: string[]; contract2: string[] };
  recommendation: string;
}

export const useIAContractAnalysis = () => {
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeClauses = useCallback(async (policyId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await iaContractApi.analyzeClauses(policyId);
      setClauses(data.clauses || []);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to analyze clauses');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const extractKeyInfo = useCallback(async (policyId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await iaContractApi.extractKeyInfo(policyId);
      setKeyInfo(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to extract key info');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const compareContracts = useCallback(async (policyId1: number, policyId2: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await iaContractApi.compareContracts(policyId1, policyId2);
      setComparison(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to compare contracts');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(async (policyId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await iaContractApi.getRecommendations(policyId);
      setRecommendations(data.recommendations || []);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to get recommendations');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRiskSummary = useCallback(() => {
    const riskClauses = clauses.filter(c => c.type === 'RISK');
    const highRiskCount = riskClauses.filter(c => c.severity === 'HIGH').length;
    const mediumRiskCount = riskClauses.filter(c => c.severity === 'MEDIUM').length;
    
    return {
      totalClauses: clauses.length,
      riskCount: riskClauses.length,
      benefitCount: clauses.filter(c => c.type === 'BENEFIT').length,
      highRiskCount,
      mediumRiskCount,
      overallRisk: highRiskCount > 0 ? 'HIGH' : mediumRiskCount > 0 ? 'MEDIUM' : 'LOW',
    };
  }, [clauses]);

  return {
    clauses,
    keyInfo,
    comparison,
    recommendations,
    isLoading,
    error,
    analyzeClauses,
    extractKeyInfo,
    compareContracts,
    getRecommendations,
    getRiskSummary,
  };
};

export default useIAContractAnalysis;