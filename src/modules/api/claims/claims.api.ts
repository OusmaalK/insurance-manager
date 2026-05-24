// src/modules/api/claims/claims.api.ts
// API Client pour le module Claims
// <120 lignes

import { apiClient } from '../client/client';
import {
  Claim,
  ClaimFormData,
  ClaimFilters,
  FraudAnalysis,
  ClaimPredictions,
  ClaimStats,
  ClaimDocument,
} from '@/types/claim.types';
import { PaginationParams } from '@/types/api.types';

const BASE_URL = '/claims';

export const claimsApi = {
  // ============================================
  // CRUD
  // ============================================

  async getAll(params?: PaginationParams & ClaimFilters) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.policy_id) searchParams.append('policyId', params.policy_id.toString());
    if (params?.company_id) searchParams.append('companyId', params.company_id.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.minFraudScore) searchParams.append('minFraudScore', params.minFraudScore.toString());
    if (params?.maxFraudScore) searchParams.append('maxFraudScore', params.maxFraudScore.toString());
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    return apiClient.get<{ data: Claim[]; total: number; page: number; limit: number; totalPages: number }>(url);
  },

  async getById(id: number) {
    return apiClient.get<Claim>(`${BASE_URL}/${id}`);
  },

  async create(data: ClaimFormData) {
    return apiClient.post<Claim>(BASE_URL, data);
  },

  async update(id: number, data: Partial<ClaimFormData>) {
    return apiClient.put<Claim>(`${BASE_URL}/${id}`, data);
  },

  async updateStatus(id: number, status: Claim['status']) {
    return apiClient.patch<Claim>(`${BASE_URL}/${id}/status`, { status });
  },

  async delete(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  // ============================================
  // STATISTIQUES
  // ============================================

  async getStats(): Promise<ClaimStats> {
    return apiClient.get<ClaimStats>(`${BASE_URL}/stats`);
  },

  async getHighRiskClaims(threshold: number = 60) {
    return apiClient.get<Claim[]>(`${BASE_URL}/high-risk?threshold=${threshold}`);
  },

  // ============================================
  // ANALYSE IA
  // ============================================

  async detectFraud(id: number): Promise<FraudAnalysis> {
    return apiClient.post<FraudAnalysis>(`${BASE_URL}/${id}/detect-fraud`);
  },

  async predictAmount(id: number): Promise<ClaimPredictions> {
    return apiClient.post<ClaimPredictions>(`${BASE_URL}/${id}/predict-amount`);
  },

  async autoApprove(id: number) {
    return apiClient.post<{ approved: boolean; message: string }>(`${BASE_URL}/${id}/auto-approve`);
  },

  async uploadDocument(id: number, file: File) {
    const formData = new FormData();
    formData.append('document', file);
    return apiClient.post<ClaimDocument>(`${BASE_URL}/${id}/documents`, formData);
  },
};

export default claimsApi;