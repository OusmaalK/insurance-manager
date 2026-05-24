// src/types/settings.types.ts
// Types pour le module Settings
// <180 lignes

// ============================================
// SETTINGS - Types principaux
// ============================================

export interface GeneralSettings {
    companyName: string;
    companyLogo?: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    timezone: string;
    dateFormat: string;
    language: string;
    theme: 'light' | 'dark' | 'system';
  }
  
  export interface SecuritySettings {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordExpiryDays: number;
    allowedIPs: string[];
    loginNotifications: boolean;
    maxLoginAttempts: number;
    ipWhitelistEnabled: boolean;
  }
  
  export interface BillingSettings {
    plan: 'FREE' | 'PRO' | 'ENTERPRISE';
    billingEmail: string;
    vatNumber: string;
    invoicePrefix: string;
    autoRenew: boolean;
    paymentMethod: 'CARD' | 'BANK_TRANSFER' | 'PAYPAL';
    nextInvoiceDate: string;
  }
  
  export interface ApiSettings {
    apiKeys: ApiKey[];
    webhookUrl: string;
    webhookEvents: string[];
    rateLimit: number;
    allowedOrigins: string[];
  }
  
  export interface ApiKey {
    id: number;
    name: string;
    key: string;
    createdAt: string;
    lastUsed: string;
    expiresAt?: string;
    permissions: string[];
  }
  
  // ============================================
  // STATISTIQUES
  // ============================================
  
  export interface SettingsStats {
    lastBackup: string;
    apiCalls: number;
    activeSessions: number;
    pendingInvoices: number;
    systemHealth: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  }
  
  // ============================================
  // UTILITAIRES
  // ============================================
  
  export const TIMEZONES = [
    'Europe/Paris',
    'Europe/London',
    'Europe/Berlin',
    'America/New_York',
    'Asia/Tokyo',
  ] as const;
  
  export const DATE_FORMATS = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD',
  ] as const;
  
  export const LANGUAGES = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
  ] as const;
  
  export const PLANS = {
    FREE: { label: 'Gratuit', price: 0, features: ['5 utilisateurs', '100 notifications/mois'] },
    PRO: { label: 'Professionnel', price: 49, features: ['Utilisateurs illimités', '1000 notifications/mois', 'Support prioritaire'] },
    ENTERPRISE: { label: 'Entreprise', price: 199, features: ['Tout illimité', 'Support dédié', 'SLA personnalisé'] },
  } as const;
  
  export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('fr-FR');
  };