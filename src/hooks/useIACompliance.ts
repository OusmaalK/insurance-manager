// src/hooks/useIACompliance.ts
// Hook pour la conformité IA
// <80 lignes

'use client';

import { useState, useCallback } from 'react';
import { iaComplianceApi } from '@/lib/api/ia-compliance';

interface ComplianceReport {
  compliant: boolean;
  issues: string[];
  recommendations: string[];
  lastCheck: string;
}

interface ConsentLog {
  id: number;
  user_id: number;
  consent_type: string;
  granted: boolean;
  created_at: string;
}

export const useIACompliance = () => {
  const [isCompliant, setIsCompliant] = useState<boolean | null>(null);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [consentLogs, setConsentLogs] = useState<ConsentLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkGDPRCompliance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await iaComplianceApi.checkGDPRCompliance();
      setIsCompliant(result.compliant);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to check GDPR compliance');
      return { compliant: false, issues: ['Erreur de vérification'] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchComplianceReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await iaComplianceApi.getComplianceReport();
      setComplianceReport(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch compliance report');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchConsentLogs = useCallback(async (params?: { userId?: number; startDate?: string; endDate?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await iaComplianceApi.getConsentLogs(params);
      setConsentLogs(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch consent logs');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConsent = useCallback(async (userId: number, preferences: Record<string, boolean>) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await iaComplianceApi.updateConsent(userId, preferences);
      if (success) {
        await fetchConsentLogs({ userId });
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to update consent');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchConsentLogs]);

  return {
    isCompliant,
    complianceReport,
    consentLogs,
    isLoading,
    error,
    checkGDPRCompliance,
    fetchComplianceReport,
    fetchConsentLogs,
    updateConsent,
  };
};

export default useIACompliance;