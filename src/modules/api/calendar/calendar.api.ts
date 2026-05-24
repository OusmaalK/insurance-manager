// src/modules/api/calendar/calendar.api.ts
// API Client pour le module Calendar
// <120 lignes

import { apiClient } from '../client/client';
import {
  CalendarEvent,
  CalendarEventFormData,
  CalendarFilters,
  CalendarStats,
  AISuggestion,
  AIOptimizationResult,
  ProductivityReport,
} from '@/types/calendar.types';
import { PaginationParams } from '@/types/api.types';

const BASE_URL = '/calendar';

export const calendarApi = {
  // ============================================
  // CRUD
  // ============================================

  async getAll(params?: PaginationParams & CalendarFilters) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type);
    if (params?.priority) searchParams.append('priority', params.priority);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.start_date) searchParams.append('startDate', params.start_date);
    if (params?.end_date) searchParams.append('endDate', params.end_date);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.related_type) searchParams.append('relatedType', params.related_type);

    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    return apiClient.get<{ data: CalendarEvent[]; total: number; page: number; limit: number; totalPages: number }>(url);
  },

  async getById(id: number) {
    return apiClient.get<CalendarEvent>(`${BASE_URL}/${id}`);
  },

  async create(data: CalendarEventFormData) {
    return apiClient.post<CalendarEvent>(BASE_URL, data);
  },

  async update(id: number, data: Partial<CalendarEventFormData>) {
    return apiClient.put<CalendarEvent>(`${BASE_URL}/${id}`, data);
  },

  async updateStatus(id: number, status: CalendarEvent['status']) {
    return apiClient.patch<CalendarEvent>(`${BASE_URL}/${id}/status`, { status });
  },

  async delete(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  // ============================================
  // STATISTIQUES
  // ============================================

  async getStats(): Promise<CalendarStats> {
    return apiClient.get<CalendarStats>(`${BASE_URL}/stats`);
  },

  // ============================================
  // IA - Suggestions & Optimisation
  // ============================================

  async getAISuggestions(): Promise<AISuggestion[]> {
    return apiClient.get<AISuggestion[]>(`${BASE_URL}/ai/suggestions`);
  },

  async getOptimalSlots(duration: number, date?: string): Promise<AIOptimizationResult> {
    const params = new URLSearchParams();
    params.append('duration', duration.toString());
    if (date) params.append('date', date);
    return apiClient.get<AIOptimizationResult>(`${BASE_URL}/ai/optimal-slots?${params}`);
  },

  async getProductivityReport(period: 'day' | 'week' | 'month'): Promise<ProductivityReport> {
    return apiClient.get<ProductivityReport>(`${BASE_URL}/ai/productivity?period=${period}`);
  },

  async optimizeSchedule(): Promise<AIOptimizationResult> {
    return apiClient.post<AIOptimizationResult>(`${BASE_URL}/ai/optimize`);
  },

  // ============================================
  // EXPORT
  // ============================================

  async export(format: 'pdf' | 'ics' | 'csv', filters?: CalendarFilters) {
    return apiClient.get(`${BASE_URL}/export?format=${format}`, { params: filters, responseType: 'blob' });
  },
};

export default calendarApi;