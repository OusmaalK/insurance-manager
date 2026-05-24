// src/hooks/useIA.ts
// Hook unifié pour l'IA
// <100 lignes

'use client';

import { useState, useCallback } from 'react';
import { claimsIAApi } from '@/modules/api/claims/claims-ia.api';
import { companiesApi } from '@/modules/api/companies/companies.api';
import { policiesApi } from '@/modules/api/policies/policies.api';
import { 
  FraudAnalysisResponse, 
  RiskAnalysisResponse, 
  AmountPredictionResponse,
  IAStatsResponse,
  IAAlert
} from '@/types/claim.types';
import { CompanyRiskAnalysis } from '@/types/company.types';
import { PolicyRenewalPrediction } from '@/types/policy.types';

export const useIA = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeClaimFraud = useCallback(async (claimId: number): Promise<FraudAnalysisResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await claimsIAApi.analyzeFraud(claimId);
      if (response && typeof response === 'object') {
        return (response as any).data || response;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Fraud analysis failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeClaimRisk = useCallback(async (claimId: number): Promise<RiskAnalysisResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await claimsIAApi.analyzeRisk(claimId);
      if (response && typeof response === 'object') {
        return (response as any).data || response;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Risk analysis failed');
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
        return (response as any).data || response;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Amount prediction failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeCompanyRisk = useCallback(async (companyId: number): Promise<CompanyRiskAnalysis | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await companiesApi.analyzeRisk(companyId);
      if (response && typeof response === 'object') {
        return (response as any).data || response;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Company risk analysis failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const predictPolicyRenewal = useCallback(async (policyId: number): Promise<PolicyRenewalPrediction | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await policiesApi.predictRenewal(policyId);
      if (response && typeof response === 'object') {
        return (response as any).data || response;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Renewal prediction failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getIAStats = useCallback(async (): Promise<IAStatsResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await claimsIAApi.getStats();
      if (response && typeof response === 'object') {
        return (response as any).data || response;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch IA stats');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getIAAlerts = useCallback(async (status?: 'NEW' | 'READ' | 'RESOLVED'): Promise<IAAlert[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await claimsIAApi.getAlerts(status);
      if (Array.isArray(response)) return response;
      if (response && typeof response === 'object' && (response as any).data && Array.isArray((response as any).data)) {
        return (response as any).data;
      }
      return [];
    } catch (err: any) {
      setError(err.message || 'Failed to fetch IA alerts');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resolveAlert = useCallback(async (alertId: number, notes?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await claimsIAApi.resolveAlert(alertId, notes);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to resolve alert');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    analyzeClaimFraud,
    analyzeClaimRisk,
    predictClaimAmount,
    analyzeCompanyRisk,
    predictPolicyRenewal,
    getIAStats,
    getIAAlerts,
    resolveAlert,
  };
};

export default useIA;