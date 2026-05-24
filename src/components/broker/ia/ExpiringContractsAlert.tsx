// src/components/broker/ia/ExpiringContractsAlert.tsx
// Alerte contrats expirants IA (Courtier) - Version corrigée
// <120 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { usePolicies } from '@/hooks/usePolicies';
import { useIA } from '@/hooks/useIA';

// Icônes
import { Calendar, AlertTriangle, Bell, Send, FileText, TrendingUp, Clock } from 'lucide-react';

interface ExpiringContractsAlertProps {
  daysThreshold?: number;
  limit?: number;
}

export const ExpiringContractsAlert = ({ daysThreshold = 30, limit = 5 }: ExpiringContractsAlertProps) => {
  const router = useRouter();
  const { getExpiringPolicies, predictRenewal } = usePolicies();
  
  const [expiringPolicies, setExpiringPolicies] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<Map<number, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [daysThreshold]);

  const loadData = async () => {
    setIsLoading(true);
    const policies = await getExpiringPolicies(daysThreshold);
    if (policies) {
      setExpiringPolicies(policies.slice(0, limit));
      
      const preds = new Map();
      for (const item of policies.slice(0, limit)) {
        const prediction = await predictRenewal(item.policy.id);
        if (prediction) preds.set(item.policy.id, prediction);
      }
      setPredictions(preds);
    }
    setIsLoading(false);
  };

  const handleSendReminder = (policyId: number) => {
    alert(`Relance envoyée pour le contrat #${policyId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <LoadingSpinner size="md" text="Chargement des échéances..." />
        </CardContent>
      </Card>
    );
  }

  if (expiringPolicies.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Aucun contrat expirant dans les {daysThreshold} jours</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          Contrats bientôt expirés
          <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
            {expiringPolicies.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expiringPolicies.map((item) => {
            const prediction = predictions.get(item.policy.id);
            const isHighRisk = prediction?.risk_level === 'HIGH' || prediction?.renewal_probability < 40;
            
            return (
              <div
                key={item.policy.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isHighRisk ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => router.push(`/broker/policies/${item.policy.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{item.policy.policy_number}</p>
                    <p className="text-sm text-gray-500">{item.policy.insurer}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">
                        Expire dans {item.days_until_expiry} jours
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {prediction && (
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        prediction.renewal_probability >= 70 ? 'bg-green-100 text-green-700' :
                        prediction.renewal_probability >= 40 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {prediction.renewal_probability}%
                      </div>
                    )}
                  </div>
                </div>
                {prediction?.suggested_action && (
                  <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {prediction.suggested_action}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/broker/policies/${item.policy.id}`); }}>
                    <FileText className="w-3 h-3 mr-1" />
                    Détails
                  </Button>
                  <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); handleSendReminder(item.policy.id); }}>
                    <Send className="w-3 h-3 mr-1" />
                    Relancer
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpiringContractsAlert;