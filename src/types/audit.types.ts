// src/types/audit.types.ts
// Types pour le module Audit
// <180 lignes

// ============================================
// AUDIT LOG - Types principaux
// ============================================

export interface AuditLog {
    id: number;
    action: string;
    entityType: 'COMPANY' | 'POLICY' | 'CLAIM' | 'USER' | 'REPORT' | 'SETTINGS';
    entityId: number;
    entityName?: string;
    module: 'COMPANIES' | 'POLICIES' | 'CLAIMS' | 'USERS' | 'REPORTS' | 'CALENDAR' | 'IA';
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    status: 'SUCCESS' | 'FAILURE' | 'PENDING';
    details: string;
    metadata: AuditMetadata;
    userId: number;
    userName: string;
    userRole: string;
    ipAddress: string;
    userAgent: string;
    duration: number;
    timestamp: string;
  }
  
  export interface AuditMetadata {
    request?: any;
    response?: any;
    error?: string;
    changes?: Record<string, any>;
    aiConfidence?: number;
    aiModel?: string;
    cost?: number;
    tokens?: number;
  }
  
  // ============================================
  // LOGS IA
  // ============================================
  
  export interface IALog {
    id: number;
    module: string;
    endpoint: string;
    prompt: string;
    response: string;
    tokens: number;
    cost: number;
    duration: number;
    success: boolean;
    error?: string;
    userId: number;
    userName: string;
    timestamp: string;
  }
  
  // ============================================
  // STATISTIQUES
  // ============================================
  
  export interface AuditStats {
    totalLogs: number;
    totalIALogs: number;
    errorsCount: number;
    warningsCount: number;
    criticalCount: number;
    averageDuration: number;
    totalCost: number;
    logsByModule: {
      module: string;
      count: number;
      errors: number;
    }[];
    logsByHour: {
      hour: number;
      count: number;
    }[];
    topUsers: {
      userId: number;
      userName: string;
      count: number;
    }[];
    last24h: number;
  }
  
  // ============================================
  // FILTRES & PAGINATION
  // ============================================
  
  export interface AuditFilters {
    module?: string;
    severity?: AuditLog['severity'];
    status?: AuditLog['status'];
    entityType?: AuditLog['entityType'];
    userId?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
    minDuration?: number;
    maxDuration?: number;
    hasError?: boolean;
  }
  
  // ============================================
  // CONSTANTES & UTILITAIRES
  // ============================================
  
  export const AUDIT_MODULES = {
    COMPANIES: { label: 'Entreprises', color: 'bg-blue-100 text-blue-700', icon: '🏢' },
    POLICIES: { label: 'Contrats', color: 'bg-green-100 text-green-700', icon: '📄' },
    CLAIMS: { label: 'Sinistres', color: 'bg-red-100 text-red-700', icon: '⚠️' },
    USERS: { label: 'Utilisateurs', color: 'bg-purple-100 text-purple-700', icon: '👤' },
    REPORTS: { label: 'Rapports', color: 'bg-amber-100 text-amber-700', icon: '📊' },
    CALENDAR: { label: 'Calendrier', color: 'bg-indigo-100 text-indigo-700', icon: '📅' },
    IA: { label: 'IA Transversale', color: 'bg-pink-100 text-pink-700', icon: '🧠' },
  } as const;
  
  export const AUDIT_SEVERITY = {
    INFO: { label: 'Information', color: 'bg-blue-100 text-blue-700', icon: 'ℹ️' },
    WARNING: { label: 'Attention', color: 'bg-yellow-100 text-yellow-700', icon: '⚠️' },
    ERROR: { label: 'Erreur', color: 'bg-red-100 text-red-700', icon: '❌' },
    CRITICAL: { label: 'Critique', color: 'bg-purple-100 text-purple-700', icon: '🔴' },
  } as const;
  
  export const AUDIT_STATUS = {
    SUCCESS: { label: 'Succès', color: 'bg-green-100 text-green-700', icon: '✅' },
    FAILURE: { label: 'Échec', color: 'bg-red-100 text-red-700', icon: '❌' },
    PENDING: { label: 'En cours', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  } as const;
  
  export const getSeverityLabel = (severity: string): string => {
    return AUDIT_SEVERITY[severity as keyof typeof AUDIT_SEVERITY]?.label || severity;
  };
  
  export const getSeverityColor = (severity: string): string => {
    return AUDIT_SEVERITY[severity as keyof typeof AUDIT_SEVERITY]?.color || 'bg-gray-100 text-gray-700';
  };
  
  export const getStatusLabel = (status: string): string => {
    return AUDIT_STATUS[status as keyof typeof AUDIT_STATUS]?.label || status;
  };
  
  export const getStatusColor = (status: string): string => {
    return AUDIT_STATUS[status as keyof typeof AUDIT_STATUS]?.color || 'bg-gray-100 text-gray-700';
  };
  
  export const getModuleLabel = (module: string): string => {
    return AUDIT_MODULES[module as keyof typeof AUDIT_MODULES]?.label || module;
  };
  
  export const getModuleColor = (module: string): string => {
    return AUDIT_MODULES[module as keyof typeof AUDIT_MODULES]?.color || 'bg-gray-100 text-gray-700';
  };
  
  export const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  export const formatDateTime = (date: string): string => {
    return new Date(date).toLocaleString('fr-FR');
  };
  
  export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('fr-FR');
  };
  
  export const formatTimeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `il y a ${seconds} secondes`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  };