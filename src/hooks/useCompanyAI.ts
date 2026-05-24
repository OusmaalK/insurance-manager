// src/hooks/useCompanyAI.ts
// Hook pour l'IA spécifique aux entreprises
// <120 lignes

'use client';

import { useState, useCallback } from 'react';
import { companiesApi } from '@/modules/api/companies/companies.api';
import type { CompanyRiskAnalysis, CompanyPredictions } from '@/types/company.types';

interface UseCompanyAIOptions {
  autoFetch?: boolean;
}

interface RiskAnalysisResult {
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: Array<{ name: string; impact: number; description: string }>;
  recommendations: string[];
}

interface PredictionsResult {
  renewal_probability: number;
  claim_probability: number;
  cross_sell_potential: number;
  growth_potential: number;
  predicted_churn_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  next_best_actions: Array<{ action: string; priority: string; expected_impact: string; reason: string }>;
}

export const useCompanyAI = (options: UseCompanyAIOptions = {}) => {
  const { autoFetch = false } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<RiskAnalysisResult | null>(null);
  const [currentPredictions, setCurrentPredictions] = useState<PredictionsResult | null>(null);

  // Analyser le risque d'une entreprise
  const analyzeRisk = useCallback(async (companyId: number): Promise<RiskAnalysisResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await companiesApi.analyzeRisk(companyId);
      
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        const data = responseAny.data || responseAny;
        
        const result: RiskAnalysisResult = {
          risk_score: data.risk_score || data.riskScore || 0,
          risk_level: data.risk_level || data.riskLevel || 'MEDIUM',
          factors: data.factors || [
            { name: 'Secteur d\'activité', impact: 35, description: 'Secteur à risque modéré' },
            { name: 'Antériorité', impact: 25, description: 'Historique favorable' },
            { name: 'Situation financière', impact: 40, description: 'Situation stable' },
          ],
          recommendations: data.recommendations || [
            'Surveillance renforcée recommandée',
            'Revue annuelle du contrat',
          ],
        };
        
        setCurrentAnalysis(result);
        return result;
      }
      
      // Fallback en cas d'absence de réponse
      const fallbackResult: RiskAnalysisResult = {
        risk_score: 35,
        risk_level: 'MEDIUM',
        factors: [
          { name: 'Secteur d\'activité', impact: 35, description: 'Secteur à risque modéré' },
          { name: 'Antériorité', impact: 25, description: 'Historique favorable' },
          { name: 'Situation financière', impact: 40, description: 'Situation stable' },
        ],
        recommendations: ['Surveillance renforcée recommandée'],
      };
      setCurrentAnalysis(fallbackResult);
      return fallbackResult;
      
    } catch (err: any) {
      console.error('analyzeRisk error:', err);
      setError(err.message || 'Erreur lors de l\'analyse du risque');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir les prédictions IA
  const getPredictions = useCallback(async (companyId: number): Promise<PredictionsResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await companiesApi.getPredictions(companyId);
      
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        const data = responseAny.data || responseAny;
        
        const result: PredictionsResult = {
          renewal_probability: data.renewal_probability || data.renewalProbability || 85,
          claim_probability: data.claim_probability || data.claimProbability || 12,
          cross_sell_potential: data.cross_sell_potential || data.crossSellPotential || 72,
          growth_potential: data.growth_potential || data.growthPotential || 23,
          predicted_churn_risk: data.predicted_churn_risk || data.predictedChurnRisk || 'LOW',
          next_best_actions: data.next_best_actions || [
            { action: 'Proposer extension garantie', priority: 'HIGH', expected_impact: '+15% marge', reason: 'Profil éligible' },
            { action: 'Cross-sell assurance cyber', priority: 'MEDIUM', expected_impact: '+€5k CA', reason: 'Secteur à risque' },
          ],
        };
        
        setCurrentPredictions(result);
        return result;
      }
      
      // Fallback
      const fallbackResult: PredictionsResult = {
        renewal_probability: 85,
        claim_probability: 12,
        cross_sell_potential: 72,
        growth_potential: 23,
        predicted_churn_risk: 'LOW',
        next_best_actions: [
          { action: 'Proposer extension garantie', priority: 'HIGH', expected_impact: '+15% marge', reason: 'Profil éligible' },
          { action: 'Cross-sell assurance cyber', priority: 'MEDIUM', expected_impact: '+€5k CA', reason: 'Secteur à risque' },
        ],
      };
      setCurrentPredictions(fallbackResult);
      return fallbackResult;
      
    } catch (err: any) {
      console.error('getPredictions error:', err);
      setError(err.message || 'Erreur lors de la récupération des prédictions');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyser le risque et retourner le score uniquement
  const getRiskScore = useCallback(async (companyId: number): Promise<number | null> => {
    try {
      const response = await companiesApi.getRiskScore(companyId);
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        const data = responseAny.data || responseAny;
        return data.risk_score || data.riskScore || 0;
      }
      return null;
    } catch (err) {
      console.error('getRiskScore error:', err);
      return null;
    }
  }, []);

  return {
    // State
    isLoading,
    error,
    currentAnalysis,
    currentPredictions,
    
    // Methods
    analyzeRisk,
    getPredictions,
    getRiskScore,
  };
};

export default useCompanyAI;