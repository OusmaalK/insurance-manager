// src/modules/ia-core/hooks/useIAMonetization.ts
// Hook pour la monétisation IA
// <100 lignes

import { useState, useCallback } from 'react';
import { apiClient } from '@/modules/api/client/client';

// ============================================
// TYPES
// ============================================

interface IAMonetizationState {
  tier: 'STANDARD' | 'IA';
  creditsRemaining: number;
  totalCredits: number;
  monthlyCost: number;
  callsThisMonth: number;
  limit: number;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

// ============================================
// HOOK PRINCIPAL
// ============================================

export const useIAMonetization = () => {
  const [state, setState] = useState<IAMonetizationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/ia/monetization/usage');
      setState((response as any).data);
    } catch (err: any) {
      setError(err.message || 'Failed to load usage');
      // Données par défaut
      setState({
        tier: 'STANDARD',
        creditsRemaining: 10,
        totalCredits: 10,
        monthlyCost: 0,
        callsThisMonth: 2,
        limit: 10,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const purchaseCredits = useCallback(async (credits: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/ia/monetization/purchase', { credits });
      if ((response as any).success) {
        await loadUsage();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Purchase failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadUsage]);

  const upgradeToIA = useCallback(async (planId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/ia/monetization/upgrade', { plan_id: planId });
      if ((response as any).success) {
        await loadUsage();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Upgrade failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadUsage]);

  const getPricingPlans = useCallback(async (): Promise<PricingPlan[]> => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/ia/monetization/plans');
      return (response as any).data || [];
    } catch (err) {
      // Plans par défaut
      return [
        { id: 'free', name: 'Standard', price: 0, credits: 10, features: ['Analyses de base', 'Support email'] },
        { id: 'pro', name: 'IA Pro', price: 49, credits: 500, features: ['Analyses avancées', 'Support prioritaire', 'API accessible'] },
        { id: 'enterprise', name: 'Enterprise', price: 199, credits: 5000, features: ['Analyses illimitées', 'Support dédié', 'API illimitée', 'SLA'] },
      ];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const canUseIA = useCallback((): boolean => {
    if (!state) return false;
    return state.tier === 'IA' || state.creditsRemaining > 0;
  }, [state]);

  return {
    state,
    isLoading,
    error,
    loadUsage,
    purchaseCredits,
    upgradeToIA,
    getPricingPlans,
    canUseIA,
  };
};

export default useIAMonetization;