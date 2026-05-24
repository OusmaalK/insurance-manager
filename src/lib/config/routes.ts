// src/lib/config/routes.ts
// Configuration des routes
// <80 lignes

export const routesConfig = {
    // Routes publiques
    public: [
      '/',
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
  
    // Routes protégées
    protected: {
      admin: [
        '/admin',
        '/admin/dashboard',
        '/admin/companies',
        '/admin/companies/new',
        '/admin/companies/:id',
        '/admin/policies',
        '/admin/policies/new',
        '/admin/policies/:id',
        '/admin/claims',
        '/admin/claims/new',
        '/admin/claims/:id',
        '/admin/users',
        '/admin/users/new',
        '/admin/users/:id',
        '/admin/reports',
        '/admin/reports/:id',
        '/admin/ia-settings',
        '/admin/audit-logs',
        '/admin/settings',
        '/admin/settings/notifications',
        '/admin/settings/webhooks',
      ],
      broker: [
        '/broker',
        '/broker/dashboard',
        '/broker/clients',
        '/broker/clients/new',
        '/broker/clients/:id',
        '/broker/policies',
        '/broker/policies/new',
        '/broker/policies/:id',
        '/broker/claims',
        '/broker/claims/new',
        '/broker/claims/:id',
        '/broker/calendar',
        '/broker/commissions',
        '/broker/reports',
        '/broker/ai-assistant',
        '/broker/documents',
        '/broker/clients-birthday',
      ],
      shared: [
        '/profile',
        '/notifications',
      ],
    },
  
    // Redirections par défaut
    redirects: {
      afterLogin: {
        ADMIN: '/admin/dashboard',
        BROKER: '/broker/dashboard',
        USER: '/dashboard',
      },
      afterLogout: '/login',
      unauthorized: '/unauthorized',
      notFound: '/404',
    },
  
    // Routes API
    api: {
      base: '/api',
      auth: '/api/auth',
      companies: '/api/companies',
      policies: '/api/policies',
      claims: '/api/claims',
      users: '/api/users',
      reports: '/api/reports',
      settings: '/api/settings',
      dashboard: '/api/dashboard',
      calendar: '/api/calendar',
      insights: '/api/insights',
      webhooks: '/api/webhooks',
    },
  };
  
  export default routesConfig;