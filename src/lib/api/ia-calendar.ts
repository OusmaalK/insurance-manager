// src/lib/api/ia-calendar.ts
// API client pour le calendrier IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/calendar/ai';

export const iaCalendarApi = {
  // Obtenir les suggestions de créneaux
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

  // Obtenir les suggestions IA
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

  // Obtenir le rapport de productivité
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

  // Optimiser l'agenda
  async optimizeSchedule(params?: { 
    startDate?: string; 
    endDate?: string; 
    preferredHours?: number[] 
  }): Promise<any> {
    try {
      const response = await apiClient.post(`${BASE_URL}/optimize`, params || {});
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to optimize schedule:', error);
      return null;
    }
  },
};

export default iaCalendarApi;