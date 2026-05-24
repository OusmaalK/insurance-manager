// src/types/ia-dashboard.types.ts
// Types pour le Dashboard IA
// <45 lignes

export interface IADashboardMetrics {
    total_companies: number;
    total_policies: number;
    total_claims: number;
    fraud_alerts: number;
    high_risk_companies: number;
    expiring_policies: number;
    pending_claims: number;
  }
  
  export interface IAChartData {
    labels: string[];
    datasets: IADataset[];
  }
  
  export interface IADataset {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }
  
  export interface IAServiceStatus {
    name: string;
    status: 'UP' | 'DOWN' | 'DEGRADED';
    latency: number;
    last_check: string;
  }
  
  export interface IARecommendation {
    id: string;
    title: string;
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    action_url: string;
  }