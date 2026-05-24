// src/components/broker/ia/RenewalPredictionCard.tsx
// Carte prédiction renouvellement IA (Courtier)
// <120 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { usePolicies } from '@/hooks/usePolicies';
import { useIA } from '@/hooks/useIA';

// Icônes
import { TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Calendar, Mail, Phone, Send, Clock, ArrowUp, ArrowDown } from 'lucide-react';

interface RenewalPredictionCardProps {
  policyId: number;
  onRefresh?: () => void;
  onContact?: () => void;
}

export const RenewalPredictionCard = ({ policyId, onRefresh, onContact }: RenewalPredictionCardProps) => {
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
    if (prob >= 70) return 'bg-green-500';
    if (prob >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProbabilityTextColor = (prob: number) => {
    if (prob >= 70) return 'text-green-600';
    if (prob >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProbabilityLabel = (prob: number) => {
    if (prob >= 70) return 'Élevée';
    if (prob >= 40) return 'Moyenne';
    return 'Faible';
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

  if (!policy) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-gray-500">Contrat non trouvé</p>
        </CardContent>
      </Card>
    );
  }

  const daysLeft = Math.ceil((new Date(policy.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const isExpiringSoon = daysLeft < 30;

  return (
    <Card className={`${isExpiringSoon ? 'border-l-4 border-l-red-500' : ''}`}>
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
        {/* Informations du contrat */}
        <div className="mb-4 pb-3 border-b">
          <p className="font-semibold text-gray-900">{policy.policy_number}</p>
          <p className="text-sm text-gray-500">{policy.insurer}</p>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <p className={`text-xs ${isExpiringSoon ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              Expire dans {daysLeft} jours
            </p>
          </div>
        </div>

        {prediction ? (
          <>
            {/* Score de probabilité */}
            <div className="text-center mb-4">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32">
                  <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="56" cx="64" cy="64" />
                  <circle
                    className={getProbabilityColor(prediction.renewal_probability)}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - prediction.renewal_probability / 100)}`}
                    strokeLinecap="round"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                    transform="rotate(-90 64 64)"
                  />
                </svg>
                <span className="absolute text-2xl font-bold">{prediction.renewal_probability}%</span>
              </div>
              <p className="text-sm mt-2">
                Probabilité <span className={getProbabilityTextColor(prediction.renewal_probability)}>
                  {getProbabilityLabel(prediction.renewal_probability)}
                </span>
              </p>
            </div>

            {/* Facteurs clés */}
            {prediction.reasons && prediction.reasons.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Facteurs clés</p>
                <div className="space-y-2">
                  {prediction.reasons.slice(0, 3).map((reason: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action suggérée */}
            {prediction.suggested_action && (
              <div className="p-3 bg-blue-50 rounded-lg mb-4">
                <p className="text-sm font-medium text-blue-800">Action suggérée</p>
                <p className="text-sm text-blue-700 mt-1">{prediction.suggested_action}</p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={onContact}>
                <Mail className="w-4 h-4 mr-1" />
                Relancer
              </Button>
              <Button variant="primary" size="sm" className="flex-1" onClick={onContact}>
                <Phone className="w-4 h-4 mr-1" />
                Appeler
              </Button>
            </div>

            {/* Alerte échéance */}
            {isExpiringSoon && (
              <div className="mt-3 p-2 bg-red-50 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <p className="text-xs text-red-600">
                  Contrat bientôt expiré - Action recommandée dans les {daysLeft} jours
                </p>
              </div>
            )}
          </>
        ) : (
          <Button onClick={handleRefresh} disabled={isPredicting} fullWidth>
            {isPredicting ? <LoadingSpinner size="sm" /> : <TrendingUp className="w-4 h-4 mr-2" />}
            {isPredicting ? 'Prédiction en cours...' : 'Prédire le renouvellement'}
          </Button>
        )}

        {/* Prime et valeur */}
        {policy.premium_amount && (
          <div className="mt-3 pt-3 border-t flex justify-between text-sm">
            <span className="text-gray-500">Prime annuelle</span>
            <span className="font-medium">{policy.premium_amount.toLocaleString()} €</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RenewalPredictionCard;