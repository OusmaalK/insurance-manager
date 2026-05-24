// src/modules/ia-core/types/ia-paliers.types.ts
// Types pour les paliers IA
// <60 lignes

// ============================================
// PALIERS
// ============================================

export type IATier = 'STANDARD' | 'IA';

export interface IAPricingPlan {
  id: string;
  name: string;
  tier: IATier;
  price: number;
  creditsPerMonth: number;
  features: IAFeature[];
  limits: IALimits;
}

export interface IAFeature {
  id: string;
  name: string;
  description: string;
  availableInStandard: boolean;
  availableInIA: boolean;
}

export interface IALimits {
  maxApiCallsPerMonth: number;
  maxConcurrentRequests: number;
  maxFileSizeMB: number;
  dataRetentionDays: number;
}

// ============================================
// FEATURES
// ============================================

export const IA_FEATURES: IAFeature[] = [
  { id: 'fraud_detection', name: 'Détection de fraude', description: 'Analyse automatique des sinistres suspects', availableInStandard: false, availableInIA: true },
  { id: 'risk_scoring', name: 'Scoring de risque', description: 'Évaluation du risque client', availableInStandard: true, availableInIA: true },
  { id: 'renewal_prediction', name: 'Prédiction renouvellement', description: 'Anticipation des résiliations', availableInStandard: true, availableInIA: true },
  { id: 'voice_assistant', name: 'Assistant vocal', description: 'Interaction vocale avec l\'IA', availableInStandard: false, availableInIA: true },
  { id: 'advanced_reports', name: 'Rapports avancés', description: 'Rapports narratifs IA', availableInStandard: false, availableInIA: true },
  { id: 'batch_analysis', name: 'Analyse par lots', description: 'Traitement groupé de données', availableInStandard: false, availableInIA: true },
];

// ============================================
// PLANS
// ============================================

export const IA_PRICING_PLANS: IAPricingPlan[] = [
  {
    id: 'standard_free',
    name: 'Standard',
    tier: 'STANDARD',
    price: 0,
    creditsPerMonth: 10,
    features: IA_FEATURES.filter(f => f.availableInStandard),
    limits: { maxApiCallsPerMonth: 10, maxConcurrentRequests: 1, maxFileSizeMB: 5, dataRetentionDays: 30 },
  },
  {
    id: 'ia_pro',
    name: 'IA Pro',
    tier: 'IA',
    price: 49,
    creditsPerMonth: 500,
    features: IA_FEATURES,
    limits: { maxApiCallsPerMonth: 500, maxConcurrentRequests: 5, maxFileSizeMB: 50, dataRetentionDays: 90 },
  },
  {
    id: 'ia_enterprise',
    name: 'IA Enterprise',
    tier: 'IA',
    price: 199,
    creditsPerMonth: 5000,
    features: IA_FEATURES,
    limits: { maxApiCallsPerMonth: 5000, maxConcurrentRequests: 20, maxFileSizeMB: 200, dataRetentionDays: 365 },
  },
];

// ============================================
// HELPER
// ============================================

export const getPlanByTier = (tier: IATier): IAPricingPlan | undefined => {
  return IA_PRICING_PLANS.find(p => p.tier === tier);
};

export const isFeatureAvailable = (featureId: string, tier: IATier): boolean => {
  const feature = IA_FEATURES.find(f => f.id === featureId);
  if (!feature) return false;
  return tier === 'IA' ? feature.availableInIA : feature.availableInStandard;
};