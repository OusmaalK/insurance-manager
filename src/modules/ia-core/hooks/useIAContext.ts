// src/modules/ia-core/hooks/useIAContext.ts
// Contexte IA pour l'application
// <110 lignes

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { apiClient } from '@/modules/api/client/client';

// ============================================
// TYPES
// ============================================

interface IAContextValue {
  isIAEnabled: boolean;
  isLoading: boolean;
  error: string | null;
  enableIA: () => Promise<void>;
  disableIA: () => Promise<void>;
  getIATier: () => 'STANDARD' | 'IA';
  checkIAAccess: () => Promise<boolean>;
}

interface IAProviderProps {
  children: ReactNode;
}

// ============================================
// CONTEXTE
// ============================================

const IAContext = createContext<IAContextValue | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export const IAProvider = ({ children }: IAProviderProps) => {
  const [isIAEnabled, setIsIAEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<'STANDARD' | 'IA'>('STANDARD');

  // Charger le tier au montage
  useEffect(() => {
    const loadTier = async () => {
      try {
        const response = await apiClient.get('/settings/ia/tier');
        const data = response as any;
        const userTier = data?.data?.tier || data?.tier || 'STANDARD';
        setTier(userTier);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ia_tier', userTier);
        }
      } catch (error) {
        if (typeof window !== 'undefined') {
          const storedTier = localStorage.getItem('ia_tier') as 'STANDARD' | 'IA' | null;
          if (storedTier) {
            setTier(storedTier);
          }
        }
      }
    };
    loadTier();
  }, []);

  const enableIA = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/settings/ia/enable');
      const data = response as any;
      if (data?.success !== false) {
        setIsIAEnabled(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to enable IA');
      console.error('Enable IA error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disableIA = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/settings/ia/disable');
      const data = response as any;
      if (data?.success !== false) {
        setIsIAEnabled(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to disable IA');
      console.error('Disable IA error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getIATier = useCallback((): 'STANDARD' | 'IA' => {
    return tier;
  }, [tier]);

  const checkIAAccess = useCallback(async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/settings/ia/access');
      const data = response as any;
      const hasAccess = data?.data?.hasAccess ?? data?.hasAccess ?? (tier === 'IA');
      return hasAccess;
    } catch (error) {
      return tier === 'IA';
    }
  }, [tier]);

  const contextValue: IAContextValue = {
    isIAEnabled,
    isLoading,
    error,
    enableIA,
    disableIA,
    getIATier,
    checkIAAccess,
  };

  return React.createElement(IAContext.Provider, { value: contextValue }, children);
};

// ============================================
// HOOK
// ============================================

export const useIAContext = (): IAContextValue => {
  const context = useContext(IAContext);
  if (!context) {
    throw new Error('useIAContext must be used within an IAProvider');
  }
  return context;
};

export default useIAContext;