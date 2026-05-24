// src/components/broker/ia/CommissionForecast.tsx
// Prévisions de commissions IA (Courtier)
// <130 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { usePolicies } from '@/hooks/usePolicies';
import { useIA } from '@/hooks/useIA';

// Icônes
import { DollarSign, TrendingUp, Calendar, Download, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';

interface CommissionForecastProps {
  companyId?: number;
}

export const CommissionForecast = ({ companyId }: CommissionForecastProps) => {
  const { policies, isLoading: policiesLoading, fetchPolicies } = usePolicies({ autoFetch: false });
  const { predictPolicyRenewal } = useIA();
  
  const [forecast, setForecast] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('MONTHLY');

  const COMMISSION_RATE = 0.15;

  useEffect(() => {
    loadData();
  }, [companyId, period]);

  const loadData = async () => {
    setIsLoading(true);
    await fetchPolicies({ company_id: companyId, status: 'ACTIVE' });
    
    const activePolicies = policies.filter(p => p.status === 'ACTIVE');
    const currentCommissions = activePolicies.reduce((sum, p) => sum + (p.premium_amount * COMMISSION_RATE), 0);
    
    // Calculer les prévisions
    let expectedCommissions = 0;
    let highProbabilityCount = 0;
    let mediumProbabilityCount = 0;
    let lowProbabilityCount = 0;
    
    for (const policy of activePolicies) {
      const prediction = await predictPolicyRenewal(policy.id);
      if (prediction) {
        const proba = prediction.renewal_probability;
        expectedCommissions += policy.premium_amount * COMMISSION_RATE * (proba / 100);
        if (proba >= 70) highProbabilityCount++;
        else if (proba >= 40) mediumProbabilityCount++;
        else lowProbabilityCount++;
      } else {
        expectedCommissions += policy.premium_amount * COMMISSION_RATE * 0.5;
      }
    }
    
    setForecast({
      current: currentCommissions,
      expected: expectedCommissions,
      potential: expectedCommissions * 1.2,
      highProbabilityCount,
      mediumProbabilityCount,
      lowProbabilityCount,
      totalPolicies: activePolicies.length,
    });
    
    setIsLoading(false);
  };

  if (isLoading || policiesLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <LoadingSpinner size="lg" text="Calcul des prévisions..." />
        </CardContent>
      </Card>
    );
  }

  if (!forecast) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Prévisions commissions
          </CardTitle>
          <div className="flex gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-2 py-1 text-sm border rounded-lg"
            >
              <option value="MONTHLY">Mensuel</option>
              <option value="QUARTERLY">Trimestriel</option>
              <option value="YEARLY">Annuel</option>
            </select>
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-500">Commissions actuelles</p>
            <p className="text-2xl font-bold text-green-600">
              {forecast.current.toLocaleString()} €
            </p>
            <p className="text-xs text-gray-400">{period.toLowerCase()}</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500">Prévision IA</p>
            <p className="text-2xl font-bold text-blue-600">
              {forecast.expected.toLocaleString()} €
            </p>
            <p className="text-xs text-green-600">
              +{((forecast.expected - forecast.current) / forecast.current * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-gray-500">Potentiel max</p>
            <p className="text-2xl font-bold text-purple-600">
              {forecast.potential.toLocaleString()} €
            </p>
            <p className="text-xs text-green-600">
              +{((forecast.potential - forecast.current) / forecast.current * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Distribution des renouvellements</p>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm">
                <span>Haute probabilité (&gt;70%)</span>
                <span>{forecast.highProbabilityCount} contrats</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 rounded-full h-2"
                  style={{ width: `${(forecast.highProbabilityCount / forecast.totalPolicies) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Probabilité moyenne (40-70%)</span>
                <span>{forecast.mediumProbabilityCount} contrats</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 rounded-full h-2"
                  style={{ width: `${(forecast.mediumProbabilityCount / forecast.totalPolicies) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Faible probabilité (&lt;40%)</span>
                <span>{forecast.lowProbabilityCount} contrats</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 rounded-full h-2"
                  style={{ width: `${(forecast.lowProbabilityCount / forecast.totalPolicies) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionForecast;