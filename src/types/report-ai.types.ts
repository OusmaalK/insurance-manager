// src/types/report-ai.types.ts
// Types pour les Rapports IA spécifiques
// <40 lignes

export interface AIFraudReport {
    period: string;
    total_claims_analyzed: number;
    fraud_detected: number;
    fraud_rate: number;
    false_positive_rate: number;
    top_fraud_types: Array<{ type: string; count: number }>;
    recommendations: string[];
  }
  
  export interface AIRiskReport {
    period: string;
    companies_analyzed: number;
    high_risk_companies: number;
    medium_risk_companies: number;
    low_risk_companies: number;
    average_risk_score: number;
    risk_factors_distribution: Record<string, number>;
  }
  
  export interface AIPredictionReport {
    period: string;
    total_predictions: number;
    renewal_predictions: Array<{
      probability_range: string;
      count: number;
      percentage: number;
    }>;
    expected_renewals: number;
    expected_churn: number;
  }