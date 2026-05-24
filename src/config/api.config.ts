// src/config/app.config.ts
// Configuration application
// <100 lignes

// ============================================
// APPLICATION CONFIGURATION
// ============================================

export const appConfig = {
    // Informations générales
    name: 'Insurance Broker Platform',
    version: '3.0.0',
    environment: process.env.NODE_ENV || 'development',
    
    // API Configuration
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
    },
    
    // Authentification
    auth: {
      tokenKey: 'access_token',
      refreshTokenKey: 'refresh_token',
      tokenExpiryMinutes: 60,
      sessionTimeoutMinutes: 30,
    },
    
    // Pagination
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [10, 25, 50, 100],
      maxPageSize: 100,
    },
    
    // Dates
    dateFormat: {
      default: 'DD/MM/YYYY',
      full: 'DD/MM/YYYY HH:mm:ss',
      api: 'YYYY-MM-DD',
      short: 'DD/MM/YY',
    },
    
    // Monnaie
    currency: {
      locale: 'fr-FR',
      symbol: '€',
      code: 'EUR',
      decimalPlaces: 2,
    },
    
    // Notifications
    notifications: {
      duration: 5000,
      position: 'top-right',
      maxStack: 5,
    },
    
    // Cache
    cache: {
      ttl: 5 * 60 * 1000, // 5 minutes
      maxSize: 100,
    },
    
    // Logging
    logging: {
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      enableConsole: true,
    },
    
    // Features
    features: {
      enableIA: true,
      enableVoiceAssistant: true,
      enableReports: true,
      enableAuditLogs: true,
    },
    
    // Upload
    upload: {
      maxSize: 10 * 1024 * 1024, // 10 MB
      allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
      maxFiles: 5,
    },
    
    // Refresh intervals (ms)
    refreshIntervals: {
      dashboard: 30000,      // 30 secondes
      notifications: 60000,  // 1 minute
      iaAlerts: 30000,       // 30 secondes
    },
  };
  
  // ============================================
  // RÔLES ET PERMISSIONS
  // ============================================
  
  export const roles = {
    ADMIN: 'ADMIN',
    BROKER: 'BROKER',
    USER: 'USER',
  };
  
  export const permissions = {
    [roles.ADMIN]: [
      'view_all_companies',
      'view_all_policies',
      'view_all_claims',
      'manage_users',
      'manage_settings',
      'view_audit_logs',
      'manage_ia_settings',
      'generate_reports',
      'view_analytics',
    ],
    [roles.BROKER]: [
      'view_own_companies',
      'view_own_policies',
      'view_own_claims',
      'create_claims',
      'update_profile',
      'view_commissions',
      'generate_client_reports',
      'use_ia_assistant',
    ],
    [roles.USER]: [
      'view_profile',
      'update_profile',
    ],
  };
  
  // ============================================
  // SEUILS IA
  // ============================================
  
  export const iaThresholds = {
    fraud: {
      critical: 80,
      high: 60,
      medium: 40,
      low: 20,
    },
    risk: {
      critical: 75,
      high: 55,
      medium: 35,
      low: 15,
    },
    confidence: {
      high: 80,
      medium: 60,
      low: 40,
    },
  };
  
  // ============================================
  // COULEURS
  // ============================================
  
  export const colors = {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#06B6D4',
    dark: '#1F2937',
    light: '#F3F4F6',
  };
  
  // ============================================
  // HELPERS
  // ============================================
  
  export const isProduction = () => appConfig.environment === 'production';
  export const isDevelopment = () => appConfig.environment === 'development';
  export const getApiUrl = () => appConfig.api.baseUrl;
  
  export default appConfig;