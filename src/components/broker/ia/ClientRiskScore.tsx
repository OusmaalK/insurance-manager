// src/components/broker/ia/ClientRiskScore.tsx
// Score de risque client IA (Courtier)
// <110 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useCompanies } from '@/hooks/useCompanies';

// Icônes
import { Shield, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, TrendingDown } from 'lucide-react';

interface ClientRiskScoreProps {
  clientId: number;
  onRefresh?: () => void;
  compact?: boolean;
}

export const ClientRiskScore = ({ clientId, onRefresh, compact = false }: ClientRiskScoreProps) => {
  const { getCompany, analyzeRisk } = useCompanies();
  const [client, setClient] = useState<any>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    setIsLoading(true);
    const clientData = await getCompany(clientId);
    if (clientData) setClient(clientData);
    const risk = await analyzeRisk(clientId);
    if (risk) setRiskAnalysis(risk);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsAnalyzing(true);
    const risk = await analyzeRisk(clientId);
    if (risk) setRiskAnalysis(risk);
    setIsAnalyzing(false);
    if (onRefresh) onRefresh();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getRiskTextColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-4 text-center text-red-500">
        Client non trouvé
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${riskAnalysis ? getRiskColor(riskAnalysis.risk_level) : 'bg-gray-400'}`} />
        <span className={`font-medium ${riskAnalysis ? getRiskTextColor(riskAnalysis.risk_level) : 'text-gray-600'}`}>
          {riskAnalysis?.risk_score || client.risk_score || 0}
        </span>
        <button onClick={handleRefresh} disabled={isAnalyzing} className="text-gray-400 hover:text-gray-600">
          <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Analyse de risque IA
          </h3>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isAnalyzing}>
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="text-center mb-3">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${riskAnalysis ? getRiskColor(riskAnalysis.risk_level) : 'bg-gray-300'} text-white`}>
            <span className="text-3xl font-bold">{riskAnalysis?.risk_score || client.risk_score || 0}</span>
          </div>
          <p className="mt-2 text-sm font-medium">{riskAnalysis?.risk_level || 'NON ANALYSÉ'}</p>
        </div>

        {riskAnalysis?.factors && riskAnalysis.factors.length > 0 && (
          <div className="space-y-2 mt-3">
            {riskAnalysis.factors.slice(0, 3).map((factor: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between text-sm">
                  <span>{factor.name}</span>
                  <span className={factor.impact >= 70 ? 'text-red-600' : factor.impact >= 40 ? 'text-orange-600' : 'text-green-600'}>
                    {factor.impact}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`rounded-full h-1.5 ${factor.impact >= 70 ? 'bg-red-500' : factor.impact >= 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${factor.impact}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {riskAnalysis?.recommendations && riskAnalysis.recommendations.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-800">
              💡 {riskAnalysis.recommendations[0]}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientRiskScore;