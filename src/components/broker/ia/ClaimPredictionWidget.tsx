// src/components/broker/ia/ClaimPredictionWidget.tsx
// Widget de prédiction de sinistre IA (Courtier)
// <120 lignes

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useIA } from '@/hooks/useIA';
import { useClaims } from '@/hooks/useClaims';

// Icônes
import { Brain, Shield, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';

interface ClaimPredictionWidgetProps {
  claimId: number;
  onPredictionComplete?: () => void;
}

export const ClaimPredictionWidget = ({ claimId, onPredictionComplete }: ClaimPredictionWidgetProps) => {
  const { analyzeClaimFraud, predictClaimAmount } = useIA();
  const { getClaim } = useClaims();
  
  const [claim, setClaim] = useState<any>(null);
  const [fraudAnalysis, setFraudAnalysis] = useState<any>(null);
  const [amountPrediction, setAmountPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);

  React.useEffect(() => {
    loadClaim();
  }, [claimId]);

  const loadClaim = async () => {
    const claimData = await getClaim(claimId);
    if (claimData) setClaim(claimData);
    setIsLoading(false);
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    const [fraud, amount] = await Promise.all([
      analyzeClaimFraud(claimId),
      predictClaimAmount(claimId)
    ]);
    if (fraud) setFraudAnalysis(fraud);
    if (amount) setAmountPrediction(amount);
    setIsPredicting(false);
    if (onPredictionComplete) onPredictionComplete();
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <LoadingSpinner size="md" />
        </CardContent>
      </Card>
    );
  }

  if (!claim) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-gray-500">Sinistre non trouvé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Prédiction IA
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Informations du sinistre */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500">N° sinistre</p>
            <p className="font-medium text-sm">{claim.claim_number}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Montant déclaré</p>
            <p className="font-medium text-sm">{claim.amount?.toLocaleString()} €</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Date incident</p>
            <p className="font-medium text-sm">{new Date(claim.incident_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Statut</p>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              claim.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              claim.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {claim.status}
            </span>
          </div>
        </div>

        {/* Bouton d'analyse */}
        {!fraudAnalysis && !amountPrediction && (
          <Button onClick={handlePredict} disabled={isPredicting} fullWidth>
            {isPredicting ? <LoadingSpinner size="sm" /> : <Brain className="w-4 h-4 mr-2" />}
            {isPredicting ? 'Analyse en cours...' : 'Lancer l\'analyse IA'}
          </Button>
        )}

        {/* Résultats */}
        {(fraudAnalysis || amountPrediction) && (
          <div className="space-y-3 mt-4">
            {fraudAnalysis && (
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Score fraude</span>
                  </div>
                  <span className="text-sm font-bold">{fraudAnalysis.fraud_score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`rounded-full h-2 ${getRiskColor(fraudAnalysis.fraud_score)}`}
                    style={{ width: `${fraudAnalysis.fraud_score}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Confiance: {(fraudAnalysis.confidence * 100).toFixed(0)}%
                </p>
              </div>
            )}

            {amountPrediction && (
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Montant estimé</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {amountPrediction.predicted_amount.toLocaleString()} €
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 rounded-full h-2"
                    style={{ width: `${amountPrediction.confidence * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Confiance: {(amountPrediction.confidence * 100).toFixed(0)}%
                </p>
              </div>
            )}

            <Button variant="outline" size="sm" fullWidth onClick={handlePredict} disabled={isPredicting}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isPredicting ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClaimPredictionWidget;