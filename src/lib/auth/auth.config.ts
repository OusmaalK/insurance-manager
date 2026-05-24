// src/lib/auth/auth.config.ts
// Configuration de l'authentification
// <60 lignes

export const authConfig = {
    // Clés de stockage
    storage: {
      tokenKey: 'access_token',
      refreshTokenKey: 'refresh_token',
      userKey: 'user',
    },
  
    // Durées (en minutes)
    durations: {
      tokenExpiry: 60,
      sessionTimeout: 30,
      refreshThreshold: 5,
    },
  
    // URLs
    urls: {
      login: '/login',
      logout: '/logout',
      register: '/register',
      forgotPassword: '/forgot-password',
      resetPassword: '/reset-password',
      dashboard: '/dashboard',
      adminDashboard: '/admin/dashboard',
      brokerDashboard: '/broker/dashboard',
    },
  
    // Routes publiques (sans authentification)
    publicRoutes: [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/health',
      '/api/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
    ],
  
    // Routes admin
    adminRoutes: [
      '/admin',
      '/admin/dashboard',
      '/admin/companies',
      '/admin/policies',
      '/admin/claims',
      '/admin/users',
      '/admin/reports',
      '/admin/ia-settings',
      '/admin/audit-logs',
      '/admin/settings',
    ],
  
    // Routes broker
    brokerRoutes: [
      '/broker',
      '/broker/dashboard',
      '/broker/clients',
      '/broker/policies',
      '/broker/claims',
      '/broker/calendar',
      '/broker/commissions',
      '/broker/reports',
      '/broker/ai-assistant',
      '/broker/documents',
    ],
  
    // Configuration JWT
    jwt: {
      algorithm: 'HS256' as const,
      issuer: 'insurance-broker-platform',
      audience: 'insurance-broker-client',
    },
  };
  
  export default authConfig;