// src/modules/ia-core/hooks/useIAOrchestrator.ts
// Orchestrateur IA pour les appels transversaux
// <120 lignes

import { useCallback, useState } from 'react';
import { apiClient } from '@/modules/api/client/client';
import { EventBus } from '@/modules/events/EventBus';

// ============================================
// TYPES
// ============================================

interface OrchestrationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  duration?: number;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

export const useIAOrchestrator = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<OrchestrationResult | null>(null);

  // Orchestrer une analyse complète de sinistre
  const orchestrateClaimAnalysis = useCallback(async (claimId: number): Promise<OrchestrationResult> => {
    const startTime = Date.now();
    setIsProcessing(true);
    
    try {
      // Appels parallèles
      const [fraud, risk, amount] = await Promise.all([
        apiClient.post(`/claims/ai/analyze-fraud/${claimId}`),
        apiClient.post(`/claims/ai/analyze-risk/${claimId}`),
        apiClient.post(`/claims/ai/predict-amount/${claimId}`),
      ]);
      
      const result = {
        fraud: (fraud as any).data,
        risk: (risk as any).data,
        amount: (amount as any).data,
      };
      
      // Émettre un événement
      EventBus.emit('CLAIM_IA_ANALYSIS_COMPLETED', { claimId, result });
      
      const duration = Date.now() - startTime;
      setLastResult({ success: true, data: result, duration });
      return { success: true, data: result, duration };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      setLastResult({ success: false, error: error.message, duration });
      return { success: false, error: error.message, duration };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Orchestrer une analyse de portefeuille
  const orchestratePortfolioAnalysis = useCallback(async (companyId?: number): Promise<OrchestrationResult> => {
    const startTime = Date.now();
    setIsProcessing(true);
    
    try {
      const [risk, predictions, recommendations] = await Promise.all([
        apiClient.post('/companies/ai/analyze-risk', { company_id: companyId }),
        apiClient.get('/policies/ai/predictions', { params: { company_id: companyId } }),
        apiClient.post('/companies/ai/recommendations', { company_id: companyId }),
      ]);
      
      const result = {
        risk: (risk as any).data,
        predictions: (predictions as any).data,
        recommendations: (recommendations as any).data,
      };
      
      EventBus.emit('PORTFOLIO_IA_ANALYSIS_COMPLETED', { companyId, result });
      
      const duration = Date.now() - startTime;
      setLastResult({ success: true, data: result, duration });
      return { success: true, data: result, duration };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      setLastResult({ success: false, error: error.message, duration });
      return { success: false, error: error.message, duration };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Orchestrer une analyse de sinistres par lots
  const orchestrateBatchClaimsAnalysis = useCallback(async (claimIds: number[]): Promise<OrchestrationResult> => {
    const startTime = Date.now();
    setIsProcessing(true);
    
    try {
      const results = await Promise.all(
        claimIds.map(async (id) => {
          const [fraud, amount] = await Promise.all([
            apiClient.post(`/claims/ai/analyze-fraud/${id}`),
            apiClient.post(`/claims/ai/predict-amount/${id}`),
          ]);
          return {
            claimId: id,
            fraud: (fraud as any).data,
            amount: (amount as any).data,
          };
        })
      );
      
      const duration = Date.now() - startTime;
      setLastResult({ success: true, data: results, duration });
      return { success: true, data: results, duration };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      setLastResult({ success: false, error: error.message, duration });
      return { success: false, error: error.message, duration };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Vérifier la santé des services IA
  const checkIAHealth = useCallback(async (): Promise<OrchestrationResult> => {
    try {
      const response = await apiClient.get('/health/ia');
      return { success: true, data: (response as any).data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  return {
    isProcessing,
    lastResult,
    orchestrateClaimAnalysis,
    orchestratePortfolioAnalysis,
    orchestrateBatchClaimsAnalysis,
    checkIAHealth,
  };
};

export default useIAOrchestrator;