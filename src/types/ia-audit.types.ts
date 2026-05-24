// src/types/ia-audit.types.ts
// Types pour l'Audit IA
// <45 lignes

export interface IALog {
    id: number;
    user_id: number;
    user_name: string;
    action: string;
    entity_type: string;
    entity_id: number;
    details: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
  }
  
  export interface IAPerformanceMetric {
    id: number;
    date: string;
    total_analyzed: number;
    fraud_detected: number;
    false_positives: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    avg_response_time: number;
    total_cost: number;
  }
  
  export interface IAFeedback {
    id: number;
    prediction_id: string;
    prediction_type: string;
    feedback_type: 'positive' | 'negative';
    comment: string;
    user_id: number;
    created_at: string;
  }
  
  export interface IAAuditSummary {
    total_calls: number;
    total_cost: number;
    average_latency: number;
    success_rate: number;
    period_start: string;
    period_end: string;
  }