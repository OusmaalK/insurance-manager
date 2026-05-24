// src/hooks/useIASettings.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { IASettings, IASettingsStats, DEFAULT_SETTINGS } from '@/types/ia-settings.types';

const mockStats: IASettingsStats = {
  totalApiCalls: 1247,
  averageLatency: 1200,
  fraudDetectionRate: 87,
  autoApprovalRate: 76,
  monthlyCost: 12450,
  modelAccuracy: 94,
};

export const useIASettings = () => {
  const [settings, setSettings] = useState<IASettings | null>(null);
  const [stats, setStats] = useState<IASettingsStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSettings(DEFAULT_SETTINGS);
    setIsLoading(false);
  }, []);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setStats(mockStats);
    setIsLoading(false);
  }, []);

  const updateSettings = useCallback(async (data: Partial<IASettings>): Promise<IASettings | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSettings(prev => ({ ...prev, ...data, updatedAt: new Date().toISOString(), updatedBy: 'admin' } as IASettings));
    setIsLoading(false);
    return settings;
  }, [settings]);

  const resetSettings = useCallback(async (): Promise<IASettings | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSettings(DEFAULT_SETTINGS);
    setIsLoading(false);
    return DEFAULT_SETTINGS;
  }, []);

  const testConfiguration = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    return { success: true, message: 'Configuration fonctionnelle' };
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchStats();
  }, []);

  return {
    settings,
    stats,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
    resetSettings,
    testConfiguration,
    fetchStats,
  };
};

export default useIASettings;