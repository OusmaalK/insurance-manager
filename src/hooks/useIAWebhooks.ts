// src/hooks/useIAWebhooks.ts
// Hook pour les webhooks IA
// <80 lignes

'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/modules/api/client/client';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  lastTriggered?: string;
  lastStatus?: 'success' | 'failed';
}

export const useIAWebhooks = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWebhooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/settings/webhooks');
      if (Array.isArray(response)) {
        setWebhooks(response);
      } else if (response && typeof response === 'object' && (response as any).data && Array.isArray((response as any).data)) {
        setWebhooks((response as any).data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load webhooks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createWebhook = useCallback(async (webhook: Omit<Webhook, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/settings/webhooks', webhook);
      await loadWebhooks();
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create webhook');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadWebhooks]);

  const updateWebhook = useCallback(async (id: string, webhook: Partial<Webhook>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.put(`/settings/webhooks/${id}`, webhook);
      await loadWebhooks();
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to update webhook');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadWebhooks]);

  const deleteWebhook = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/settings/webhooks/${id}`);
      await loadWebhooks();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete webhook');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadWebhooks]);

  const testWebhook = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/settings/webhooks/${id}/test`);
      return (response as any).success === true;
    } catch (err: any) {
      setError(err.message || 'Failed to test webhook');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    webhooks,
    isLoading,
    error,
    loadWebhooks,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    testWebhook,
  };
};

export default useIAWebhooks;