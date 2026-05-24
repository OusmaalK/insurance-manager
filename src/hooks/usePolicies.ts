// src/hooks/usePolicies.ts
// Hook pour la gestion des contrats
// <150 lignes

'use client';

import { useState, useCallback, useEffect } from 'react';
import { policiesApi } from '@/modules/api/policies/policies.api';
import { Policy, PolicyFilters, PolicyStats } from '@/types/policy.types';
import { PaginationParams } from '@/types/api.types';

interface UsePoliciesOptions {
  autoFetch?: boolean;
  initialParams?: PaginationParams & PolicyFilters;
}

export const usePolicies = (options: UsePoliciesOptions = {}) => {
  const { autoFetch = true, initialParams = {} } = options;

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

  // Récupérer tous les contrats
  const fetchPolicies = useCallback(async (fetchParams?: PaginationParams & PolicyFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await policiesApi.getAll(fetchParams || params);
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        if (responseAny.data && Array.isArray(responseAny.data)) {
          setPolicies(responseAny.data);
          setTotal(responseAny.total || responseAny.data.length);
          setTotalPages(responseAny.totalPages || 1);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('fetchPolicies error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  // Récupérer un contrat par ID
  const getPolicy = useCallback(async (id: number): Promise<Policy | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await policiesApi.getById(id);
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        const policyData = responseAny.data || responseAny;
        setPolicy(policyData);
        return policyData;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Contrat non trouvé');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les statistiques
  const fetchStats = useCallback(async (): Promise<PolicyStats | null> => {
    setIsLoading(true);
    try {
      const response = await policiesApi.getStats();
      if (response && typeof response === 'object') {
        return (response as any).data || response;
      }
      return null;
    } catch (err) {
      console.error('fetchStats error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Créer un contrat
  const createPolicy = useCallback(async (data: any): Promise<Policy | null> => {
    setIsLoading(true);
    try {
      const response = await policiesApi.create(data);
      if (response && typeof response === 'object') {
        const newPolicy = (response as any).data || response;
        await fetchPolicies();
        return newPolicy;
      }
      return null;
    } catch (err) {
      console.error('createPolicy error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPolicies]);

  // Mettre à jour un contrat
  const updatePolicy = useCallback(async (id: number, data: any): Promise<Policy | null> => {
    setIsLoading(true);
    try {
      const response = await policiesApi.update(id, data);
      if (response && typeof response === 'object') {
        const updated = (response as any).data || response;
        await fetchPolicies();
        if (policy?.id === id) setPolicy(updated);
        return updated;
      }
      return null;
    } catch (err) {
      console.error('updatePolicy error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPolicies, policy]);

  // Supprimer un contrat
  const deletePolicy = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await policiesApi.delete(id);
      await fetchPolicies();
      if (policy?.id === id) setPolicy(null);
      return true;
    } catch (err) {
      console.error('deletePolicy error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPolicies, policy]);

  // Mettre à jour les paramètres
  const updateParams = useCallback((newParams: Partial<PaginationParams & PolicyFilters>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  // Auto-fetch
  useEffect(() => {
    if (autoFetch) {
      fetchPolicies();
    }
  }, [autoFetch, fetchPolicies]);

  return {
    policies,
    policy,
    total,
    totalPages,
    isLoading,
    error,
    params,
    fetchPolicies,
    getPolicy,
    fetchStats,
    createPolicy,
    updatePolicy,
    deletePolicy,
    updateParams,
  };
};

export default usePolicies;