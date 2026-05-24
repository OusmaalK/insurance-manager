// src/types/ia-report.types.ts
// Types pour les Rapports IA
// <45 lignes

export interface IAReport {
    id: number;
    type: string;
    period: string;
    generated_at: string;
    data: IAReportData;
    format: string;
    status: string;
  }
  
  export interface IAReportData {
    summary: IAReportSummary;
    charts: IAReportChart[];
    insights: IAInsight[];
  }
  
  export interface IAReportSummary {
    title: string;
    total_analyzed: number;
    fraud_detected: number;
    risk_distribution: Record<string, number>;
    key_findings: string[];
  }
  
  export interface IAReportChart {
    type: 'line' | 'bar' | 'pie';
    title: string;
    data: Array<{ label: string; value: number }>;
  }
  
  export interface IAInsight {
    title: string;
    description: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    recommendation: string;
    confidence: number;
  }