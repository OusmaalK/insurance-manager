// src/config/telemetry.config.ts
// Configuration de la télémétrie
// <60 lignes

export const telemetryConfig = {
    // Activation
    enabled: true,
    
    // Fréquence d'envoi (ms)
    flushInterval: 60000, // 1 minute
    
    // Seuils d'alerte
    thresholds: {
      maxLatencyMs: 3000,
      maxErrorRate: 10, // pourcentage
      maxCostPerDay: 10, // euros
      maxCostPerMonth: 100,
    },
    
    // Endpoints à surveiller
    monitoredEndpoints: [
      '/claims/ai/analyze-fraud',
      '/claims/ai/analyze-risk',
      '/claims/ai/predict-amount',
      '/companies/ai/analyze-risk',
      '/policies/ai/predict-renewal',
      '/ai/assistant/chat',
      '/reports/ia/generate',
    ],
    
    // Métriques collectées
    metrics: {
      latency: true,
      cost: true,
      successRate: true,
      tokensUsed: true,
      userCalls: true,
    },
    
    // Rétention des données
    retention: {
      days: 90,
      maxEntries: 10000,
    },
    
    // Export
    export: {
      enabled: true,
      format: 'json',
      includeHeaders: true,
    },
    
    // Alertes
    alerts: {
      enabled: true,
      channels: ['email', 'dashboard'],
      cooldownMinutes: 60,
    },
    
    // Stockage
    storage: {
      type: 'localStorage', // ou 'indexedDB'
      key: 'ia_telemetry_data',
    },
  };
  
  export default telemetryConfig;