// src/modules/api/renewals/renewals.api.ts
// API Client pour les Renouvellements
// <70 lignes

import { apiClient } from '../client/client';

// ============================================
// TYPES
// ============================================

export interface Renewal {
  id: number;
  policy_id: number;
  policy_number: string;
  company_id: number;
  company_name: string;
  current_premium: number;
  new_premium?: number;
  renewal_date: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'AUTO_RENEWED';
  renewal_probability: number;
  suggested_action?: string;
  created_at: string;
  updated_at: string;
}

export interface RenewalAction {
  renewal_id: number;
  action: 'APPROVE' | 'DECLINE' | 'MODIFY';
  new_premium?: number;
  notes?: string;
}

// ============================================
// ENDPOINTS
// ============================================

const BASE_URL = '/renewals';

export const renewalsApi = {
  // Liste des renouvellements
  async getAll(params?: { status?: string; daysThreshold?: number; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.daysThreshold) searchParams.append('daysThreshold', params.daysThreshold.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    return apiClient.get<{ data: Renewal[]; total: number }>(url);
  },

  // Renouvellements par entreprise
  async getByCompanyId(companyId: number) {
    return apiClient.get<Renewal[]>(`${BASE_URL}/company/${companyId}`);
  },

  // Récupérer un renouvellement par ID
  async getById(id: number) {
    return apiClient.get<Renewal>(`${BASE_URL}/${id}`);
  },

  // Traiter un renouvellement
  async process(id: number, action: RenewalAction) {
    return apiClient.post<Renewal>(`${BASE_URL}/${id}/process`, action);
  },

  // Approbation automatique (IA)
  async autoApprove(id: number) {
    return apiClient.post<Renewal>(`${BASE_URL}/${id}/auto-approve`);
  },

  // Prédiction IA pour renouvellement
  async predict(id: number) {
    return apiClient.post<{
      renewal_probability: number;
      risk_level: string;
      suggested_action: string;
      reasons: string[];
    }>(`${BASE_URL}/${id}/predict`);
  },

  // Statistiques
  async getStats() {
    return apiClient.get<{
      total_pending: number;
      total_approved: number;
      total_declined: number;
      average_probability: number;
      expected_renewals: number;
    }>(`${BASE_URL}/stats`);
  },
};

export default renewalsApi;