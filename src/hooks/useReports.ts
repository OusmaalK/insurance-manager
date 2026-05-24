// src/hooks/useReports.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Report, ReportFilters, ReportStats, AIReport } from '@/types/report.types';
import { PaginationParams } from '@/types/api.types';

// Données mockées
const mockReports: Report[] = [
  { id: 1, title: 'Rapport mensuel Mai 2026', description: 'Analyse des sinistres', type: 'STANDARD', format: 'PDF', status: 'COMPLETED', data: {}, generatedAt: new Date().toISOString(), createdBy: 1, createdByName: 'Admin', metadata: { source: 'API', dateRange: { start: '2026-05-01', end: '2026-05-31' }, filters: {}, size: 125000 } },
  { id: 2, title: 'Analyse IA Sinistres', description: 'Rapport intelligent', type: 'AI', format: 'PDF', status: 'COMPLETED', data: {}, generatedAt: new Date(Date.now() - 86400000).toISOString(), createdBy: 1, createdByName: 'Admin', metadata: { source: 'API', dateRange: { start: '2026-04-01', end: '2026-04-30' }, filters: {}, size: 89000 } },
];

const mockStats: ReportStats = {
  total: 48,
  standardCount: 32,
  aiCount: 16,
  scheduledCount: 8,
  recentGenerations: 12,
  byType: [{ type: 'STANDARD', count: 32 }, { type: 'AI', count: 16 }],
};

export const useReports = (options: { autoFetch?: boolean } = {}) => {
  const { autoFetch = true } = options;
  const [reports, setReports] = useState<Report[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [aiReports, setAiReports] = useState<AIReport[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setReports(mockReports);
    setTotal(mockReports.length);
    setIsLoading(false);
  }, []);

  const getReport = useCallback(async (id: number): Promise<Report | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const found = mockReports.find(r => r.id === id) || null;
    setReport(found);
    setIsLoading(false);
    return found;
  }, []);

  const fetchStats = useCallback(async (): Promise<ReportStats | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsLoading(false);
    return mockStats;
  }, []);

  const generateReport = useCallback(async (data: any): Promise<Report | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newReport = { ...data, id: Date.now(), status: 'COMPLETED', generatedAt: new Date().toISOString(), createdBy: 1, metadata: { size: 45000 } };
    setReports(prev => [newReport, ...prev]);
    setIsLoading(false);
    return newReport;
  }, []);

  const deleteReport = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setReports(prev => prev.filter(r => r.id !== id));
    setIsLoading(false);
    return true;
  }, []);

  const exportReport = useCallback(async (id: number, format: 'PDF' | 'EXCEL' | 'CSV') => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Export report ${id} as ${format}`);
    setIsLoading(false);
    return true;
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchReports();
    }
  }, [autoFetch, fetchReports]);

  return {
    reports,
    report,
    aiReports,
    total,
    isLoading,
    error,
    fetchReports,
    getReport,
    fetchStats,
    generateReport,
    deleteReport,
    exportReport,
  };
};

export default useReports;