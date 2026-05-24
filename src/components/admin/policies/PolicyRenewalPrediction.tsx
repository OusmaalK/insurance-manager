// src/components/admin/policies/PolicyRenewalPrediction.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Bell, Phone, Mail } from 'lucide-react';
import { usePolicyAI } from '@/hooks/usePolicyAI';
import { usePolicies } from '@/hooks/usePolicies';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { formatDate } from '@/types/policy.types';

interface PolicyRenewalPredictionProps {
  policyId: number;
  onScheduleReminder?: () => void;
}

interface PredictionData {
  renewal_probability: number;
  claim_probability?: number;
  optimal_premium?: number;
  factors?: string[];
  next_best_actions?: Array<{
    action: string;
    priority: string;
    expected_impact: string;
    reason: string;
  }>;
  end_date?: string;
}

export function PolicyRenewalPrediction({ policyId, onScheduleReminder }: PolicyRenewalPredictionProps) {
  const { getPredictions, predictRenewal, isLoading: aiLoading } = usePolicyAI();
  const { getPolicy, isLoading: policyLoading } = usePolicies();
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // Récupérer les prédictions IA
        const [pred, renewal, policy] = await Promise.all([
          getPredictions(policyId),
          predictRenewal(policyId),
          getPolicy(policyId)
        ]);
        
        // Fusionner les données
        setPrediction({ ...pred, ...renewal });
        
        // Récupérer la date de fin depuis le contrat
        if (policy?.end_date) {
          setEndDate(policy.end_date);
          const days = Math.ceil((new Date(policy.end_date).getTime() - Date.now()) / (1000 * 3600 * 24));
          setDaysLeft(days);
        }
      } catch (error) {
        console.error('Erreur chargement prédictions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [policyId, getPredictions, predictRenewal, getPolicy]);

  const getRiskColor = () => {
    const prob = prediction?.renewal_probability ?? 85;
    if (prob >= 70) return { bg: 'bg-green-100', text: 'text-green-700', label: 'Forte probabilité' };
    if (prob >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Probabilité modérée' };
    return { bg: 'bg-red-100', text: 'text-red-700', label: 'Risque élevé' };
  };

  const riskStyle = getRiskColor();

  if (isLoading || aiLoading || policyLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Prédiction renouvellement IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer avec date d'échéance */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm">Échéance</span>
          </div>
          <div className="text-right">
            <span className={`text-sm font-medium ${daysLeft < 30 ? 'text-red-600' : 'text-gray-900'}`}>
              {endDate ? formatDate(endDate) : 'Non définie'}
            </span>
            {daysLeft > 0 && daysLeft < 365 && (
              <p className={`text-xs ${daysLeft < 30 ? 'text-red-500' : 'text-gray-500'}`}>
                {daysLeft < 0 ? 'Expiré' : `${daysLeft} jours restants`}
              </p>
            )}
          </div>
        </div>

        {/* Probabilité de renouvellement */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Probabilité de renouvellement</span>
            <span className="font-bold">{prediction?.renewal_probability ?? 85}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                (prediction?.renewal_probability ?? 85) >= 70 ? 'bg-green-500' :
                (prediction?.renewal_probability ?? 85) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${prediction?.renewal_probability ?? 85}%` }}
            />
          </div>
          <p className={`text-xs mt-1 ${riskStyle.text}`}>{riskStyle.label}</p>
        </div>

        {/* Prime optimale suggérée */}
        {prediction?.optimal_premium && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-700">💰 Prime optimale suggérée</p>
            <p className="text-lg font-bold text-blue-600 mt-1">
              {prediction.optimal_premium.toLocaleString()} €
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Basé sur l'analyse IA du profil risque
            </p>
          </div>
        )}

        {/* Facteurs d'influence */}
        {prediction?.factors && prediction.factors.length > 0 && (
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-700">📊 Facteurs d'influence</p>
            <ul className="mt-2 space-y-1">
              {prediction.factors.map((factor: string, idx: number) => (
                <li key={idx} className="text-xs text-purple-600">• {factor}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Best Actions */}
        {prediction?.next_best_actions && prediction.next_best_actions.length > 0 && (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-700">🎯 Actions recommandées</p>
            <ul className="mt-2 space-y-2">
              {prediction.next_best_actions.map((action, idx) => (
                <li key={idx} className="text-xs text-green-600">
                  <span className="font-medium">{action.action}</span>
                  <p className="text-green-500 mt-0.5">{action.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions recommandées pour faible probabilité */}
        {(prediction?.renewal_probability ?? 85) < 70 && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm font-medium text-amber-700 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Action recommandée
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Contacter le client dans les 48h pour proposer une offre personnalisée
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> Appeler
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> Envoyer offre
              </Button>
              <Button size="sm" variant="outline" onClick={onScheduleReminder}>
                <Calendar className="w-3 h-3" /> Planifier
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}