// src/app/(broker)/policies/expiring/page.tsx
// Contrats expirant bientôt (Courtier)
// <140 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { usePolicies } from '@/hooks/usePolicies';
import { useIA } from '@/hooks/useIA';

// Icônes
import { Calendar, AlertTriangle, Bell, Send, TrendingUp, CheckCircle, FileText, Clock } from 'lucide-react';

export default function ExpiringPoliciesPage() {
  const router = useRouter();
  const { getExpiringPolicies, predictRenewal } = usePolicies();
  const { predictPolicyRenewal } = useIA();
  
  const [expiringPolicies, setExpiringPolicies] = useState<any[]>([]);
  const [renewalPredictions, setRenewalPredictions] = useState<Map<number, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [daysThreshold, setDaysThreshold] = useState(30);

  useEffect(() => {
    loadData();
  }, [daysThreshold]);

  const loadData = async () => {
    setIsLoading(true);
    const policies = await getExpiringPolicies(daysThreshold);
    if (policies) setExpiringPolicies(policies);
    
    const predictions = new Map();
    for (const item of policies || []) {
      const prediction = await predictPolicyRenewal(item.policy.id);
      if (prediction) predictions.set(item.policy.id, prediction);
    }
    setRenewalPredictions(predictions);
    setIsLoading(false);
  };

  const handleSendReminder = (policyId: number) => {
    alert(`Relance envoyée pour le contrat #${policyId}`);
  };

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Chargement des échéances..." />
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h1 className="text-2xl font-bold text-gray-900">Échéances à venir</h1><p className="text-gray-500 mt-1">Contrats expirant dans les {daysThreshold} jours</p></div>
          <div className="flex gap-2"><button onClick={() => setDaysThreshold(15)} className={`px-3 py-1 text-sm rounded-full ${daysThreshold === 15 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>15j</button>
          <button onClick={() => setDaysThreshold(30)} className={`px-3 py-1 text-sm rounded-full ${daysThreshold === 30 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>30j</button>
          <button onClick={() => setDaysThreshold(60)} className={`px-3 py-1 text-sm rounded-full ${daysThreshold === 60 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>60j</button></div>
        </div>

        {expiringPolicies.length === 0 ? (
          <Card><CardContent className="text-center py-12"><CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" /><p className="text-gray-500">Aucun contrat expirant dans les {daysThreshold} jours</p></CardContent></Card>
        ) : (
          <div className="space-y-3">
            {expiringPolicies.map((item) => {
              const prediction = renewalPredictions.get(item.policy.id);
              const isHighRisk = prediction?.risk_level === 'HIGH' || prediction?.renewal_probability < 40;
              
              return (
                <Card key={item.policy.id} className={`hover:shadow-md transition-shadow ${isHighRisk ? 'border-l-4 border-l-red-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{item.policy.policy_number}</h3>
                          <span className="text-xs text-gray-500">{item.policy.insurer}</span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1"><Clock className="w-3 h-3" />J-{item.days_until_expiry}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Client: {item.clientName || `#${item.policy.company_id}`}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">Prime: {item.policy.premium_amount?.toLocaleString()} €</span>
                          {prediction && (<span className={`text-sm ${prediction.renewal_probability >= 70 ? 'text-green-600' : prediction.renewal_probability >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>Renouvellement: {prediction.renewal_probability}%</span>)}
                        </div>
                        {prediction?.suggested_action && (<p className="text-xs text-blue-600 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{prediction.suggested_action}</p>)}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/broker/policies/${item.policy.id}`)}><FileText className="w-4 h-4 mr-1" />Détails</Button>
                        <Button variant="primary" size="sm" onClick={() => handleSendReminder(item.policy.id)}><Send className="w-4 h-4 mr-1" />Relancer</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-blue-600" />Alertes automatiques</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-gray-700">Activez les rappels automatiques pour ne jamais manquer une échéance importante. L'IA peut également vous suggérer les meilleurs moments pour relancer vos clients.</p><Button variant="outline" size="sm" className="mt-3">Configurer les alertes</Button></CardContent>
        </Card>
      </div>
    </BrokerLayout>
  );
}