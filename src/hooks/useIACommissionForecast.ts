// src/hooks/useIACommissionForecast.ts
// Hook pour les prévisions de commissions IA
// <80 lignes

'use client';

import { useState, useCallback } from 'react';
import { usePolicies } from './usePolicies';
import { useIA } from './useIA';

interface CommissionForecastResult {
  current: number;
  expected: number;
  potential: number;
  highProbabilityCount: number;
  mediumProbabilityCount: number;
  lowProbabilityCount: number;
  totalPolicies: number;
}

export const useIACommissionForecast = () => {
  const { policies, fetchPolicies, isLoading: policiesLoading } = usePolicies({ autoFetch: false });
  const { predictPolicyRenewal } = useIA();
  const [forecast, setForecast] = useState<CommissionForecastResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const COMMISSION_RATE = 0.15;

  const calculateForecast = useCallback(async (companyId?: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await fetchPolicies({ company_id: companyId, status: 'ACTIVE' });
      
      const activePolicies = policies.filter(p => p.status === 'ACTIVE');
      const currentCommissions = activePolicies.reduce((sum, p) => sum + (p.premium_amount * COMMISSION_RATE), 0);
      
      let expectedCommissions = 0;
      let highProbabilityCount = 0;
      let mediumProbabilityCount = 0;
      let lowProbabilityCount = 0;
      
      for (const policy of activePolicies) {
        const prediction = await predictPolicyRenewal(policy.id);
        if (prediction) {
          const proba = prediction.renewal_probability;
          expectedCommissions += policy.premium_amount * COMMISSION_RATE * (proba / 100);
          if (proba >= 70) highProbabilityCount++;
          else if (proba >= 40) mediumProbabilityCount++;
          else lowProbabilityCount++;
        } else {
          expectedCommissions += policy.premium_amount * COMMISSION_RATE * 0.5;
        }
      }
      
      const result: CommissionForecastResult = {
        current: currentCommissions,
        expected: expectedCommissions,
        potential: expectedCommissions * 1.2,
        highProbabilityCount,
        mediumProbabilityCount,
        lowProbabilityCount,
        totalPolicies: activePolicies.length,
      };
      
      setForecast(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to calculate forecast');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPolicies, policies, predictPolicyRenewal]);

  const formatCurrency = useCallback((value: number): string => {
    return `${value.toLocaleString()} €`;
  }, []);

  const getCommissionRate = useCallback(() => COMMISSION_RATE, []);

  return {
    forecast,
    isLoading: isLoading || policiesLoading,
    error,
    calculateForecast,
    formatCurrency,
    commissionRate: COMMISSION_RATE,
  };
};

export default useIACommissionForecast;