// src/config/app.config.ts
// Configuration générale de l'application
// <80 lignes

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
      dashboard: 30000,
      notifications: 60000,
      iaAlerts: 30000,
    },
  };
  
  export default appConfig;