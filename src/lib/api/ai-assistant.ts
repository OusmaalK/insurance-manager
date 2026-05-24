// src/lib/api/ai-assistant.ts
// API client pour l'assistant IA
// <70 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/ai/assistant';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  confidence: number;
}

export const aiAssistantApi = {
  // Envoyer un message au chatbot
  async chat(message: string, history?: ChatMessage[]): Promise<ChatResponse | null> {
    try {
      const response = await apiClient.post(`${BASE_URL}/chat`, { message, history });
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to send chat message:', error);
      return null;
    }
  },

  // Recherche sémantique
  async search(query: string, type?: string, limit: number = 10): Promise<any[]> {
    try {
      const params = new URLSearchParams({ q: query, limit: limit.toString() });
      if (type) params.append('type', type);
      const response = await apiClient.get(`${BASE_URL}/search?${params}`);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to search:', error);
      return [];
    }
  },

  // Générer un rapport
  async generateReport(params: { type: string; period?: string; format?: 'pdf' | 'excel' }): Promise<any> {
    try {
      const response = await apiClient.post(`${BASE_URL}/generate-report`, params);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to generate report:', error);
      return null;
    }
  },

  // Obtenir les commandes rapides
  async getQuickCommands(): Promise<any[]> {
    try {
      const response = await apiClient.get(`${BASE_URL}/quick-commands`);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get quick commands:', error);
      return [];
    }
  },

  // Effacer l'historique
  async clearHistory(): Promise<boolean> {
    try {
      await apiClient.delete(`${BASE_URL}/history`);
      return true;
    } catch (error) {
      console.error('Failed to clear history:', error);
      return false;
    }
  },
};

export default aiAssistantApi;