// src/hooks/useAuditAI.ts
// Hook pour l'audit spécifique de l'IA
'use client';

import { useState, useCallback } from 'react';
import { auditApi } from '@/modules/api/audit/audit.api';
import { IALog } from '@/types/audit.types';
import { PaginationParams } from '@/types/api.types';

// Données mockées pour le développement
const mockIALogs: IALog[] = [
  { id: 1, module: 'COMPANIES', endpoint: '/api/companies/1/analyze-risk', prompt: 'Analyse le risque financier de l\'entreprise AXA France', response: 'Score risque: 35% - Niveau modéré', tokens: 450, cost: 0.002, duration: 1200, success: true, userId: 1, userName: 'admin@courtier.fr', timestamp: new Date().toISOString() },
  { id: 2, module: 'CLAIMS', endpoint: '/api/claims/1/detect-fraud', prompt: 'Détecte les fraudes potentielles pour le sinistre #CL-001', response: 'Score fraude: 78% - Niveau élevé', tokens: 620, cost: 0.003, duration: 980, success: true, userId: 1, userName: 'admin@courtier.fr', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, module: 'POLICIES', endpoint: '/api/policies/1/predict-renewal', prompt: 'Prédit la probabilité de renouvellement du contrat', response: 'Probabilité: 85% - Forte', tokens: 380, cost: 0.0018, duration: 850, success: true, userId: 2, userName: 'broker@courtier.fr', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 4, module: 'CALENDAR', endpoint: '/api/calendar/ai/suggestions', prompt: 'Suggère des créneaux optimaux pour la semaine', response: '3 créneaux suggérés', tokens: 520, cost: 0.0025, duration: 1100, success: true, userId: 1, userName: 'admin@courtier.fr', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 5, module: 'REPORTS', endpoint: '/api/reports/ai/generate', prompt: 'Génère un rapport IA pour le mois de mai', response: 'Rapport généré avec succès', tokens: 1250, cost: 0.006, duration: 2500, success: true, userId: 1, userName: 'admin@courtier.fr', timestamp: new Date(Date.now() - 172800000).toISOString() },
];

const mockIAStats = {
  totalCalls: 342,
  totalCost: 124.50,
  averageLatency: 1250,
  successRate: 98.2,
  byModule: [
    { module: 'COMPANIES', calls: 98, cost: 35.20, avgLatency: 1100 },
    { module: 'CLAIMS', calls: 87, cost: 42.50, avgLatency: 1350 },
    { module: 'POLICIES', calls: 76, cost: 28.80, avgLatency: 1050 },
    { module: 'CALENDAR', calls: 45, cost: 12.00, avgLatency: 980 },
    { module: 'REPORTS', calls: 36, cost: 6.00, avgLatency: 1800 },
  ],
  dailyCalls: Array.from({ length: 7 }, (_, i) => ({ date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0], count: Math.floor(Math.random() * 30) + 10 })),
};

export const useAuditAI = () => {
  const [iaLogs, setIalogs] = useState<IALog[]>([]);
  const [iaStats, setIaStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Récupérer les logs IA
  const fetchIALogs = useCallback(async (params?: PaginationParams) => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIalogs(mockIALogs);
    setTotal(mockIALogs.length);
    setIsLoading(false);
  }, []);

  // Récupérer un log IA par ID
  const getIALogById = useCallback(async (id: number): Promise<IALog | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const found = mockIALogs.find(l => l.id === id) || null;
    setIsLoading(false);
    return found;
  }, []);

  // Récupérer les statistiques IA
  const fetchIAStats = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIaStats(mockIAStats);
    setIsLoading(false);
  }, []);

  // Exporter les logs IA
  const exportIALogs = useCallback(async (format: 'csv' | 'json' | 'pdf') => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Export IA logs as ${format}`);
    setIsLoading(false);
    return true;
  }, []);

  return {
    iaLogs,
    iaStats,
    isLoading,
    error,
    total,
    page,
    limit,
    fetchIALogs,
    getIALogById,
    fetchIAStats,
    exportIALogs,
    setPage,
    setLimit,
  };
};

export default useAuditAI;