// src/modules/api/policies/policies.api.ts
// API Client pour le module Policies
// <120 lignes

import { apiClient } from '../client/client';
import {
  Policy,
  PolicyFormData,
  PolicyFilters,
  PolicyRiskAnalysis,
  PolicyPredictions,
  ClauseAnalysis,
  PolicyStats,
} from '@/types/policy.types';
import { PaginationParams } from '@/types/api.types';

const BASE_URL = '/policies';

export const policiesApi = {
  // ============================================
  // CRUD
  // ============================================

  async getAll(params?: PaginationParams & PolicyFilters) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.company_id) searchParams.append('companyId', params.company_id.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.minRiskScore) searchParams.append('minRiskScore', params.minRiskScore.toString());
    if (params?.maxRiskScore) searchParams.append('maxRiskScore', params.maxRiskScore.toString());
    if (params?.expiringBefore) searchParams.append('expiringBefore', params.expiringBefore);

    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    return apiClient.get<{ data: Policy[]; total: number; page: number; limit: number; totalPages: number }>(url);
  },

  async getById(id: number) {
    return apiClient.get<Policy>(`${BASE_URL}/${id}`);
  },

  async create(data: PolicyFormData) {
    return apiClient.post<Policy>(BASE_URL, data);
  },

  async update(id: number, data: Partial<PolicyFormData>) {
    return apiClient.put<Policy>(`${BASE_URL}/${id}`, data);
  },

  async delete(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  // ============================================
  // STATISTIQUES
  // ============================================

  async getStats(): Promise<PolicyStats> {
    return apiClient.get<PolicyStats>(`${BASE_URL}/stats`);
  },

  async getExpiringPolicies(days: number = 30) {
    return apiClient.get<Policy[]>(`${BASE_URL}/expiring?days=${days}`);
  },

  // ============================================
  // ANALYSE IA
  // ============================================

  async analyzeRisk(id: number) {
    return apiClient.post<PolicyRiskAnalysis>(`${BASE_URL}/${id}/analyze-risk`);
  },

  async getPredictions(id: number): Promise<PolicyPredictions> {
    return apiClient.get<PolicyPredictions>(`${BASE_URL}/${id}/predictions`);
  },

  async analyzeClauses(id: number, text?: string) {
    return apiClient.post<ClauseAnalysis>(`${BASE_URL}/${id}/analyze-clauses`, { text });
  },

  async predictRenewal(id: number) {
    return apiClient.get<{ renewal_probability: number; factors: string[] }>(`${BASE_URL}/${id}/predict-renewal`);
  },

  async getOptimalPremium(id: number) {
    return apiClient.get<{ optimal_premium: number; current_premium: number; savings: number }>(
      `${BASE_URL}/${id}/optimal-premium`
    );
  },
};

export default policiesApi;