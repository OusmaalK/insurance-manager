// src/config/monetization.config.ts
// Configuration de la monétisation IA
// <70 lignes

export const monetizationConfig = {
    // Crédits gratuits
    freeTier: {
      creditsPerMonth: 10,
      features: ['risk_scoring', 'basic_predictions'],
    },
    
    // Plans payants
    plans: [
      {
        id: 'pro',
        name: 'IA Pro',
        price: 49,
        credits: 500,
        features: [
          'fraud_detection',
          'risk_scoring',
          'renewal_prediction',
          'voice_assistant',
          'advanced_reports',
          'api_access',
        ],
        popular: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 199,
        credits: 5000,
        features: [
          'fraud_detection',
          'risk_scoring',
          'renewal_prediction',
          'voice_assistant',
          'advanced_reports',
          'api_access',
          'dedicated_support',
          'sla_guarantee',
        ],
      },
    ],
    
    // Packs de crédits
    creditPacks: [
      { credits: 50, price: 9.90, bonus: 0 },
      { credits: 100, price: 18.90, bonus: 10, popular: true },
      { credits: 250, price: 44.90, bonus: 30 },
      { credits: 500, price: 84.90, bonus: 75 },
      { credits: 1000, price: 159.90, bonus: 200 },
    ],
    
    // Seuils d'alerte
    thresholds: {
      lowCredits: 20, // pourcentage
      criticalCredits: 5,
    },
    
    // Période de facturation
    billing: {
      currency: 'EUR',
      interval: 'monthly',
      trialDays: 14,
      invoicePrefix: 'INV',
    },
    
    // Intégration Stripe
    stripe: {
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
  };
  
  export default monetizationConfig;