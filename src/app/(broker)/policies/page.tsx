// src/hooks/usePolicies.ts
// Hook pour la gestion des contrats - Version avec search
// <120 lignes

import { useState, useCallback, useEffect } from 'react';
import { policiesApi } from '@/modules/api/policies/policies.api';
import { 
  Policy, 
  PolicyFormData, 
  PolicyRenewalPrediction, 
  ExpiringPolicy 
} from '@/types/policy.types';
import { PaginationParams } from '@/types/api.types';

// ============================================
// TYPES
// ============================================

interface UsePoliciesOptions {
  autoFetch?: boolean;
  initialParams?: PaginationParams & { status?: string; company_id?: number };
}

// ✅ Interface pour fetchPolicies
interface FetchPoliciesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;        // ✅ Ajouté
  status?: string;        // ✅ Ajouté
  company_id?: number;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

export const usePolicies = (options: UsePoliciesOptions = {}) => {
  const { autoFetch = true, initialParams = {} } = options;
  
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

  // Charger les contrats - Version avec search
  const fetchPolicies = useCallback(async (fetchParams?: FetchPoliciesParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fusionner les paramètres
      const mergedParams = {
        page: fetchParams?.page ?? params.page,
        limit: fetchParams?.limit ?? params.limit,
        search: fetchParams?.search,
        status: fetchParams?.status,
        company_id: fetchParams?.company_id,
      };
      
      const response = await policiesApi.getAll(mergedParams);
      if (response.success && response.data) {
        setPolicies(response.data.data);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } else {
        setError(response.error || 'Failed to fetch policies');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  // Charger un contrat par ID
  const getPolicy = useCallback(async (id: number): Promise<Policy | null> => {
    setIsLoading(true);
    try {
      const response = await policiesApi.getById(id);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err) {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Contrats par entreprise
  const getPoliciesByCompany = useCallback(async (companyId: number): Promise<Policy[]> => {
    setIsLoading(true);
    try {
      const response = await policiesApi.getByCompanyId(companyId);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (err) {
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Contrats expirant bientôt
  const getExpiringPolicies = useCallback(async (daysThreshold: number = 30): Promise<ExpiringPolicy[]> => {
    setIsLoading(true);
    try {
      const response = await policiesApi.getExpiring(daysThreshold);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (err) {
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Prédiction de renouvellement IA
  const predictRenewal = useCallback(async (id: number): Promise<PolicyRenewalPrediction | null> => {
    setIsLoading(true);
    try {
      const response = await policiesApi.predictRenewal(id);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err) {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Créer un contrat
  const createPolicy = useCallback(async (data: PolicyFormData): Promise<Policy | null> => {
    setIsLoading(true);
    try {
      const response = await policiesApi.create(data);
      if (response.success && response.data) {
        await fetchPolicies();
        return response.data;
      }
      return null;
    } catch (err) {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPolicies]);

  // Mettre à jour un contrat
  const updatePolicy = useCallback(async (id: number, data: Partial<PolicyFormData>): Promise<Policy | null> => {
    setIsLoading(true);
    try {
      const response = await policiesApi.update(id, data);
      if (response.success && response.data) {
        await fetchPolicies();
        return response.data;
      }
      return null;
    } catch (err) {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPolicies]);

  // Supprimer un contrat
  const deletePolicy = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await policiesApi.delete(id);
      if (response.success) {
        await fetchPolicies();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPolicies]);

  // Mettre à jour les paramètres
  const updateParams = useCallback((newParams: Partial<PaginationParams & { status?: string; company_id?: number }>) => {
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
    total,
    totalPages,
    isLoading,
    error,
    params,
    fetchPolicies,
    getPolicy,
    getPoliciesByCompany,
    getExpiringPolicies,
    predictRenewal,
    createPolicy,
    updatePolicy,
    deletePolicy,
    updateParams,
  };
};

export default usePolicies;