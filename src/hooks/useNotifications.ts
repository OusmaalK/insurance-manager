// src/hooks/useNotifications.ts
// Version corrigée avec catégorie valide

'use client';

import { useState, useCallback, useEffect } from 'react';
import { notificationsApi } from '@/modules/api/notifications/notifications.api';
import { Notification, NotificationFilters, NotificationStats } from '@/types/notification.types';
import { PaginationParams } from '@/types/api.types';

// Données mockées pour le développement
const mockNotifications: Notification[] = [
  { id: 1, title: 'Bienvenue sur la plateforme', message: 'Votre compte a été créé avec succès', type: 'SUCCESS', priority: 'MEDIUM', status: 'UNREAD', category: 'SYSTEM', createdAt: new Date().toISOString(), userId: 1, userName: 'Admin' },
  { id: 2, title: 'Nouvelle analyse IA', message: 'L\'IA a détecté une anomalie dans le contrat #123', type: 'ALERT', priority: 'HIGH', status: 'UNREAD', category: 'IA', createdAt: new Date(Date.now() - 3600000).toISOString(), userId: 1, userName: 'Admin', actionUrl: '/admin/policies/123', actionLabel: 'Voir' },
  { id: 3, title: 'Sinistre déclaré', message: 'Un nouveau sinistre a été déclaré pour la société AXA', type: 'INFO', priority: 'MEDIUM', status: 'READ', category: 'CLAIM', createdAt: new Date(Date.now() - 86400000).toISOString(), userId: 1, userName: 'Admin' },
  { id: 4, title: 'Rapport IA disponible', message: 'Le rapport mensuel IA est prêt à être consulté', type: 'SUCCESS', priority: 'LOW', status: 'UNREAD', category: 'IA', createdAt: new Date(Date.now() - 172800000).toISOString(), userId: 1, userName: 'Admin', actionUrl: '/admin/reports/ia', actionLabel: 'Consulter' }, // ✅ 'IA' au lieu de 'REPORTS'
  { id: 5, title: 'Alerte sécurité', message: 'Tentative de connexion suspecte détectée', type: 'WARNING', priority: 'HIGH', status: 'UNREAD', category: 'SYSTEM', createdAt: new Date(Date.now() - 259200000).toISOString(), userId: 1, userName: 'Admin' },
];

const mockStats: NotificationStats = {
  total: 1247,
  unread: 342,
  read: 890,
  archived: 15,
  byType: [
    { type: 'INFO', count: 450 },
    { type: 'ALERT', count: 120 },
    { type: 'SUCCESS', count: 300 },
    { type: 'WARNING', count: 80 },
    { type: 'ERROR', count: 47 },
  ],
  byPriority: [
    { priority: 'HIGH', count: 89 },
    { priority: 'MEDIUM', count: 450 },
    { priority: 'LOW', count: 708 },
    { priority: 'URGENT', count: 0 },
  ],
  recentActivity: 156,
  averageResponseTime: 2.4,
  aiPredictions: {
    expectedAlerts: 15,
    optimalDigestTime: '09:00',
    userEngagementScore: 78,
  },
};

export const useNotifications = (options: { autoFetch?: boolean } = {}) => {
  const { autoFetch = true } = options;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Récupérer toutes les notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
      setTotal(mockNotifications.length);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('fetchNotifications error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer une notification par ID
  const getNotification = useCallback(async (id: number): Promise<Notification | null> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const found = mockNotifications.find(n => n.id === id) || null;
      setNotification(found);
      return found;
    } catch (err) {
      console.error('getNotification error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les statistiques
  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats(mockStats);
    } catch (err) {
      console.error('fetchStats error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer le nombre de notifications non lues
  const getUnreadCount = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const count = mockNotifications.filter(n => n.status === 'UNREAD').length;
      setUnreadCount(count);
      return count;
    } catch (err) {
      console.error('getUnreadCount error:', err);
      return 0;
    }
  }, []);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, status: 'READ', readAt: new Date().toISOString() } : n
      ));
      await getUnreadCount();
    } catch (err) {
      console.error('markAsRead error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getUnreadCount]);

  // Marquer une notification comme non lue
  const markAsUnread = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, status: 'UNREAD', readAt: undefined } : n
      ));
      await getUnreadCount();
    } catch (err) {
      console.error('markAsUnread error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getUnreadCount]);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(prev => prev.map(n => 
        n.status === 'UNREAD' ? { ...n, status: 'READ', readAt: new Date().toISOString() } : n
      ));
      setUnreadCount(0);
    } catch (err) {
      console.error('markAllAsRead error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Archiver une notification
  const archive = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setNotifications(prev => prev.filter(n => n.id !== id));
      await getUnreadCount();
    } catch (err) {
      console.error('archive error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getUnreadCount]);

  // Supprimer une notification
  const deleteNotification = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setNotifications(prev => prev.filter(n => n.id !== id));
      await getUnreadCount();
    } catch (err) {
      console.error('deleteNotification error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getUnreadCount]);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters: Partial<NotificationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  // Auto-fetch au montage
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
      fetchStats();
      getUnreadCount();
    }
  }, [autoFetch, fetchNotifications, fetchStats, getUnreadCount]);

  return {
    notifications,
    notification,
    stats,
    total,
    unreadCount,
    isLoading,
    error,
    filters,
    page,
    limit,
    fetchNotifications,
    getNotification,
    fetchStats,
    getUnreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    archive,
    deleteNotification,
    updateFilters,
    resetFilters,
    setPage,
    setLimit,
  };
};

export default useNotifications;