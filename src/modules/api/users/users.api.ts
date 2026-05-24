// src/modules/api/users/users.api.ts
// API Client pour le module Users
// <120 lignes

import { apiClient } from '../client/client';
import {
  User,
  UserFormData,
  UserFilters,
  UserStats,
  UserActivity,
  UserActivityAnalysis,
  UserPerformanceMetrics,
  UserPrediction,
} from '@/types/user.types';
import { PaginationParams } from '@/types/api.types';

const BASE_URL = '/users';

export const usersApi = {
  // ============================================
  // CRUD
  // ============================================

  async getAll(params?: PaginationParams & UserFilters) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.role) searchParams.append('role', params.role);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.department) searchParams.append('department', params.department);

    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    return apiClient.get<{ data: User[]; total: number; page: number; limit: number; totalPages: number }>(url);
  },

  async getById(id: number) {
    return apiClient.get<User>(`${BASE_URL}/${id}`);
  },

  async create(data: UserFormData) {
    return apiClient.post<User>(BASE_URL, data);
  },

  async update(id: number, data: Partial<UserFormData>) {
    return apiClient.put<User>(`${BASE_URL}/${id}`, data);
  },

  async updateStatus(id: number, status: User['status']) {
    return apiClient.patch<User>(`${BASE_URL}/${id}/status`, { status });
  },

  async delete(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  // ============================================
  // ACTIVITÉS
  // ============================================

  async getActivities(id: number, limit: number = 50) {
    return apiClient.get<UserActivity[]>(`${BASE_URL}/${id}/activities?limit=${limit}`);
  },

  // ============================================
  // STATISTIQUES
  // ============================================

  async getStats(): Promise<UserStats> {
    return apiClient.get<UserStats>(`${BASE_URL}/stats`);
  },

  // ============================================
  // ANALYSE IA
  // ============================================

  async analyzeActivity(id: number): Promise<UserActivityAnalysis> {
    return apiClient.post<UserActivityAnalysis>(`${BASE_URL}/${id}/analyze-activity`);
  },

  async getPerformanceMetrics(id: number): Promise<UserPerformanceMetrics> {
    return apiClient.get<UserPerformanceMetrics>(`${BASE_URL}/${id}/performance`);
  },

  async predictBehavior(id: number): Promise<UserPrediction> {
    return apiClient.get<UserPrediction>(`${BASE_URL}/${id}/predict`);
  },

  async getTopPerformers(limit: number = 10) {
    return apiClient.get<User[]>(`${BASE_URL}/top-performers?limit=${limit}`);
  },
};

export default usersApi;