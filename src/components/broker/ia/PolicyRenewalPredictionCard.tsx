// src/components/broker/ia/PolicyRenewalPredictionCard.tsx
// Carte prédiction renouvellement IA (Courtier)
// <110 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { usePolicies } from '@/hooks/usePolicies';
import { useIA } from '@/hooks/useIA';

// Icônes
import { TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Calendar, Mail, Phone } from 'lucide-react';

interface PolicyRenewalPredictionCardProps {
  policyId: number;
  onRefresh?: () => void;
}

export const PolicyRenewalPredictionCard = ({ policyId, onRefresh }: PolicyRenewalPredictionCardProps) => {
  const { getPolicy, predictRenewal } = usePolicies();
  const [policy, setPolicy] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    loadData();
  }, [policyId]);

  const loadData = async () => {
    setIsLoading(true);
    const policyData = await getPolicy(policyId);
    if (policyData) setPolicy(policyData);
    const pred = await predictRenewal(policyId);
    if (pred) setPrediction(pred);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsPredicting(true);
    const pred = await predictRenewal(policyId);
    if (pred) setPrediction(pred);
    setIsPredicting(false);
    if (onRefresh) onRefresh();
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return 'text-green-600 bg-green-100';
    if (prob >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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

  if (!policy) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p>Contrat non trouvé</p>
        </CardContent>
      </Card>
    );
  }

  const daysLeft = Math.ceil((new Date(policy.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Prédiction renouvellement
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isPredicting}>
            <RefreshCw className={`w-4 h-4 ${isPredicting ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-500">{policy.policy_number}</p>
          <p className="text-xs text-gray-400">{policy.insurer}</p>
        </div>

        {prediction ? (
          <>
            <div className="text-center mb-4">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getProbabilityColor(prediction.renewal_probability)}`}>
                <span className="text-2xl font-bold">{prediction.renewal_probability}%</span>
              </div>
              <p className="text-sm mt-2">Probabilité de renouvellement</p>
            </div>

            <div className="space-y-2 mb-4">
              {prediction.reasons?.slice(0, 2).map((reason: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <span className="text-gray-600">{reason}</span>
                </div>
              ))}
            </div>

            {prediction.suggested_action && (
              <div className="p-3 bg-blue-50 rounded-lg mb-4">
                <p className="text-sm font-medium text-blue-800">Action suggérée</p>
                <p className="text-sm text-blue-700">{prediction.suggested_action}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Mail className="w-4 h-4 mr-1" />
                Relancer
              </Button>
              <Button variant="primary" size="sm" className="flex-1">
                <Phone className="w-4 h-4 mr-1" />
                Appeler
              </Button>
            </div>
          </>
        ) : (
          <Button onClick={handleRefresh} disabled={isPredicting} fullWidth>
            {isPredicting ? <LoadingSpinner size="sm" /> : <TrendingUp className="w-4 h-4 mr-2" />}
            {isPredicting ? 'Prédiction...' : 'Prédire renouvellement'}
          </Button>
        )}

        {daysLeft < 30 && (
          <div className="mt-3 p-2 bg-red-50 rounded-lg text-center">
            <p className="text-xs text-red-600">⚠️ Échéance dans {daysLeft} jours</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyRenewalPredictionCard;