// src/hooks/useUserAI.ts
'use client';

import { useState, useCallback } from 'react';
import { UserActivityAnalysis, UserPerformanceMetrics, UserPrediction } from '@/types/user.types';

const mockTopPerformers = [
  { id: 1, firstName: 'Sophie', lastName: 'Martin', email: 'sophie.martin@courtier.fr', performanceScore: 98 },
  { id: 2, firstName: 'Thomas', lastName: 'Bernard', email: 'thomas.bernard@courtier.fr', performanceScore: 95 },
  { id: 3, firstName: 'Marie', lastName: 'Lambert', email: 'marie.lambert@courtier.fr', performanceScore: 92 },
  { id: 4, firstName: 'Nicolas', lastName: 'Dubois', email: 'nicolas.dubois@courtier.fr', performanceScore: 88 },
  { id: 5, firstName: 'Julie', lastName: 'Petit', email: 'julie.petit@courtier.fr', performanceScore: 85 },
];

export const useUserAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeActivity = useCallback(async (userId: number): Promise<UserActivityAnalysis | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    return {
      userId,
      activityScore: 75,
      engagementLevel: 'MEDIUM',
      mostActiveModule: 'Contrats',
      averageSessionDuration: 15,
      lastActivityDate: new Date().toISOString(),
      recommendations: ['Augmenter la fréquence de connexion'],
    };
  }, []);

  const getPerformanceMetrics = useCallback(async (userId: number): Promise<UserPerformanceMetrics | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    return {
      userId,
      tasksCompleted: 45,
      responseTime: 2.4,
      clientSatisfaction: 94,
      policiesManaged: 12,
      claimsProcessed: 5,
      efficiencyScore: 87,
      trend: 'up',
    };
  }, []);

  const predictBehavior = useCallback(async (userId: number): Promise<UserPrediction | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    return {
      userId,
      churnProbability: 15,
      productivityForecast: 82,
      recommendedActions: ['Former sur les nouvelles fonctionnalités'],
    };
  }, []);

  const getTopPerformers = useCallback(async (limit: number = 10) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsLoading(false);
    return mockTopPerformers.slice(0, limit);
  }, []);

  return {
    isLoading,
    error,
    analyzeActivity,
    getPerformanceMetrics,
    predictBehavior,
    getTopPerformers,
  };
};

export default useUserAI;