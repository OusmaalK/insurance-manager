// src/hooks/useIAAudit.ts
// Hook pour l'audit IA
// <90 lignes

'use client';

import { useState, useCallback } from 'react';
import { iaAuditApi } from '@/lib/api/ia-audit';

interface AuditLog {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: number;
  details: string;
  created_at: string;
}

interface AuditFilters {
  startDate?: string;
  endDate?: string;
  userId?: number;
  action?: string;
  limit?: number;
}

export const useIAAudit = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (filters?: AuditFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await iaAuditApi.getLogs(filters);
      setLogs(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit logs');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPerformanceMetrics = useCallback(async (period?: 'DAY' | 'WEEK' | 'MONTH') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await iaAuditApi.getPerformanceMetrics({ period });
      setPerformanceMetrics(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch performance metrics');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportLogs = useCallback(async (filters?: AuditFilters, format: 'json' | 'csv' = 'json') => {
    setIsLoading(true);
    setError(null);
    try {
      const blob = await iaAuditApi.exportLogs({ ...filters, format });
      return blob;
    } catch (err: any) {
      setError(err.message || 'Failed to export logs');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getLogsByUser = useCallback(async (userId: number, limit?: number) => {
    return fetchLogs({ userId, limit });
  }, [fetchLogs]);

  const getLogsByAction = useCallback(async (action: string, limit?: number) => {
    return fetchLogs({ action, limit });
  }, [fetchLogs]);

  const getLogsByDateRange = useCallback(async (startDate: string, endDate: string, limit?: number) => {
    return fetchLogs({ startDate, endDate, limit });
  }, [fetchLogs]);

  return {
    logs,
    performanceMetrics,
    isLoading,
    error,
    fetchLogs,
    fetchPerformanceMetrics,
    exportLogs,
    getLogsByUser,
    getLogsByAction,
    getLogsByDateRange,
  };
};

export default useIAAudit;