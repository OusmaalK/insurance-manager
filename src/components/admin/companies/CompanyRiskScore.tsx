// src/components/admin/companies/CompanyRiskScore.tsx
// Affichage du score de risque d'une entreprise
// <100 lignes

'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useCompanies } from '@/hooks/useCompanies';

// Icônes
import { Shield, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface CompanyRiskScoreProps {
  companyId: number;
  onRefresh?: () => void;
}

export const CompanyRiskScore = ({ companyId, onRefresh }: CompanyRiskScoreProps) => {
  const { getCompany, analyzeRisk, isLoading } = useCompanies();
  const [riskAnalysis, setRiskAnalysis] = React.useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const loadRisk = async () => {
    setIsAnalyzing(true);
    const risk = await analyzeRisk(companyId);
    if (risk) setRiskAnalysis(risk);
    setIsAnalyzing(false);
  };

  React.useEffect(() => {
    loadRisk();
  }, [companyId]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  if (isLoading || isAnalyzing) {
    return (
      <Card>
        <CardContent className="p-4 flex justify-center">
          <LoadingSpinner size="md" text="Analyse du risque..." />
        </CardContent>
      </Card>
    );
  }

  if (!riskAnalysis) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Analyse non disponible</p>
          <Button onClick={loadRisk} variant="outline" size="sm" className="mt-2">Lancer l'analyse</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold flex items-center gap-2"><Shield className="w-5 h-5" />Score de risque</h3>
          <Button variant="ghost" size="sm" onClick={loadRisk}><RefreshCw className="w-4 h-4" /></Button>
        </div>
        <div className="text-center mb-3">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getRiskColor(riskAnalysis.risk_level)} text-white`}>
            <span className="text-3xl font-bold">{riskAnalysis.risk_score}</span>
          </div>
          <p className="mt-2 text-sm font-medium">Niveau {riskAnalysis.risk_level}</p>
        </div>
        <div className="space-y-2">
          {riskAnalysis.factors?.slice(0, 3).map((factor: any, idx: number) => (
            <div key={idx} className="flex justify-between text-sm"><span>{factor.name}</span><span className={factor.impact >= 70 ? 'text-red-600' : factor.impact >= 40 ? 'text-orange-600' : 'text-green-600'}>{factor.impact}%</span></div>
          ))}
        </div>
        {onRefresh && <Button variant="outline" size="sm" fullWidth className="mt-3" onClick={onRefresh}>Voir détails</Button>}
      </CardContent>
    </Card>
  );
};

export default CompanyRiskScore;