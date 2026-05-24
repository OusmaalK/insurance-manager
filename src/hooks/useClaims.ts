// src/hooks/useClaims.ts
// Hook pour la gestion des sinistres
// <150 lignes

'use client';

import { useState, useCallback, useEffect } from 'react';
import { claimsApi } from '@/modules/api/claims/claims.api';
import { Claim, ClaimFilters, ClaimStats } from '@/types/claim.types';
import { PaginationParams } from '@/types/api.types';

interface UseClaimsOptions {
  autoFetch?: boolean;
  initialParams?: PaginationParams & ClaimFilters;
}

export const useClaims = (options: UseClaimsOptions = {}) => {
  const { autoFetch = true, initialParams = {} } = options;

  const [claims, setClaims] = useState<Claim[]>([]);
  const [claim, setClaim] = useState<Claim | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

  // Récupérer tous les sinistres
  const fetchClaims = useCallback(async (fetchParams?: PaginationParams & ClaimFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await claimsApi.getAll(fetchParams || params);
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        if (responseAny.data && Array.isArray(responseAny.data)) {
          setClaims(responseAny.data);
          setTotal(responseAny.total || responseAny.data.length);
          setTotalPages(responseAny.totalPages || 1);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('fetchClaims error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  // Récupérer un sinistre par ID
  const getClaim = useCallback(async (id: number): Promise<Claim | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await claimsApi.getById(id);
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        const claimData = responseAny.data || responseAny;
        setClaim(claimData);
        return claimData;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Sinistre non trouvé');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les statistiques
  const fetchStats = useCallback(async (): Promise<ClaimStats | null> => {
    setIsLoading(true);
    try {
      const response = await claimsApi.getStats();
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

  // Créer un sinistre
  const createClaim = useCallback(async (data: any): Promise<Claim | null> => {
    setIsLoading(true);
    try {
      const response = await claimsApi.create(data);
      if (response && typeof response === 'object') {
        const newClaim = (response as any).data || response;
        await fetchClaims();
        return newClaim;
      }
      return null;
    } catch (err) {
      console.error('createClaim error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchClaims]);

  // Mettre à jour le statut
  const updateStatus = useCallback(async (id: number, status: Claim['status']): Promise<Claim | null> => {
    setIsLoading(true);
    try {
      const response = await claimsApi.updateStatus(id, status);
      if (response && typeof response === 'object') {
        const updated = (response as any).data || response;
        await fetchClaims();
        if (claim?.id === id) setClaim(updated);
        return updated;
      }
      return null;
    } catch (err) {
      console.error('updateStatus error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchClaims, claim]);

  // Mettre à jour les paramètres
  const updateParams = useCallback((newParams: Partial<PaginationParams & ClaimFilters>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  // Auto-fetch
  useEffect(() => {
    if (autoFetch) {
      fetchClaims();
    }
  }, [autoFetch, fetchClaims]);

  return {
    claims,
    claim,
    total,
    totalPages,
    isLoading,
    error,
    params,
    fetchClaims,
    getClaim,
    fetchStats,
    createClaim,
    updateStatus,
    updateParams,
  };
};

export default useClaims;