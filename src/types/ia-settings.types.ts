// src/types/ia-settings.types.ts
// Types pour la configuration IA
// <180 lignes

// ============================================
// CONFIGURATION PRINCIPALE
// ============================================

export interface IASettings {
  id: number;
  fraudDetection: FraudDetectionConfig;
  autoApproval: AutoApprovalConfig;
  notifications: NotificationConfig;
  privacy: PrivacyConfig;
  models: ModelConfig;
  thresholds: ThresholdConfig;
  updatedAt: string;
  updatedBy: string;
}

// ============================================
// DÉTECTION FRAUDE
// ============================================

export interface FraudDetectionConfig {
  enabled: boolean;
  sensitivityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  autoAlert: boolean;
  alertThreshold: number; // 0-100
  analysisDelay: number; // minutes
  suspiciousFactors: string[];
  notificationEmails: string[];
}

// ============================================
// AUTO-APPROBATION
// ============================================

export interface AutoApprovalConfig {
  enabled: boolean;
  maxAmount: number;
  minConfidenceScore: number; // 0-100
  excludedClaimTypes: string[];
  requireSecondReview: boolean;
  secondReviewThreshold: number;
}

// ============================================
// NOTIFICATIONS
// ============================================

export interface NotificationConfig {
  emailEnabled: boolean;
  pushEnabled: boolean;
  fraudAlertEmail: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
  recipients: string[];
  webhookUrl?: string;
}

// ============================================
// CONFIDENTIALITÉ
// ============================================

export interface PrivacyConfig {
  dataRetentionDays: number;
  anonymizeData: boolean;
  allowDataSharing: boolean;
  auditLogs: boolean;
  userConsentRequired: boolean;
}

// ============================================
// MODÈLE IA
// ============================================

export interface ModelConfig {
  provider: 'GEMINI' | 'OPENAI' | 'CUSTOM';
  modelVersion: string;
  temperature: number; // 0-1
  maxTokens: number;
  cacheEnabled: boolean;
  cacheTTL: number; // seconds
  fallbackEnabled: boolean;
}

// ============================================
// SEUILS
// ============================================

export interface ThresholdConfig {
  riskLow: number;    // 0-100
  riskMedium: number; // 0-100
  riskHigh: number;   // 0-100
  fraudLow: number;
  fraudMedium: number;
  fraudHigh: number;
  renewalLow: number;
  renewalMedium: number;
  renewalHigh: number;
}

// ============================================
// STATISTIQUES
// ============================================

export interface IASettingsStats {
  totalApiCalls: number;
  averageLatency: number;
  fraudDetectionRate: number;
  autoApprovalRate: number;
  monthlyCost: number;
  modelAccuracy: number;
}

// ============================================
// CONSTANTES & UTILITAIRES
// ============================================

export const SENSITIVITY_LEVELS = {
  LOW: { label: 'Faible', color: 'bg-green-100 text-green-700', value: 30 },
  MEDIUM: { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-700', value: 50 },
  HIGH: { label: 'Haute', color: 'bg-orange-100 text-orange-700', value: 70 },
  CRITICAL: { label: 'Critique', color: 'bg-red-100 text-red-700', value: 90 },
} as const;

export const MODEL_PROVIDERS = {
  GEMINI: { label: 'Google Gemini', color: 'bg-blue-100 text-blue-700' },
  OPENAI: { label: 'OpenAI', color: 'bg-green-100 text-green-700' },
  CUSTOM: { label: 'Personnalisé', color: 'bg-purple-100 text-purple-700' },
} as const;

export const DEFAULT_SETTINGS: IASettings = {
  id: 1,
  fraudDetection: {
    enabled: true,
    sensitivityLevel: 'MEDIUM',
    autoAlert: true,
    alertThreshold: 70,
    analysisDelay: 5,
    suspiciousFactors: ['montant_anormal', 'frequence_elevee', 'documents_manquants'],
    notificationEmails: ['admin@courtier.fr'],
  },
  autoApproval: {
    enabled: true,
    maxAmount: 5000,
    minConfidenceScore: 85,
    excludedClaimTypes: ['CATASTROPHE', 'FRAUDE'],
    requireSecondReview: true,
    secondReviewThreshold: 10000,
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: true,
    fraudAlertEmail: true,
    dailyDigest: true,
    weeklyReport: true,
    recipients: ['admin@courtier.fr'],
  },
  privacy: {
    dataRetentionDays: 365,
    anonymizeData: true,
    allowDataSharing: false,
    auditLogs: true,
    userConsentRequired: true,
  },
  models: {
    provider: 'GEMINI',
    modelVersion: 'gemini-2.0-flash-exp',
    temperature: 0.7,
    maxTokens: 2048,
    cacheEnabled: true,
    cacheTTL: 3600,
    fallbackEnabled: true,
  },
  thresholds: {
    riskLow: 30,
    riskMedium: 70,
    riskHigh: 90,
    fraudLow: 30,
    fraudMedium: 70,
    fraudHigh: 90,
    renewalLow: 40,
    renewalMedium: 70,
    renewalHigh: 90,
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'admin',
};

export const getSensitivityLabel = (level: string): string => {
  return SENSITIVITY_LEVELS[level as keyof typeof SENSITIVITY_LEVELS]?.label || level;
};

export const getSensitivityColor = (level: string): string => {
  return SENSITIVITY_LEVELS[level as keyof typeof SENSITIVITY_LEVELS]?.color || 'bg-gray-100 text-gray-700';
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('fr-FR');
};