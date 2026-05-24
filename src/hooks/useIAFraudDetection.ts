// src/hooks/useIAFraudDetection.ts
// Hook pour la détection de fraude IA
// <90 lignes

'use client';

import { useState, useCallback } from 'react';
import { claimsIAApi } from '@/modules/api/claims/claims-ia.api';
import { FraudAnalysisResponse, IAAlert } from '@/types/claim.types';

export const useIAFraudDetection = () => {
  const [fraudAnalysis, setFraudAnalysis] = useState<FraudAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeClaimFraud = useCallback(async (claimId: number): Promise<FraudAnalysisResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await claimsIAApi.analyzeFraud(claimId);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        if (data.fraud_score !== undefined) {
          setFraudAnalysis(data);
          return data;
        }
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to analyze claim fraud');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const batchAnalyzeFraud = useCallback(async (claimIds: number[]): Promise<FraudAnalysisResponse[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await Promise.all(claimIds.map(id => claimsIAApi.analyzeFraud(id)));
      return results.map(r => (r as any).data || r);
    } catch (err: any) {
      setError(err.message || 'Failed to batch analyze fraud');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFraudAlerts = useCallback(async (status?: 'NEW' | 'READ' | 'RESOLVED'): Promise<IAAlert[]> => {
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
      setError(err.message || 'Failed to get fraud alerts');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resolveFraudAlert = useCallback(async (alertId: number, notes?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await claimsIAApi.resolveAlert(alertId, notes);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to resolve fraud alert');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFraudRiskLevel = useCallback((score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
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
  };
};

export default useIAFraudDetection;