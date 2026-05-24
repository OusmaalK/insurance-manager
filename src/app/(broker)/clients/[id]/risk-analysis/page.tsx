// src/app/(broker)/clients/[id]/risk-analysis/page.tsx
// Analyse risque IA pour un client (Courtier)
// <160 lignes

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useCompanies } from '@/hooks/useCompanies';
import { useIA } from '@/hooks/useIA';

// Icônes
import { ArrowLeft, Shield, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Building2, Users, DollarSign, Briefcase } from 'lucide-react';

export default function ClientRiskAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = Number(params.id);

  const { getCompany, analyzeRisk } = useCompanies();
  const { analyzeCompanyRisk } = useIA();

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
    if (clientData) {
      setClient(clientData);
      // Charger l'analyse existante
      const risk = await analyzeRisk(clientId);
      if (risk) setRiskAnalysis(risk);
    }
    setIsLoading(false);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const risk = await analyzeCompanyRisk(clientId);
    if (risk) setRiskAnalysis(risk);
    setIsAnalyzing(false);
  };

  const getRiskLevelColor = (level: string) => {
    const colors = {
      CRITICAL: 'bg-red-600 text-white',
      HIGH: 'bg-orange-500 text-white',
      MEDIUM: 'bg-yellow-500 text-white',
      LOW: 'bg-green-500 text-white'
    };
    return colors[level as keyof typeof colors] || colors.LOW;
  };

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Chargement de l'analyse..." />
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push(`/broker/clients/${clientId}`)} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analyse de risque IA</h1>
            <p className="text-gray-500">Client: {client?.name}</p>
          </div>
          <div className="ml-auto">
            <Button onClick={handleAnalyze} disabled={isAnalyzing} variant="primary" size="sm">
              {isAnalyzing ? <LoadingSpinner size="sm" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              {isAnalyzing ? 'Analyse en cours...' : 'Actualiser l\'analyse'}
            </Button>
          </div>
        </div>

        {/* Score principal */}
        <Card className="overflow-hidden">
          <div className={`p-6 text-center ${riskAnalysis ? `bg-gradient-to-r ${riskAnalysis.risk_level === 'CRITICAL' ? 'from-red-500 to-red-600' : riskAnalysis.risk_level === 'HIGH' ? 'from-orange-500 to-orange-600' : riskAnalysis.risk_level === 'MEDIUM' ? 'from-yellow-500 to-yellow-600' : 'from-green-500 to-green-600'} text-white` : 'bg-gray-100'}`}>
            <div className="flex items-center justify-center gap-4">
              <Shield className="w-12 h-12" />
              <div>
                <p className="text-sm opacity-90">Score de risque global</p>
                <p className="text-5xl font-bold">{riskAnalysis?.risk_score || client?.risk_score || 0}</p>
              </div>
            </div>
            {riskAnalysis && (
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(riskAnalysis.risk_level)}`}>
                Niveau {riskAnalysis.risk_level}
              </span>
            )}
          </div>
        </Card>

        {/* Informations client */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-3"><div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-400" /><div><p className="text-xs text-gray-500">Secteur</p><p className="text-sm font-medium">{client?.activity_sector || '-'}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /><div><p className="text-xs text-gray-500">Employés</p><p className="text-sm font-medium">{client?.employee_count || '-'}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400" /><div><p className="text-xs text-gray-500">CA annuel</p><p className="text-sm font-medium">{client?.annual_revenue?.toLocaleString() || '-'} €</p></div></div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" /><div><p className="text-xs text-gray-500">Statut</p><p className="text-sm font-medium">{client?.status}</p></div></div></CardContent></Card>
        </div>

        {riskAnalysis && (
          <>
            {/* Facteurs de risque */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  Facteurs de risque analysés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAnalysis.factors?.map((factor: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{factor.name}</span>
                        <span className={factor.impact >= 70 ? 'text-red-600' : factor.impact >= 40 ? 'text-orange-600' : 'text-green-600'}>
                          {factor.impact}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`rounded-full h-2 ${factor.impact >= 70 ? 'bg-red-500' : factor.impact >= 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${factor.impact}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommandations */}
            {riskAnalysis.recommendations && riskAnalysis.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Recommandations IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {riskAnalysis.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Analyse détaillée */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Synthèse IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Analyse réalisée le {new Date(riskAnalysis.analyzed_at || Date.now()).toLocaleString()}
                </p>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Score de confiance: {(riskAnalysis.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!riskAnalysis && !isAnalyzing && (
          <Card>
            <CardContent className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune analyse disponible</p>
              <Button onClick={handleAnalyze} variant="primary" className="mt-3">
                Lancer l'analyse IA
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </BrokerLayout>
  );
}