// src/lib/api/ia-webhooks.ts
// API client pour les webhooks IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/webhooks/ia';

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  lastTriggered?: string;
  lastStatus?: 'success' | 'failed';
}

export const iaWebhooksApi = {
  // Récupérer tous les webhooks
  async getWebhooks(): Promise<Webhook[]> {
    try {
      const response = await apiClient.get(BASE_URL);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get webhooks:', error);
      return [];
    }
  },

  // Créer un webhook
  async createWebhook(webhook: Omit<Webhook, 'id'>): Promise<Webhook | null> {
    try {
      const response = await apiClient.post(BASE_URL, webhook);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to create webhook:', error);
      return null;
    }
  },

  // Mettre à jour un webhook
  async updateWebhook(id: string, webhook: Partial<Webhook>): Promise<Webhook | null> {
    try {
      const response = await apiClient.put(`${BASE_URL}/${id}`, webhook);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to update webhook:', error);
      return null;
    }
  },

  // Supprimer un webhook
  async deleteWebhook(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`${BASE_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      return false;
    }
  },

  // Tester un webhook
  async testWebhook(id: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`${BASE_URL}/${id}/test`);
      return (response as any).success === true;
    } catch (error) {
      console.error('Failed to test webhook:', error);
      return false;
    }
  },
};

export default iaWebhooksApi;