// src/types/notification.types.ts
// Types pour le module Notifications
// <180 lignes

// ============================================
// NOTIFICATION - Types principaux
// ============================================

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ALERT';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status: 'UNREAD' | 'READ' | 'ARCHIVED';
    category: 'SYSTEM' | 'IA' | 'USER' | 'CLAIM' | 'POLICY' | 'COMPANY';
    metadata?: NotificationMetadata;
    createdAt: string;
    readAt?: string;
    userId: number;
    userName?: string;
    actionUrl?: string;
    actionLabel?: string;
  }
  
  export interface NotificationMetadata {
    entityId?: number;
    entityType?: string;
    aiConfidence?: number;
    relatedNotificationId?: number;
    expiresAt?: string;
  }
  
  // ============================================
  // PRÉFÉRENCES
  // ============================================
  
  export interface NotificationPreferences {
    id: number;
    userId: number;
    emailEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    categories: {
      SYSTEM: boolean;
      IA: boolean;
      USER: boolean;
      CLAIM: boolean;
      POLICY: boolean;
      COMPANY: boolean;
    };
    priorities: {
      LOW: boolean;
      MEDIUM: boolean;
      HIGH: boolean;
      URGENT: boolean;
    };
    digestFrequency: 'REALTIME' | 'HOURLY' | 'DAILY' | 'WEEKLY';
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  }
  
  // ============================================
  // STATISTIQUES IA
  // ============================================
  
  export interface NotificationStats {
    total: number;
    unread: number;
    read: number;
    archived: number;
    byType: {
      type: string;
      count: number;
    }[];
    byPriority: {
      priority: string;
      count: number;
    }[];
    recentActivity: number;
    averageResponseTime: number;
    aiPredictions: {
      expectedAlerts: number;
      optimalDigestTime: string;
      userEngagementScore: number;
    };
  }
  
  // ============================================
  // FILTRES & PAGINATION
  // ============================================
  
  export interface NotificationFilters {
    type?: Notification['type'];
    priority?: Notification['priority'];
    status?: Notification['status'];
    category?: Notification['category'];
    startDate?: string;
    endDate?: string;
    search?: string;
    unreadOnly?: boolean;
  }
  
  // ============================================
  // ACTIONS
  // ============================================
  
  export interface BulkAction {
    action: 'MARK_READ' | 'MARK_UNREAD' | 'ARCHIVE' | 'DELETE';
    notificationIds: number[];
  }
  
  // ============================================
  // CONSTANTES & UTILITAIRES
  // ============================================
  
  export const NOTIFICATION_TYPES = {
    INFO: { label: 'Information', color: 'bg-blue-100 text-blue-700', icon: 'ℹ️' },
    SUCCESS: { label: 'Succès', color: 'bg-green-100 text-green-700', icon: '✅' },
    WARNING: { label: 'Attention', color: 'bg-yellow-100 text-yellow-700', icon: '⚠️' },
    ERROR: { label: 'Erreur', color: 'bg-red-100 text-red-700', icon: '❌' },
    ALERT: { label: 'Alerte', color: 'bg-purple-100 text-purple-700', icon: '🔔' },
  } as const;
  
  export const NOTIFICATION_PRIORITIES = {
    LOW: { label: 'Basse', color: 'bg-gray-100 text-gray-700', order: 1 },
    MEDIUM: { label: 'Moyenne', color: 'bg-blue-100 text-blue-700', order: 2 },
    HIGH: { label: 'Haute', color: 'bg-orange-100 text-orange-700', order: 3 },
    URGENT: { label: 'Urgente', color: 'bg-red-100 text-red-700', order: 4 },
  } as const;
  
  export const NOTIFICATION_CATEGORIES = {
    SYSTEM: { label: 'Système', color: 'bg-gray-100 text-gray-700' },
    IA: { label: 'IA', color: 'bg-purple-100 text-purple-700' },
    USER: { label: 'Utilisateur', color: 'bg-blue-100 text-blue-700' },
    CLAIM: { label: 'Sinistre', color: 'bg-red-100 text-red-700' },
    POLICY: { label: 'Contrat', color: 'bg-green-100 text-green-700' },
    COMPANY: { label: 'Entreprise', color: 'bg-amber-100 text-amber-700' },
  } as const;
  
  export const getTypeLabel = (type: string): string => {
    return NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES]?.label || type;
  };
  
  export const getTypeColor = (type: string): string => {
    return NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES]?.color || 'bg-gray-100 text-gray-700';
  };
  
  export const getPriorityLabel = (priority: string): string => {
    return NOTIFICATION_PRIORITIES[priority as keyof typeof NOTIFICATION_PRIORITIES]?.label || priority;
  };
  
  export const getPriorityColor = (priority: string): string => {
    return NOTIFICATION_PRIORITIES[priority as keyof typeof NOTIFICATION_PRIORITIES]?.color || 'bg-gray-100 text-gray-700';
  };
  
  export const getCategoryLabel = (category: string): string => {
    return NOTIFICATION_CATEGORIES[category as keyof typeof NOTIFICATION_CATEGORIES]?.label || category;
  };
  
  export const getCategoryColor = (category: string): string => {
    return NOTIFICATION_CATEGORIES[category as keyof typeof NOTIFICATION_CATEGORIES]?.color || 'bg-gray-100 text-gray-700';
  };
  
  export const formatTimeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `à l'instant`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `il y a ${days} j`;
    return new Date(date).toLocaleDateString('fr-FR');
  };
  
  export const formatDateTime = (date: string): string => {
    return new Date(date).toLocaleString('fr-FR');
  };