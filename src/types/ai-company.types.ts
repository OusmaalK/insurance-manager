// src/types/ai-company.types.ts
// Types pour l'IA Entreprise
// <50 lignes

export interface CompanyRiskAnalysis {
    company_id: number;
    risk_score: number;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    factors: RiskFactor[];
    recommendations: string[];
    confidence: number;
    analyzed_at: string;
  }
  
  export interface RiskFactor {
    name: string;
    impact: number;
    description: string;
    weight: number;
  }
  
  export interface SectorAnalysis {
    sector: string;
    average_risk: number;
    companies_count: number;
    trends: SectorTrend[];
  }
  
  export interface SectorTrend {
    period: string;
    risk_evolution: number;
    incident_rate: number;
  }
  
  export interface CompanyRecommendation {
    company_id: number;
    recommendations: ProductRecommendation[];
    generated_at: string;
  }
  
  export interface ProductRecommendation {
    product_id: string;
    product_name: string;
    relevance_score: number;
    reason: string;
    estimated_premium: number;
  }