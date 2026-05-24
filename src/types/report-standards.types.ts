// src/types/report-standards.types.ts
// Types pour les Rapports Standards
// <40 lignes

export interface StandardReport {
    id: number;
    name: string;
    type: 'CLAIMS' | 'POLICIES' | 'COMPANIES' | 'FINANCIAL';
    period: string;
    generated_at: string;
    data: StandardReportData;
    format: 'pdf' | 'excel' | 'csv';
  }
  
  export interface StandardReportData {
    headers: string[];
    rows: Record<string, any>[];
    totals?: Record<string, number>;
    metadata?: Record<string, any>;
  }
  
  export interface ClaimsReportData {
    total_claims: number;
    total_amount: number;
    approved_amount: number;
    pending_count: number;
    average_processing_time: number;
    claims_by_type: Record<string, number>;
  }
  
  export interface FinancialReportData {
    total_premium: number;
    total_commissions: number;
    paid_claims: number;
    loss_ratio: number;
    monthly_evolution: Array<{ month: string; premium: number; claims: number }>;
  }