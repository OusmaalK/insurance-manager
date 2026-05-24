// src/hooks/useIANotifications.ts
// Hook pour les notifications IA
// <90 lignes

'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/modules/api/client/client';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  link?: string;
  metadata?: Record<string, any>;
}

interface NotificationPreferences {
  email: {
    onLogin: boolean;
    onClaimCreated: boolean;
    onPolicyExpiring: boolean;
    onReportReady: boolean;
  };
  push: {
    onFraudDetected: boolean;
    onRiskAlert: boolean;
    onRenewalReminder: boolean;
  };
}

export const useIANotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (limit?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = limit ? `/notifications?limit=${limit}` : '/notifications';
      const response = await apiClient.get(url);
      const data = (response as any).data || response;
      const notifs = Array.isArray(data) ? data : [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
      return notifs;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      await apiClient.post(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to mark as read');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to mark all as read');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteNotification = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/notifications/${id}`);
      const removed = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (removed && !removed.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete notification');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [notifications]);

  const fetchPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/notifications/preferences');
      const data = (response as any).data || response;
      setPreferences(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch preferences');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (prefs: Partial<NotificationPreferences>) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put('/notifications/preferences', prefs);
      setPreferences(prev => prev ? { ...prev, ...prefs } : null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchPreferences,
    updatePreferences,
  };
};

export default useIANotifications;