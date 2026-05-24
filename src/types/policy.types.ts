// src/types/policy.types.ts
// Types pour le module Policies (Contrats)
// <150 lignes

// ============================================
// POLICY - Types principaux
// ============================================

export interface Policy {
  id: number;
  company_id: number;
  company_name?: string;
  policy_number: string;
  name: string;
  type: 'AUTO' | 'HOME' | 'HEALTH' | 'LIABILITY' | 'PROFESSIONAL' | 'OTHER';
  coverage_amount: number;
  premium_amount: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  renewal_score: number; // 0-100, calculé par IA
  risk_score: number; // 0-100
  clauses: PolicyClause[];
  created_at: string;
  updated_at: string;
}

export interface PolicyClause {
  id: number;
  title: string;
  content: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation?: string;
}

// ============================================
// FORMULAIRE
// ============================================

export interface PolicyFormData {
  company_id: number;
  policy_number: string;
  name: string;
  type: Policy['type'];
  coverage_amount: number;
  premium_amount: number;
  start_date: string;
  end_date: string;
}

// ============================================
// ANALYSE IA
// ============================================

export interface PolicyRiskAnalysis {
  policy_id: number;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: RiskFactor[];
  recommendations: string[];
  analyzed_at: string;
}

export interface RiskFactor {
  name: string;
  impact: number;
  description: string;
}

// ============================================
// PRÉDICTIONS IA
// ============================================

export interface PolicyPredictions {
  policy_id: number;
  renewal_probability: number;      // 0-100
  claim_probability: number;        // 0-100
  optimal_premium: number;          // Prime optimale suggérée
  cross_sell_opportunities: CrossSellOpportunity[];
  risk_trend: 'DECREASING' | 'STABLE' | 'INCREASING';
  next_best_actions: NextBestAction[];
  generated_at: string;
}

export interface CrossSellOpportunity {
  product_type: string;
  reason: string;
  potential_premium: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface NextBestAction {
  action: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  expected_impact: string;
  reason: string;
}

// ============================================
// EXTRACTION CLAUSES IA
// ============================================

export interface ClauseAnalysis {
  original_text: string;
  extracted_clauses: ExtractedClause[];
  risk_summary: string;
  recommendations: string[];
}

export interface ExtractedClause {
  title: string;
  content: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  explanation: string;
}

// ============================================
// STATISTIQUES
// ============================================

export interface PolicyStats {
  total: number;
  activeCount: number;
  expiringCount: number; // Dans les 30 jours
  totalPremium: number;
  avgRenewalScore: number;
  avgRiskScore: number;
  expiringByType: {
    type: string;
    count: number;
    totalPremium: number;
  }[];
  renewalDistribution: {
    high: number;    // >70
    medium: number;  // 30-69
    low: number;     // <30
  };
}

// ============================================
// FILTRES & PAGINATION
// ============================================

export interface PolicyFilters {
  status?: Policy['status'];
  type?: Policy['type'];
  company_id?: number;
  minRiskScore?: number;
  maxRiskScore?: number;
  minRenewalScore?: number;
  maxRenewalScore?: number;
  expiringBefore?: string;
  search?: string;
}

// ============================================
// RÉPONSES API
// ============================================

export interface PoliciesApiResponse {
  data: Policy[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PolicyApiResponse {
  data: Policy;
}

export interface PolicyRiskAnalysisApiResponse {
  data: PolicyRiskAnalysis;
}

export interface PolicyPredictionsApiResponse {
  data: PolicyPredictions;
}

export interface ClauseAnalysisApiResponse {
  data: ClauseAnalysis;
}

// ============================================
// CONSTANTES & UTILITAIRES
// ============================================

export const POLICY_TYPES = {
  AUTO: { label: 'Assurance Auto', color: 'bg-blue-100 text-blue-700' },
  HOME: { label: 'Assurance Habitation', color: 'bg-green-100 text-green-700' },
  HEALTH: { label: 'Assurance Santé', color: 'bg-purple-100 text-purple-700' },
  LIABILITY: { label: 'Responsabilité Civile', color: 'bg-amber-100 text-amber-700' },
  PROFESSIONAL: { label: 'Professionnelle', color: 'bg-indigo-100 text-indigo-700' },
  OTHER: { label: 'Autre', color: 'bg-gray-100 text-gray-700' },
} as const;

export const POLICY_STATUS = {
  ACTIVE: { label: 'Actif', color: 'bg-green-100 text-green-700' },
  EXPIRED: { label: 'Expiré', color: 'bg-gray-100 text-gray-700' },
  CANCELLED: { label: 'Résilié', color: 'bg-red-100 text-red-700' },
  PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
} as const;

export const getRenewalScoreColor = (score: number): string => {
  if (score >= 70) return 'bg-green-100 text-green-700';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

export const getRenewalScoreLabel = (score: number): string => {
  if (score >= 70) return 'Forte probabilité';
  if (score >= 40) return 'Probabilité modérée';
  return 'Faible probabilité';
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR');
};