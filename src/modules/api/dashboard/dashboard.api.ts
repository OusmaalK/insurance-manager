// src/modules/api/dashboard/dashboard.api.ts
// API Client pour le Dashboard
// <70 lignes

import { apiClient } from '../client/client';

// ============================================
// TYPES
// ============================================

export interface DashboardStats {
  total_companies: number;
  total_policies: number;
  total_claims: number;
  active_policies: number;
  pending_claims: number;
  total_premium: number;
  total_commissions: number;
  fraud_alerts: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface RecentActivity {
  id: number;
  type: 'COMPANY' | 'POLICY' | 'CLAIM' | 'RENEWAL';
  action: string;
  entity_name: string;
  created_at: string;
  user_name: string;
}

// ============================================
// ENDPOINTS
// ============================================

const BASE_URL = '/dashboard';

export const dashboardApi = {
  // Statistiques globales
  async getStats() {
    return apiClient.get<DashboardStats>(`${BASE_URL}/stats`);
  },

  // Graphiques
  async getChartData(period: 'WEEKLY' | 'MONTHLY' | 'YEARLY' = 'MONTHLY') {
    return apiClient.get<{
      premiums: ChartDataPoint[];
      claims: ChartDataPoint[];
      renewals: ChartDataPoint[];
    }>(`${BASE_URL}/charts?period=${period}`);
  },

  // Activité récente
  async getRecentActivity(limit: number = 10) {
    return apiClient.get<RecentActivity[]>(`${BASE_URL}/recent?limit=${limit}`);
  },

  // KPIs pour courtier
  async getBrokerKpis() {
    return apiClient.get<{
      monthly_commission: number;
      renewal_rate: number;
      client_retention: number;
      average_response_time: number;
    }>(`${BASE_URL}/broker-kpis`);
  },

  // KPIs pour admin
  async getAdminKpis() {
    return apiClient.get<{
      total_users: number;
      active_brokers: number;
      system_health: number;
      ia_usage: number;
    }>(`${BASE_URL}/admin-kpis`);
  },
};

export default dashboardApi;