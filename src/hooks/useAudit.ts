// src/hooks/useAudit.ts
// Hook pour la gestion des logs d'audit
// <150 lignes

'use client';

import { useState, useCallback, useEffect } from 'react';
import { auditApi } from '@/modules/api/audit/audit.api';
import { AuditLog, AuditFilters, AuditStats, IALog } from '@/types/audit.types';
import { PaginationParams } from '@/types/api.types';

// Données mockées pour le développement
const mockLogs: AuditLog[] = [
  { id: 1, action: 'Analyse risque entreprise', entityType: 'COMPANY', entityId: 1, entityName: 'AXA France', module: 'COMPANIES', severity: 'INFO', status: 'SUCCESS', details: 'Score risque calculé: 35%', metadata: { aiConfidence: 92, aiModel: 'gemini-2.0-flash', cost: 0.002, tokens: 450 }, userId: 1, userName: 'admin@courtier.fr', userRole: 'ADMIN', ipAddress: '127.0.0.1', userAgent: 'Chrome', duration: 1200, timestamp: new Date().toISOString() },
  { id: 2, action: 'Détection fraude', entityType: 'CLAIM', entityId: 1, entityName: 'Sinistre #CL-001', module: 'CLAIMS', severity: 'WARNING', status: 'SUCCESS', details: 'Score fraude: 78%', metadata: { aiConfidence: 88, aiModel: 'gemini-2.0-flash', cost: 0.003, tokens: 620 }, userId: 1, userName: 'admin@courtier.fr', userRole: 'ADMIN', ipAddress: '127.0.0.1', userAgent: 'Chrome', duration: 980, timestamp: new Date().toISOString() },
];

const mockStats: AuditStats = {
  totalLogs: 1247,
  totalIALogs: 342,
  errorsCount: 12,
  warningsCount: 45,
  criticalCount: 3,
  averageDuration: 850,
  totalCost: 124.50,
  logsByModule: [
    { module: 'COMPANIES', count: 420, errors: 3 },
    { module: 'CLAIMS', count: 380, errors: 8 },
    { module: 'POLICIES', count: 290, errors: 1 },
    { module: 'IA', count: 157, errors: 0 },
  ],
  logsByHour: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: Math.floor(Math.random() * 50) + 10 })),
  topUsers: [
    { userId: 1, userName: 'admin@courtier.fr', count: 890 },
    { userId: 2, userName: 'broker@courtier.fr', count: 357 },
  ],
  last24h: 156,
};

export const useAudit = (options: { autoFetch?: boolean } = {}) => {
  const { autoFetch = true } = options;
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [iaLogs, setIalogs] = useState<IALog[]>([]);
  const [log, setLog] = useState<AuditLog | null>(null);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AuditFilters>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLogs(mockLogs);
    setTotal(mockLogs.length);
    setIsLoading(false);
  }, []);

  const fetchIALogs = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIalogs([]);
    setIsLoading(false);
  }, []);

  const getLogById = useCallback(async (id: number): Promise<AuditLog | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const found = mockLogs.find(l => l.id === id) || null;
    setLog(found);
    setIsLoading(false);
    return found;
  }, []);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setStats(mockStats);
    setIsLoading(false);
  }, []);

  const exportLogs = useCallback(async (format: 'csv' | 'json' | 'pdf') => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Export logs as ${format}`);
    setIsLoading(false);
    return true;
  }, []);

  const updateFilters = useCallback((newFilters: Partial<AuditFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchLogs();
      fetchStats();
    }
  }, [autoFetch, fetchLogs, fetchStats]);

  return {
    logs,
    iaLogs,
    log,
    stats,
    total,
    isLoading,
    error,
    filters,
    page,
    limit,
    fetchLogs,
    fetchIALogs,
    getLogById,
    fetchStats,
    exportLogs,
    updateFilters,
    setPage,
    setLimit,
  };
};

export default useAudit;