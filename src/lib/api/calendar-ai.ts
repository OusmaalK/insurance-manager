// src/lib/api/calendar-ai.ts
// API client pour le calendrier IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/calendar/ai';

export const calendarAiApi = {
  // Suggestions de créneaux optimaux
  async getSmartSlots(daysAhead: number = 14): Promise<any[]> {
    try {
      const response = await apiClient.get(`${BASE_URL}/smart-slots?days=${daysAhead}`);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get smart slots:', error);
      return [];
    }
  },

  // Suggestions IA générales
  async getSuggestions(): Promise<any[]> {
    try {
      const response = await apiClient.get(`${BASE_URL}/suggestions`);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  },

  // Rapport de productivité
  async getProductivityReport(period?: 'WEEKLY' | 'MONTHLY'): Promise<any> {
    try {
      const url = period ? `${BASE_URL}/productivity?period=${period}` : `${BASE_URL}/productivity`;
      const response = await apiClient.get(url);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get productivity report:', error);
      return null;
    }
  },

  // Détecter les conflits
  async detectConflicts(startDate: string, endDate: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`${BASE_URL}/conflicts?start=${startDate}&end=${endDate}`);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to detect conflicts:', error);
      return [];
    }
  },
};

export default calendarAiApi;