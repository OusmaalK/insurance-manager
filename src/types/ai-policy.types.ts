// src/types/ai-policy.types.ts
// Types pour l'IA Contrat
// <50 lignes

export interface PolicyRenewalPrediction {
    policy_id: number;
    renewal_probability: number;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    reasons: string[];
    suggested_action: string;
    predicted_at: string;
  }
  
  export interface ClauseAnalysis {
    policy_id: number;
    clauses: Clause[];
    summary: string;
    recommendations: string[];
    risk_score: number;
    analyzed_at: string;
  }
  
  export interface Clause {
    name: string;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    suggested_modification?: string;
  }
  
  export interface PremiumOptimization {
    policy_id: number;
    current_premium: number;
    optimized_premium: number;
    potential_savings: number;
    suggestions: PremiumSuggestion[];
  }
  
  export interface PremiumSuggestion {
    name: string;
    description: string;
    impact: number;
    implementation_difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  }