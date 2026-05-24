// src/modules/api/ai-assistant/ai-assistant.api.ts
// API Client pour le module AI Assistant (endpoints /api/ai/assistant)
// <80 lignes

import { apiClient } from '../client/client';

// ============================================
// TYPES
// ============================================

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  context?: {
    company_id?: number;
    policy_id?: number;
    claim_id?: number;
  };
  history?: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  actions?: QuickAction[];
  confidence: number;
}

export interface QuickAction {
  type: 'CREATE_REPORT' | 'ANALYZE_RISK' | 'SCHEDULE_MEETING' | 'SEND_EMAIL';
  label: string;
  params: Record<string, any>;
}

export interface SearchRequest {
  query: string;
  type?: 'companies' | 'policies' | 'claims' | 'all';
  limit?: number;
}

export interface SearchResult {
  id: number;
  type: string;
  title: string;
  description: string;
  url: string;
  score: number;
}

export interface ReportGenerationRequest {
  type: 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  format?: 'pdf' | 'excel';
  company_id?: number;
  send_email?: boolean;
}

// ============================================
// ENDPOINTS
// ============================================

const BASE_URL = '/ai/assistant';

export const aiAssistantApi = {
  // Envoyer un message au chatbot
  async chat(request: ChatRequest) {
    return apiClient.post<ChatResponse>(`${BASE_URL}/chat`, request);
  },

  // Recherche sémantique
  async search(request: SearchRequest) {
    return apiClient.post<SearchResult[]>(`${BASE_URL}/search`, request);
  },

  // Générer un rapport via l'assistant
  async generateReport(request: ReportGenerationRequest) {
    return apiClient.post<{ report_id: number; download_url: string }>(`${BASE_URL}/generate-report`, request);
  },

  // Obtenir les commandes rapides
  async getQuickCommands() {
    return apiClient.get<QuickAction[]>(`${BASE_URL}/quick-commands`);
  },

  // Obtenir l'historique de conversation
  async getHistory(limit: number = 50) {
    return apiClient.get<ChatMessage[]>(`${BASE_URL}/history?limit=${limit}`);
  },

  // Effacer l'historique
  async clearHistory() {
    return apiClient.delete(`${BASE_URL}/history`);
  },
};

export default aiAssistantApi;