// src/app/(broker)/commissions/page.tsx
// Commissions et prévisions (Courtier)
// <150 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { usePolicies } from '@/hooks/usePolicies';
import { useIA } from '@/hooks/useIA';

// Icônes
import { DollarSign, TrendingUp, Calendar, Download, PieChart, ArrowUp, ArrowDown } from 'lucide-react';

export default function BrokerCommissionsPage() {
  const { policies, isLoading: policiesLoading, fetchPolicies } = usePolicies({ autoFetch: false });
  const { predictPolicyRenewal } = useIA();
  const [commissionData, setCommissionData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const COMMISSION_RATE = 0.15; // 15% de commission

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    await fetchPolicies({ status: 'ACTIVE' });
    
    // Calculer les commissions
    const activePolicies = policies.filter(p => p.status === 'ACTIVE');
    const totalPremium = activePolicies.reduce((sum, p) => sum + (p.premium_amount || 0), 0);
    const totalCommission = totalPremium * COMMISSION_RATE;
    
    // Commissions par assureur
    const byInsurer: Record<string, number> = {};
    activePolicies.forEach(p => {
      byInsurer[p.insurer] = (byInsurer[p.insurer] || 0) + (p.premium_amount * COMMISSION_RATE);
    });
    
    setCommissionData({
      totalPremium,
      totalCommission,
      byInsurer,
      policyCount: activePolicies.length
    });
    
    // Prédictions pour les renouvellements
    const forecasts = [];
    for (const policy of activePolicies) {
      const prediction = await predictPolicyRenewal(policy.id);
      if (prediction && prediction.renewal_probability > 50) {
        forecasts.push({
          ...policy,
          renewalProbability: prediction.renewal_probability,
          expectedCommission: policy.premium_amount * COMMISSION_RATE
        });
      }
    }
    
    const expectedTotal = forecasts.reduce((sum, f) => sum + f.expectedCommission, 0);
    setForecastData({
      policies: forecasts,
      expectedTotal,
      count: forecasts.length
    });
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Chargement des commissions..." />
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Commissions</h1>
            <p className="text-gray-500 mt-1">Suivez vos revenus et prévisions</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Cartes principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Commission totale</p>
                  <p className="text-2xl font-bold text-green-600">
                    {commissionData?.totalCommission.toLocaleString()} €
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Prime totale gérée</p>
                  <p className="text-2xl font-bold">
                    {commissionData?.totalPremium.toLocaleString()} €
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Contrats actifs</p>
                  <p className="text-2xl font-bold">{commissionData?.policyCount}</p>
                </div>
                <PieChart className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prévisions IA */}
        {forecastData && forecastData.count > 0 && (
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Prévisions IA - Commissions à venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-500">Commission estimée</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {forecastData.expectedTotal.toLocaleString()} €
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-500">Contrats à renouveler</p>
                  <p className="text-2xl font-bold text-purple-700">{forecastData.count}</p>
                </div>
              </div>
              <div className="space-y-2">
                {forecastData.policies.slice(0, 5).map((policy: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{policy.policy_number}</p>
                      <p className="text-xs text-gray-500">{policy.insurer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {policy.expectedCommission.toLocaleString()} €
                      </p>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">{policy.renewalProbability}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Commissions par assureur */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par assureur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commissionData && Object.entries(commissionData.byInsurer).map(([insurer, amount]) => (
                <div key={insurer}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{insurer}</span>
                    <span className="font-medium">{(amount as number).toLocaleString()} €</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2"
                      style={{ width: `${((amount as number) / commissionData.totalCommission) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Historique mensuel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              Évolution mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Graphique des commissions à venir</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </BrokerLayout>
  );
}