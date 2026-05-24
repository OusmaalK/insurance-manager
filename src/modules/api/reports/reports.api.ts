// src/modules/api/reports/reports.api.ts
// API Client pour le module Reports
// <120 lignes

import { apiClient } from '../client/client';
import {
  Report,
  ReportFormData,
  ReportFilters,
  ReportStats,
  AIReport,
} from '@/types/report.types';
import { PaginationParams } from '@/types/api.types';

const BASE_URL = '/reports';

export const reportsApi = {
  // ============================================
  // CRUD
  // ============================================

  async getAll(params?: PaginationParams & ReportFilters) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.format) searchParams.append('format', params.format);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.scheduled) searchParams.append('scheduled', params.scheduled.toString());

    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    return apiClient.get<{ data: Report[]; total: number; page: number; limit: number; totalPages: number }>(url);
  },

  async getById(id: number) {
    return apiClient.get<Report>(`${BASE_URL}/${id}`);
  },

  async generate(data: ReportFormData): Promise<Report> {
    return apiClient.post<Report>(`${BASE_URL}/generate`, data);
  },

  async delete(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  // ============================================
  // EXPORT
  // ============================================

  async export(id: number, format: 'PDF' | 'EXCEL' | 'CSV') {
    return apiClient.get(`${BASE_URL}/${id}/export?format=${format}`, { responseType: 'blob' });
  },

  // ============================================
  // PLANIFICATION
  // ============================================

  async schedule(id: number, schedule: any) {
    return apiClient.post(`${BASE_URL}/${id}/schedule`, schedule);
  },

  async cancelSchedule(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}/schedule`);
  },

  async getScheduledReports() {
    return apiClient.get<Report[]>(`${BASE_URL}/scheduled`);
  },

  // ============================================
  // STATISTIQUES
  // ============================================

  async getStats(): Promise<ReportStats> {
    return apiClient.get<ReportStats>(`${BASE_URL}/stats`);
  },

  // ============================================
  // RAPPORTS IA
  // ============================================

  async generateAIReport(period: { start: string; end: string }): Promise<AIReport> {
    return apiClient.post<AIReport>(`${BASE_URL}/ai/generate`, period);
  },

  async getAIReport(id: number): Promise<AIReport> {
    return apiClient.get<AIReport>(`${BASE_URL}/ai/${id}`);
  },

  async getAIReports(): Promise<AIReport[]> {
    return apiClient.get<AIReport[]>(`${BASE_URL}/ai/list`);
  },
};

export default reportsApi;