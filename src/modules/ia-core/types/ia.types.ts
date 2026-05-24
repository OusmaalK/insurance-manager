// src/modules/ia-core/types/ia.types.ts
// Types génériques pour l'IA
// <70 lignes

// ============================================
// ANALYSES IA
// ============================================

export interface IAFraudAnalysis {
    claim_id: number;
    fraud_score: number;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    indicators: FraudIndicator[];
    confidence: number;
    analyzed_at: string;
  }
  
  export interface FraudIndicator {
    name: string;
    score: number;
    description: string;
    weight: number;
  }
  
  export interface IARiskAnalysis {
    entity_id: number;
    entity_type: 'COMPANY' | 'POLICY' | 'CLAIM';
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
    mitigation?: string;
  }
  
  export interface IAPrediction {
    id: string;
    type: 'RENEWAL' | 'CLAIM_AMOUNT' | 'FRAUD' | 'RISK';
    value: number;
    confidence: number;
    range?: { min: number; max: number };
    factors: string[];
    created_at: string;
    expires_at?: string;
  }
  
  // ============================================
  // MÉTRIQUES IA
  // ============================================
  
  export interface IAMetrics {
    total_calls: number;
    success_rate: number;
    average_latency: number;
    total_cost: number;
    calls_by_type: Record<string, number>;
    period_start: string;
    period_end: string;
  }
  
  export interface IAFeedback {
    id: string;
    prediction_id: string;
    feedback_type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    comment?: string;
    user_id: number;
    created_at: string;
  }
  
  // ============================================
  // CONFIGURATION
  // ============================================
  
  export interface IAConfiguration {
    enabled: boolean;
    tier: 'STANDARD' | 'IA';
    features: string[];
    limits: {
      daily_calls: number;
      monthly_calls: number;
      concurrent_requests: number;
    };
    thresholds: {
      fraud_high: number;
      fraud_medium: number;
      risk_high: number;
      risk_medium: number;
    };
  }