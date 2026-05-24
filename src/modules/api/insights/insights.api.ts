// src/modules/api/insights/insights.api.ts
// API Client pour les Insights
// <70 lignes

import { apiClient } from '../client/client';

// ============================================
// TYPES
// ============================================

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'TREND' | 'ALERT' | 'RECOMMENDATION' | 'OPPORTUNITY';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  value: number;
  change_percent: number;
  created_at: string;
  action_url?: string;
}

export interface TrendData {
  metric: string;
  current_value: number;
  previous_value: number;
  change_percent: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

// ============================================
// ENDPOINTS
// ============================================

const BASE_URL = '/insights';

export const insightsApi = {
  // Récupérer les insights
  async getInsights(params?: { type?: string; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    return apiClient.get<Insight[]>(url);
  },

  // Tendances
  async getTrends(period: 'WEEKLY' | 'MONTHLY' | 'YEARLY' = 'MONTHLY') {
    return apiClient.get<TrendData[]>(`${BASE_URL}/trends?period=${period}`);
  },

  // Recommandations IA
  async getRecommendations() {
    return apiClient.get<Insight[]>(`${BASE_URL}/recommendations`);
  },

  // Alertes
  async getAlerts(unreadOnly: boolean = false) {
    return apiClient.get<Insight[]>(`${BASE_URL}/alerts?unread=${unreadOnly}`);
  },

  // Marquer comme lu
  async markAsRead(insightId: string) {
    return apiClient.post(`${BASE_URL}/${insightId}/read`);
  },
};

export default insightsApi;