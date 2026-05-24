// src/hooks/useCalendarAI.ts
// Hook pour l'IA du calendrier
// <120 lignes

'use client';

import { useState, useCallback } from 'react';
import { calendarApi } from '@/modules/api/calendar/calendar.api';
import { AISuggestion, AIOptimizationResult, ProductivityReport } from '@/types/calendar.types';

export const useCalendarAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [optimization, setOptimization] = useState<AIOptimizationResult | null>(null);
  const [productivity, setProductivity] = useState<ProductivityReport | null>(null);

  // Obtenir les suggestions IA
  const getSuggestions = useCallback(async (): Promise<AISuggestion[] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await calendarApi.getAISuggestions();
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        setSuggestions(Array.isArray(data) ? data : []);
        return Array.isArray(data) ? data : [];
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des suggestions');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir les créneaux optimaux
  const getOptimalSlots = useCallback(async (duration: number, date?: string): Promise<AIOptimizationResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await calendarApi.getOptimalSlots(duration, date);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        setOptimization(data);
        return data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'optimisation');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir le rapport de productivité
  const getProductivityReport = useCallback(async (period: 'day' | 'week' | 'month'): Promise<ProductivityReport | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await calendarApi.getProductivityReport(period);
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        setProductivity(data);
        return data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération du rapport');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimiser l'agenda
  const optimizeSchedule = useCallback(async (): Promise<AIOptimizationResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await calendarApi.optimizeSchedule();
      if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        setOptimization(data);
        return data;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'optimisation');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    suggestions,
    optimization,
    productivity,
    getSuggestions,
    getOptimalSlots,
    getProductivityReport,
    optimizeSchedule,
  };
};

export default useCalendarAI;