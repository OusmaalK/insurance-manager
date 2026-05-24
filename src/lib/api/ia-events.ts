// src/lib/api/ia-events.ts
// API client pour les événements IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';
import EventBus from '@/modules/events/EventBus';

const BASE_URL = '/events/ia';

export const iaEventsApi = {
  // Récupérer les événements système
  async getEvents(params?: { type?: string; startDate?: string; endDate?: string; limit?: number }): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const url = queryParams.toString() ? `${BASE_URL}?${queryParams}` : BASE_URL;
      const response = await apiClient.get(url);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get events:', error);
      return [];
    }
  },

  // Émettre un événement
  async emitEvent(event: string, data?: any): Promise<void> {
    try {
      await apiClient.post(`${BASE_URL}/emit`, { event, data });
      EventBus.emit(event, data);
    } catch (error) {
      console.error('Failed to emit event:', error);
    }
  },

  // S'abonner à un événement
  onEvent(event: string, callback: (data: any) => void): string {
    return EventBus.on(event, callback);
  },

  // Se désabonner
  offEvent(event: string, id?: string): void {
    EventBus.off(event, id);
  },

  // Obtenir les statistiques des événements
  async getEventStats(): Promise<any> {
    try {
      const response = await apiClient.get(`${BASE_URL}/stats`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get event stats:', error);
      return null;
    }
  },
};

export default iaEventsApi;