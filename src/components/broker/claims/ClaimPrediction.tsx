// src/components/broker/claims/ClaimPrediction.tsx
// Prédiction sinistre IA (Courtier)
// <140 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useIA } from '@/hooks/useIA';
import { useClaims } from '@/hooks/useClaims';

// Icônes
import { TrendingUp, Shield, AlertTriangle, CheckCircle, Clock, DollarSign, Brain, Sparkles } from 'lucide-react';

interface ClaimPredictionProps {
  claimId: number;
  onPredictionComplete?: (prediction: any) => void;
}

export const ClaimPrediction = ({ claimId, onPredictionComplete }: ClaimPredictionProps) => {
  const { analyzeClaimFraud, predictClaimAmount } = useIA();
  const { getClaim } = useClaims();
  
  const [claim, setClaim] = useState<any>(null);
  const [fraudAnalysis, setFraudAnalysis] = useState<any>(null);
  const [amountPrediction, setAmountPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
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
    if (onPredictionComplete) onPredictionComplete({ fraud, amount });
    setIsPredicting(false);
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return 'CRITIQUE';
    if (score >= 40) return 'ÉLEVÉ';
    if (score >= 20) return 'MOYEN';
    return 'FAIBLE';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <LoadingSpinner size="md" text="Chargement..." />
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
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Analyse IA du sinistre
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Infos sinistre */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div><p className="text-xs text-gray-500">Numéro</p><p className="font-medium text-sm">{claim.claim_number}</p></div>
          <div><p className="text-xs text-gray-500">Montant déclaré</p><p className="font-medium text-sm">{claim.amount?.toLocaleString()} €</p></div>
          <div><p className="text-xs text-gray-500">Date incident</p><p className="font-medium text-sm">{new Date(claim.incident_date).toLocaleDateString()}</p></div>
          <div><p className="text-xs text-gray-500">Statut</p><span className={`px-2 py-0.5 text-xs rounded-full ${claim.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : claim.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{claim.status}</span></div>
        </div>

        {/* Bouton analyse */}
        {!fraudAnalysis && !amountPrediction && (
          <Button onClick={handlePredict} disabled={isPredicting} fullWidth className="py-2">
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
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-purple-600" /><span className="text-sm font-medium">Score fraude</span></div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getRiskColor(fraudAnalysis.fraud_score)}`}>{getRiskLevel(fraudAnalysis.fraud_score)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className={`rounded-full h-2 ${fraudAnalysis.fraud_score >= 70 ? 'bg-red-500' : fraudAnalysis.fraud_score >= 40 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${fraudAnalysis.fraud_score}%` }} /></div>
                <p className="text-xs text-gray-500 mt-2">Confiance: {(fraudAnalysis.confidence * 100).toFixed(0)}%</p>
              </div>
            )}

            {amountPrediction && (
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2"><div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-600" /><span className="text-sm font-medium">Montant estimé</span></div><span className="text-lg font-bold text-green-600">{amountPrediction.predicted_amount.toLocaleString()} €</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 rounded-full h-2" style={{ width: `${amountPrediction.confidence * 100}%` }} /></div>
                <p className="text-xs text-gray-500 mt-2">Confiance: {(amountPrediction.confidence * 100).toFixed(0)}%</p>
              </div>
            )}

            <button onClick={() => setShowDetails(!showDetails)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">{showDetails ? '▼ Masquer les détails' : '▶ Afficher les détails'}</button>

            {showDetails && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                {fraudAnalysis?.indicators && (<div><p className="font-medium text-gray-700">Indicateurs de fraude:</p><ul className="list-disc list-inside text-gray-600 mt-1">{fraudAnalysis.indicators.slice(0, 3).map((ind: any, idx: number) => (<li key={idx} className="text-xs">{ind.name}: {ind.score}%</li>))}</ul></div>)}
                {amountPrediction?.factors && (<div><p className="font-medium text-gray-700">Facteurs influençant le montant:</p><ul className="list-disc list-inside text-gray-600 mt-1">{amountPrediction.factors.slice(0, 3).map((factor: string, idx: number) => (<li key={idx} className="text-xs">{factor}</li>))}</ul></div>)}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClaimPrediction;