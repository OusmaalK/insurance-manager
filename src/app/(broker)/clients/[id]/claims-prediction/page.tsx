// src/app/(broker)/clients/[id]/claims-prediction/page.tsx
// Prédiction sinistres IA pour un client (Courtier)
// <150 lignes

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useCompanies } from '@/hooks/useCompanies';
import { useClaims } from '@/hooks/useClaims';
import { useIA } from '@/hooks/useIA';

// Icônes
import { ArrowLeft, AlertTriangle, Shield, TrendingUp, Calendar, DollarSign, Brain, Sparkles } from 'lucide-react';

export default function ClientClaimsPredictionPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = Number(params.id);

  const { getCompany } = useCompanies();
  const { getClaimsByCompanyId, analyzeFraud, predictAmount } = useClaims();
  const { analyzeClaimFraud } = useIA();

  const [client, setClient] = useState<any>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<Map<number, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    setIsLoading(true);
    const clientData = await getCompany(clientId);
    if (clientData) setClient(clientData);
    
    const claimsData = await getClaimsByCompanyId(clientId);
    if (claimsData) setClaims(claimsData);
    setIsLoading(false);
  };

  const handleAnalyzeAll = async () => {
    setIsAnalyzing(true);
    const newPredictions = new Map();
    for (const claim of claims) {
      const [fraud, amount] = await Promise.all([
        analyzeFraud(claim.id),
        predictAmount(claim.id)
      ]);
      newPredictions.set(claim.id, { fraud, amount });
    }
    setPredictions(newPredictions);
    setIsAnalyzing(false);
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Chargement des prédictions..." />
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
            <h1 className="text-2xl font-bold text-gray-900">Prédictions sinistres</h1>
            <p className="text-gray-500">Client: {client?.name}</p>
          </div>
          <div className="ml-auto">
            <Button onClick={handleAnalyzeAll} disabled={isAnalyzing || claims.length === 0} variant="primary" size="sm">
              {isAnalyzing ? <LoadingSpinner size="sm" /> : <Brain className="w-4 h-4 mr-2" />}
              {isAnalyzing ? 'Analyse en cours...' : 'Analyser tous les sinistres'}
            </Button>
          </div>
        </div>

        {claims.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun sinistre pour ce client</p>
              <Button variant="outline" className="mt-4" onClick={() => router.push(`/broker/claims/new?companyId=${clientId}`)}>
                Déclarer un sinistre
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => {
              const prediction = predictions.get(claim.id);
              const fraudScore = prediction?.fraud?.fraud_score || claim.fraud_score || 0;
              const amountPrediction = prediction?.amount?.predicted_amount;
              
              return (
                <Card key={claim.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{claim.claim_number}</CardTitle>
                        <p className="text-sm text-gray-500">{claim.type}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        claim.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        claim.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {claim.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Montant déclaré</p>
                        <p className="font-medium">{claim.amount.toLocaleString()} €</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date incident</p>
                        <p className="font-medium">{new Date(claim.incident_date).toLocaleDateString()}</p>
                      </div>
                      {amountPrediction && (
                        <div>
                          <p className="text-xs text-gray-500">Prédiction IA</p>
                          <p className="font-medium text-green-600">{amountPrediction.toLocaleString()} €</p>
                        </div>
                      )}
                    </div>

                    <div className={`p-3 rounded-lg ${fraudScore >= 70 ? 'bg-red-50' : fraudScore >= 40 ? 'bg-orange-50' : 'bg-green-50'}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Score fraude IA</span>
                        <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${getRiskColor(fraudScore)}`}>
                          {fraudScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`rounded-full h-2 ${fraudScore >= 70 ? 'bg-red-500' : fraudScore >= 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${fraudScore}%` }}
                        />
                      </div>
                      {prediction?.fraud?.risk_level && (
                        <p className="text-xs mt-2 text-gray-600">
                          Niveau: {prediction.fraud.risk_level} • Confiance: {(prediction.fraud.confidence * 100).toFixed(0)}%
                        </p>
                      )}
                    </div>

                    {prediction?.fraud?.indicators && prediction.fraud.indicators.length > 0 && (
                      <div className="mt-3 text-sm">
                        <p className="font-medium text-gray-700">Indicateurs détectés:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {prediction.fraud.indicators.slice(0, 3).map((ind: any, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                              {ind.name}: {ind.score}%
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Recommandation IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Analysez régulièrement les sinistres de vos clients pour détecter les fraudes potentielles.
              L'IA vous aide à identifier les anomalies et à estimer les montants justes.
            </p>
          </CardContent>
        </Card>
      </div>
    </BrokerLayout>
  );
}