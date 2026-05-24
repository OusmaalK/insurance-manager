// src/types/company.types.ts
// Types pour le module Companies (basé sur table SQL backend)
// <180 lignes

// ============================================
// COMPANY - Types principaux
// ============================================

export interface Company {
  id: number;
  name: string;
  siret: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  activity_sector: string | null;
  employee_count: number | null;
  annual_revenue: number | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  risk_score: number; // 0-100, calculé par IA backend
  fraud_score?: number; // Score de fraude (0-100)
  loyalty_score?: number; // Score de fidélité (0-100)
  created_at: string;
  updated_at: string;
}

// ============================================
// FORMULAIRE
// ============================================

export interface CompanyFormData {
  name: string;
  siret: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  activity_sector?: string;
  employee_count?: number;
  annual_revenue?: number;
}

// ============================================
// ANALYSE RISQUE IA
// ============================================

export interface CompanyRiskAnalysis {
  company_id: number;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: RiskFactor[];
  recommendations: string[];
  analyzed_at: string;
}

export interface RiskFactor {
  name: string;
  impact: number; // 0-100
  description: string;
}

// ============================================
// PRÉDICTIONS IA
// ============================================

export interface CompanyPredictions {
  company_id: number;
  renewal_probability: number;      // 0-100 - Probabilité de renouvellement
  claim_probability: number;        // 0-100 - Probabilité de sinistre
  cross_sell_potential: number;     // 0-100 - Potentiel de vente croisée
  growth_potential: number;         // 0-100 - Potentiel de croissance
  predicted_churn_risk: 'LOW' | 'MEDIUM' | 'HIGH'; // Risque de résiliation
  next_best_actions: NextBestAction[]; // Actions recommandées
  generated_at: string;
}

export interface NextBestAction {
  action: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  expected_impact: string;
  reason: string;
}

// ============================================
// PRÉDICTIONS SPÉCIFIQUES
// ============================================

export interface ClaimPrediction {
  claim_probability: number;
  risk_factors: string[];
  estimated_amount?: number;
  confidence_score: number;
}

export interface CrossSellRecommendation {
  product: string;
  reason: string;
  potential: number; // 0-100
  expected_revenue?: number;
}

export interface CrossSellResponse {
  recommendations: CrossSellRecommendation[];
}

// ============================================
// STATISTIQUES
// ============================================

export interface CompanyStats {
  total: number;
  avgRiskScore: number;
  fraudAlerts: number;
  aiAnalysisCount: number;
  activeCompanies: number;
  inactiveCompanies: number;
  suspendedCompanies: number;
  riskDistribution: {
    low: number;    // 0-30
    medium: number; // 31-69
    high: number;   // 70-89
    critical: number; // 90-100
  };
  topSectors: {
    sector: string;
    count: number;
    avgRisk: number;
  }[];
  recentAnalyses: number; // Nombre d'analyses dans les 7 derniers jours
  lastUpdated: string;
}

// ============================================
// FILTRES & PAGINATION
// ============================================

export interface CompanyFilters {
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  minRiskScore?: number;
  maxRiskScore?: number;
  activitySector?: string;
  search?: string;
}

// ============================================
// RÉPONSES API
// ============================================

export interface CompaniesApiResponse {
  data: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CompanyApiResponse {
  data: Company;
}

export interface RiskAnalysisApiResponse {
  data: CompanyRiskAnalysis;
}

export interface PredictionsApiResponse {
  data: CompanyPredictions;
}

export interface StatsApiResponse {
  data: CompanyStats;
}

export interface ClaimPredictionApiResponse {
  data: ClaimPrediction;
}

export interface CrossSellApiResponse {
  data: CrossSellResponse;
}

// ============================================
// TYPES POUR LE STORE ZUSTAND
// ============================================

export interface CompanyFiltersStore {
  filters: CompanyFilters;
  setFilters: (filters: Partial<CompanyFilters>) => void;
  resetFilters: () => void;
}

export interface CompanyFormStore {
  isOpen: boolean;
  initialData: CompanyFormData | null;
  openForm: (data?: CompanyFormData) => void;
  closeForm: () => void;
  submitForm: (data: CompanyFormData) => Promise<void>;
}

// ============================================
// CONSTANTES & UTILITAIRES
// ============================================

export const RISK_LEVELS = {
  LOW: { min: 0, max: 30, label: 'Faible', color: 'bg-green-100 text-green-700' },
  MEDIUM: { min: 31, max: 69, label: 'Modéré', color: 'bg-yellow-100 text-yellow-700' },
  HIGH: { min: 70, max: 89, label: 'Élevé', color: 'bg-orange-100 text-orange-700' },
  CRITICAL: { min: 90, max: 100, label: 'Critique', color: 'bg-red-100 text-red-700' },
} as const;

export const getRiskLevel = (score: number): keyof typeof RISK_LEVELS => {
  if (score <= 30) return 'LOW';
  if (score <= 69) return 'MEDIUM';
  if (score <= 89) return 'HIGH';
  return 'CRITICAL';
};

export const getRiskColor = (score: number): string => {
  const level = getRiskLevel(score);
  return RISK_LEVELS[level].color;
};

export const getRiskLabel = (score: number): string => {
  const level = getRiskLevel(score);
  return RISK_LEVELS[level].label;
};