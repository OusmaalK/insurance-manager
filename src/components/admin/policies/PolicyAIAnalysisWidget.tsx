// src/components/admin/policies/PolicyAIAnalysisWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, TrendingUp, Shield, AlertTriangle, Sparkles, 
  Loader2, CheckCircle, XCircle, BarChart3, Target,
  Zap, Clock, Download, RefreshCw
} from 'lucide-react';
import { usePolicyAI } from '@/hooks/usePolicyAI';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

interface PolicyAIAnalysisWidgetProps {
  policyId: number;
  onRefresh?: () => void;
}

export function PolicyAIAnalysisWidget({ policyId, onRefresh }: PolicyAIAnalysisWidgetProps) {
  const { analyzeRisk, getPredictions, isLoading } = usePolicyAI();
  const [riskData, setRiskData] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [risk, pred] = await Promise.all([
        analyzeRisk(policyId),
        getPredictions(policyId)
      ]);
      setRiskData(risk);
      setPredictions(pred);
    };
    loadData();
  }, [policyId, analyzeRisk, getPredictions]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const [risk, pred] = await Promise.all([
      analyzeRisk(policyId),
      getPredictions(policyId)
    ]);
    setRiskData(risk);
    setPredictions(pred);
    setIsRefreshing(false);
    onRefresh?.();
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'Critique';
      case 'HIGH': return 'Élevé';
      case 'MEDIUM': return 'Modéré';
      default: return 'Faible';
    }
  };

  if (isLoading && !riskData) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-3" />
          <p className="text-gray-500">Analyse IA en cours...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Analyse IA Transversale
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bannière IA */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Analyse basée sur Gemini 2.0 Flash</p>
              <p className="text-xs text-gray-500 mt-1">
                Analyse en temps réel du contrat, des clauses et du profil risque
              </p>
            </div>
          </div>
        </div>

        {/* Score de risque global */}
        <div className="text-center">
          <div className="relative inline-block">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle 
                cx="64" cy="64" r="56" fill="none" 
                stroke={riskData?.risk_score >= 70 ? '#ef4444' : riskData?.risk_score >= 40 ? '#f59e0b' : '#10b981'}
                strokeWidth="8"
                strokeDasharray={`${((riskData?.risk_score || 0) / 100) * 352} 352`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{riskData?.risk_score || 0}</span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
          </div>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-white ${getRiskLevelColor(riskData?.risk_level)}`}>
              <Shield className="w-3 h-3" />
              Risque {getRiskLevelText(riskData?.risk_level)}
            </span>
          </div>
        </div>

        {/* Métriques prédictives */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-700">{predictions?.renewal_probability || 85}%</p>
            <p className="text-xs text-green-600">Renouvellement</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-700">{predictions?.claim_probability || 12}%</p>
            <p className="text-xs text-red-600">Risque sinistre</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-700">{predictions?.cross_sell_potential || 72}%</p>
            <p className="text-xs text-blue-600">Cross-sell</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <Zap className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-purple-700">{predictions?.growth_potential || 23}%</p>
            <p className="text-xs text-purple-600">Croissance</p>
          </div>
        </div>

        {/* Facteurs de risque détaillés */}
        {riskData?.factors && riskData.factors.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Facteurs de risque</h4>
            <div className="space-y-2">
              {riskData.factors.map((factor: any, idx: number) => (
                <div key={idx} className="p-2 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{factor.name}</span>
                    <span className={factor.impact >= 70 ? 'text-red-600' : factor.impact >= 40 ? 'text-orange-600' : 'text-green-600'}>
                      {factor.impact}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className={`h-1 rounded-full ${factor.impact >= 70 ? 'bg-red-500' : factor.impact >= 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                      style={{ width: `${factor.impact}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommandations IA */}
        {riskData?.recommendations && riskData.recommendations.length > 0 && (
          <div className="p-3 bg-amber-50 rounded-lg">
            <h4 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Recommandations IA
            </h4>
            <ul className="space-y-1">
              {riskData.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="text-xs text-amber-600 flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Best Actions */}
        {predictions?.next_best_actions && predictions.next_best_actions.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Actions recommandées
            </h4>
            <div className="space-y-2">
              {predictions.next_best_actions.map((action: any, idx: number) => (
                <div key={idx} className="p-2 bg-white rounded-lg">
                  <p className="text-sm font-medium">{action.action}</p>
                  <p className="text-xs text-gray-600 mt-1">{action.reason}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      action.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                      action.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {action.priority}
                    </span>
                    <span className="text-xs text-gray-500">Impact: {action.expected_impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prime optimale */}
        {predictions?.optimal_premium && (
          <div className="p-3 bg-green-50 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-700">Prime optimale suggérée</p>
              <p className="text-xs text-green-600">Basé sur l'analyse IA du profil risque</p>
            </div>
            <p className="text-2xl font-bold text-green-700">{predictions.optimal_premium.toLocaleString()} €</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}