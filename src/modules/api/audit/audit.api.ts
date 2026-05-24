// src/modules/api/audit/audit.api.ts
// API Client pour le module Audit
// <100 lignes

import { apiClient } from '../client/client';
import { AuditLog, AuditFilters, AuditStats, IALog } from '@/types/audit.types';
import { PaginationParams } from '@/types/api.types';

const BASE_URL = '/audit';

export const auditApi = {
  // ============================================
  // LOGS GÉNÉRAUX
  // ============================================

  async getLogs(params?: PaginationParams & AuditFilters) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.module) searchParams.append('module', params.module);
    if (params?.severity) searchParams.append('severity', params.severity);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.entityType) searchParams.append('entityType', params.entityType);
    if (params?.userId) searchParams.append('userId', params.userId.toString());
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.search) searchParams.append('search', params.search);
    
    const url = searchParams.toString() ? `${BASE_URL}/logs?${searchParams}` : `${BASE_URL}/logs`;
    return apiClient.get<{ data: AuditLog[]; total: number; page: number; limit: number; totalPages: number }>(url);
  },

  async getLogById(id: number) {
    return apiClient.get<AuditLog>(`${BASE_URL}/logs/${id}`);
  },

  // ============================================
  // LOGS IA
  // ============================================

  async getIALogs(params?: PaginationParams) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    const url = searchParams.toString() ? `${BASE_URL}/ia?${searchParams}` : `${BASE_URL}/ia`;
    return apiClient.get<{ data: IALog[]; total: number; page: number; limit: number; totalPages: number }>(url);
  },

  async getIALogById(id: number) {
    return apiClient.get<IALog>(`${BASE_URL}/ia/${id}`);
  },

  // ============================================
  // STATISTIQUES
  // ============================================

  async getStats(): Promise<AuditStats> {
    return apiClient.get<AuditStats>(`${BASE_URL}/stats`);
  },

  async getIAStats() {
    return apiClient.get(`${BASE_URL}/ia/stats`);
  },

  // ============================================
  // EXPORT
  // ============================================

  async exportLogs(format: 'csv' | 'json' | 'pdf', filters?: AuditFilters) {
    return apiClient.get(`${BASE_URL}/export?format=${format}`, { params: filters, responseType: 'blob' });
  },
};

export default auditApi;