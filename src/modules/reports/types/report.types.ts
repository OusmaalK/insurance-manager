// src/modules/reports/hooks/useReports.ts
// Hook pour la gestion des rapports
// <100 lignes

import { useState, useCallback, useEffect } from 'react';
import { reportsApi } from '@/modules/api/reports/reports.api';
import { Report, ReportSubscription, ReportGenerationRequest } from '@/types/report.types';

interface UseReportsOptions {
  autoFetch?: boolean;
  initialParams?: { page?: number; limit?: number; type?: string };
}

export const useReports = (options: UseReportsOptions = {}) => {
  const { autoFetch = true, initialParams = {} } = options;
  
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);
  const [subscriptions, setSubscriptions] = useState<ReportSubscription[]>([]);

  const fetchReports = useCallback(async (fetchParams?: { page?: number; limit?: number; type?: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await reportsApi.list(fetchParams || params);
      if (response.success && response.data) {
        setReports(response.data.data);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } else {
        setError(response.error || 'Failed to fetch reports');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const generateReport = useCallback(async (request: ReportGenerationRequest): Promise<Report | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await reportsApi.generate(request);
      if (response.success && response.data) {
        await fetchReports();
        return response.data;
      }
      setError(response.error || 'Failed to generate report');
      return null;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchReports]);

  const exportReport = useCallback(async (id: number, format: 'pdf' | 'excel'): Promise<Blob | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const blob = await reportsApi.export(id, format);
      return blob;
    } catch (err: any) {
      setError(err.message || 'Failed to export report');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendReport = useCallback(async (id: number, recipients: string[]): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await reportsApi.send(id, recipients);
      return response.success;
    } catch (err: any) {
      setError(err.message || 'Failed to send report');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await reportsApi.getSubscriptions();
      if (response.success && response.data) {
        setSubscriptions(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch subscriptions', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSubscription = useCallback(async (data: Partial<ReportSubscription>): Promise<ReportSubscription | null> => {
    setIsLoading(true);
    try {
      const response = await reportsApi.createSubscription(data);
      if (response.success && response.data) {
        await fetchSubscriptions();
        return response.data;
      }
      return null;
    } catch (err) {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSubscriptions]);

  const deleteSubscription = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await reportsApi.deleteSubscription(id);
      if (response.success) {
        await fetchSubscriptions();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSubscriptions]);

  const updateParams = useCallback((newParams: Partial<{ page?: number; limit?: number; type?: string }>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchReports();
    }
  }, [autoFetch, fetchReports, params]);

  return {
    reports,
    total,
    totalPages,
    isLoading,
    error,
    params,
    subscriptions,
    fetchReports,
    generateReport,
    exportReport,
    sendReport,
    fetchSubscriptions,
    createSubscription,
    deleteSubscription,
    updateParams,
  };
};

export default useReports;