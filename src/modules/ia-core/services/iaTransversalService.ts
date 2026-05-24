// src/modules/ia-core/services/iaTransversalService.ts
// Service IA transversal pour tous les modules
// <130 lignes

import { apiClient } from '@/modules/api/client/client';
import { EventBus } from '@/modules/events/EventBus';
import { iaStandardService } from './iaStandardService';

// ============================================
// TYPES
// ============================================

export interface TransversalAnalysisResult {
  success: boolean;
  data?: any;
  error?: string;
  source: 'STANDARD' | 'IA';
  cost?: number;
}

// ============================================
// SERVICE
// ============================================

class IATransversalService {
  private iaEnabled = true;

  constructor() {
    this.loadPreferences();
  }

  private loadPreferences(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ia_transversal_enabled');
      this.iaEnabled = saved !== 'false';
    }
  }

  setIAEnabled(enabled: boolean): void {
    this.iaEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ia_transversal_enabled', enabled.toString());
    }
  }

  isIAEnabled(): boolean {
    return this.iaEnabled;
  }

  private async callIA<T>(endpoint: string, data?: any): Promise<TransversalAnalysisResult> {
    const startTime = Date.now();
    
    try {
      const response = await apiClient.post<T>(endpoint, data);
      const duration = Date.now() - startTime;
      
      // Logger la télémétrie
      EventBus.emit('IA_CALL_COMPLETED', {
        endpoint,
        duration,
        success: true,
      });
      
      return {
        success: true,
        data: (response as any).data,
        source: 'IA',
        cost: duration * 0.001, // Coût simulé
      };
    } catch (error: any) {
      EventBus.emit('IA_CALL_FAILED', {
        endpoint,
        error: error.message,
      });
      
      return {
        success: false,
        error: error.message,
        source: 'IA',
      };
    }
  }

  private async callStandard<T>(serviceMethod: () => Promise<T>): Promise<TransversalAnalysisResult> {
    try {
      const result = await serviceMethod();
      return {
        success: true,
        data: result,
        source: 'STANDARD',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        source: 'STANDARD',
      };
    }
  }

  async analyzeClaimFraud(claimId: number): Promise<TransversalAnalysisResult> {
    if (this.iaEnabled) {
      return this.callIA(`/claims/ai/analyze-fraud/${claimId}`);
    }
    return this.callStandard(() => iaStandardService.analyzeClaim({ claimId }));
  }

  async analyzeCompanyRisk(companyId: number): Promise<TransversalAnalysisResult> {
    if (this.iaEnabled) {
      return this.callIA(`/companies/ai/analyze-risk/${companyId}`);
    }
    return this.callStandard(() => iaStandardService.analyzeRisk({ companyId }));
  }

  async predictPolicyRenewal(policyId: number): Promise<TransversalAnalysisResult> {
    if (this.iaEnabled) {
      return this.callIA(`/policies/${policyId}/predict-renewal`);
    }
    return this.callStandard(() => iaStandardService.predictRenewal(policyId));
  }

  async analyzeClaimAmount(claimId: number): Promise<TransversalAnalysisResult> {
    if (this.iaEnabled) {
      return this.callIA(`/claims/ai/predict-amount/${claimId}`);
    }
    return this.callStandard(async () => ({
      predicted_amount: Math.random() * 5000,
      confidence: Math.random(),
    }));
  }

  async getDashboardInsights(): Promise<TransversalAnalysisResult> {
    if (this.iaEnabled) {
      return this.callIA('/dashboard/ia/insights');
    }
    return this.callStandard(async () => ({
      insights: ['Analyse standard disponible', 'Passez au palier IA pour plus de détails'],
    }));
  }

  async getRemainingCredits(): Promise<number> {
    if (this.iaEnabled) {
      try {
        const response = await apiClient.get('/ia/monetization/credits');
        return (response as any).data?.remaining || 0;
      } catch {
        return 0;
      }
    }
    return iaStandardService.getRemainingCalls();
  }
}

export const iaTransversalService = new IATransversalService();
export default iaTransversalService;