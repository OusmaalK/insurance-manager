// src/hooks/useAIReports.ts
// Hook pour les rapports IA
// <100 lignes

'use client';

import { useState, useCallback } from 'react';
import { reportsApi } from '@/modules/api/reports/reports.api';
import { AIReport } from '@/types/report.types';

export const useAIReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAIReport, setCurrentAIReport] = useState<AIReport | null>(null);
  const [aiReports, setAiReports] = useState<AIReport[]>([]);

  // Générer un rapport IA
  const generateAIReport = useCallback(async (period: { start: string; end: string }): Promise<AIReport | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await reportsApi.generateAIReport(period);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        setCurrentAIReport(data);
        return data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération du rapport IA');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer tous les rapports IA
  const fetchAIReports = useCallback(async (): Promise<AIReport[] | null> => {
    setIsLoading(true);
    try {
      const response = await reportsApi.getAIReports();
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        setAiReports(Array.isArray(data) ? data : []);
        return Array.isArray(data) ? data : [];
      }
      return null;
    } catch (err) {
      console.error('fetchAIReports error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer un rapport IA par ID
  const getAIReport = useCallback(async (id: number): Promise<AIReport | null> => {
    setIsLoading(true);
    try {
      const response = await reportsApi.getAIReport(id);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        return data;
      }
      return null;
    } catch (err) {
      console.error('getAIReport error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    currentAIReport,
    aiReports,
    generateAIReport,
    fetchAIReports,
    getAIReport,
  };
};

export default useAIReports;