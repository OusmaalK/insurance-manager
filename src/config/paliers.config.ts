// src/config/paliers.config.ts
// Configuration des paliers IA (Standard / IA)
// <60 lignes

export const paliersConfig = {
    // Palier Standard (gratuit)
    standard: {
      name: 'Standard',
      description: 'Fonctionnalités de base gratuites',
      limits: {
        maxApiCallsPerMonth: 10,
        maxConcurrentRequests: 1,
        maxFileSizeMB: 5,
        dataRetentionDays: 30,
      },
      features: [
        'risk_scoring',
        'basic_reports',
        'email_support',
      ],
      enabled: true,
    },
    
    // Palier IA (payant)
    ia: {
      name: 'IA Premium',
      description: 'Fonctionnalités avancées avec intelligence artificielle',
      limits: {
        maxApiCallsPerMonth: 1000,
        maxConcurrentRequests: 10,
        maxFileSizeMB: 50,
        dataRetentionDays: 365,
      },
      features: [
        'fraud_detection',
        'advanced_risk_scoring',
        'renewal_prediction',
        'voice_assistant',
        'advanced_reports',
        'batch_analysis',
        'api_access',
        'priority_support',
      ],
      requiresPayment: true,
    },
    
    // Fonctionnalités par palier
    features: {
      risk_scoring: { standard: true, ia: true },
      fraud_detection: { standard: false, ia: true },
      renewal_prediction: { standard: true, ia: true },
      voice_assistant: { standard: false, ia: true },
      advanced_reports: { standard: false, ia: true },
      batch_analysis: { standard: false, ia: true },
      api_access: { standard: false, ia: true },
    },
    
    // Messages d'upgrade
    upgradeMessages: {
      fraud_detection: 'Détectez automatiquement les fraudes avec l\'IA',
      voice_assistant: 'Interagissez vocalement avec votre assistant',
      advanced_reports: 'Générez des rapports narratifs intelligents',
      batch_analysis: 'Analysez vos données en lots',
    },
  };
  
  export default paliersConfig;