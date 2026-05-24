// src/types/claim.types.ts
// Types pour le module Claims (Sinistres)
// <150 lignes

// ============================================
// CLAIM - Types principaux
// ============================================

export interface Claim {
  id: number;
  policy_id: number;
  policy_name?: string;
  company_id: number;
  company_name?: string;
  claim_number: string;
  title: string;
  description: string;
  incident_date: string;
  declaration_date: string;
  estimated_amount: number;
  approved_amount: number;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID';
  fraud_score: number; // 0-100, calculé par IA
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  documents: ClaimDocument[];
  created_at: string;
  updated_at: string;
}

export interface ClaimDocument {
  id: number;
  name: string;
  type: string;
  url: string;
  uploaded_at: string;
}

// ============================================
// FORMULAIRE
// ============================================

export interface ClaimFormData {
  policy_id: number;
  title: string;
  description: string;
  incident_date: string;
  estimated_amount: number;
}

// ============================================
// ANALYSE FRAUDE IA
// ============================================

export interface FraudAnalysis {
  claim_id: number;
  fraud_score: number;
  fraud_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suspicious_factors: SuspiciousFactor[];
  recommended_action: string;
  analyzed_at: string;
}

export interface SuspiciousFactor {
  name: string;
  impact: number;
  description: string;
}

// ============================================
// PRÉDICTIONS IA
// ============================================

export interface ClaimPredictions {
  claim_id: number;
  predicted_amount: number;
  confidence_score: number;
  estimated_processing_days: number;
  approval_probability: number;
  risk_factors: string[];
  fraud_indicators: string[];
}

// ============================================
// STATISTIQUES
// ============================================

export interface ClaimStats {
  total: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  paidCount: number;
  totalAmount: number;
  avgFraudScore: number;
  fraudAlerts: number;
  monthlyEvolution: {
    month: string;
    count: number;
    amount: number;
  }[];
}

// ============================================
// FILTRES & PAGINATION
// ============================================

export interface ClaimFilters {
  status?: Claim['status'];
  policy_id?: number;
  company_id?: number;
  minAmount?: number;
  maxAmount?: number;
  minFraudScore?: number;
  maxFraudScore?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// ============================================
// CONSTANTES & UTILITAIRES
// ============================================

export const CLAIM_STATUS = {
  PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  IN_REVIEW: { label: 'En cours', color: 'bg-blue-100 text-blue-700' },
  APPROVED: { label: 'Approuvé', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejeté', color: 'bg-red-100 text-red-700' },
  PAID: { label: 'Indemnisé', color: 'bg-purple-100 text-purple-700' },
} as const;

export const FRAUD_LEVELS = {
  LOW: { label: 'Faible', color: 'bg-green-100 text-green-700' },
  MEDIUM: { label: 'Modéré', color: 'bg-yellow-100 text-yellow-700' },
  HIGH: { label: 'Élevé', color: 'bg-orange-100 text-orange-700' },
  CRITICAL: { label: 'Critique', color: 'bg-red-100 text-red-700' },
} as const;

export const getFraudColor = (score: number): string => {
  if (score >= 80) return 'bg-red-100 text-red-700';
  if (score >= 60) return 'bg-orange-100 text-orange-700';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
};

export const getFraudLabel = (score: number): string => {
  if (score >= 80) return 'Critique';
  if (score >= 60) return 'Élevé';
  if (score >= 40) return 'Modéré';
  return 'Faible';
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR');
};