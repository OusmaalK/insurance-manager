// src/modules/api/notifications/notifications.api.ts
// API Client pour le module Notifications
// <120 lignes

import { apiClient } from '../client/client';
import { 
  Notification, 
  NotificationFilters, 
  NotificationStats, 
  NotificationPreferences,
  BulkAction 
} from '@/types/notification.types';
import { PaginationParams } from '@/types/api.types';

const BASE_URL = '/notifications';

export const notificationsApi = {
  // ============================================
  // CRUD
  // ============================================

  async getAll(params?: PaginationParams & NotificationFilters) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type);
    if (params?.priority) searchParams.append('priority', params.priority);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.unreadOnly) searchParams.append('unreadOnly', 'true');
    
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    return apiClient.get<{ data: Notification[]; total: number; page: number; limit: number; totalPages: number }>(url);
  },

  async getById(id: number) {
    return apiClient.get<Notification>(`${BASE_URL}/${id}`);
  },

  async markAsRead(id: number) {
    return apiClient.patch<Notification>(`${BASE_URL}/${id}/read`);
  },

  async markAsUnread(id: number) {
    return apiClient.patch<Notification>(`${BASE_URL}/${id}/unread`);
  },

  async archive(id: number) {
    return apiClient.patch<Notification>(`${BASE_URL}/${id}/archive`);
  },

  async delete(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  async bulkAction(action: BulkAction) {
    return apiClient.post(`${BASE_URL}/bulk`, action);
  },

  async markAllAsRead() {
    return apiClient.post(`${BASE_URL}/mark-all-read`);
  },

  // ============================================
  // STATISTIQUES
  // ============================================

  async getStats(): Promise<NotificationStats> {
    return apiClient.get<NotificationStats>(`${BASE_URL}/stats`);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>(`${BASE_URL}/unread-count`);
  },

  // ============================================
  // PRÉFÉRENCES
  // ============================================

  async getPreferences(): Promise<NotificationPreferences> {
    return apiClient.get<NotificationPreferences>(`${BASE_URL}/preferences`);
  },

  async updatePreferences(data: Partial<NotificationPreferences>) {
    return apiClient.put<NotificationPreferences>(`${BASE_URL}/preferences`, data);
  },

  // ============================================
  // IA - PRÉDICTIONS
  // ============================================

  async getAIPredictions() {
    return apiClient.get(`${BASE_URL}/ai/predictions`);
  },

  async optimizeDigest() {
    return apiClient.post(`${BASE_URL}/ai/optimize-digest`);
  },
};

export default notificationsApi;