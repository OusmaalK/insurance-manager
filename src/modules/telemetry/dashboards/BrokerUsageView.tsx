// src/modules/telemetry/dashboards/BrokerUsageView.tsx
// Vue d'utilisation IA pour le courtier
// <120 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { costCollector, CostSummary } from '../collectors/costCollector';
import { latencyCollector, LatencySummary } from '../collectors/latencyCollector';

// Icônes
import { TrendingUp, DollarSign, Clock, Activity, Sparkles, BarChart3, RefreshCw } from 'lucide-react';

export const BrokerUsageView = () => {
  const { user } = useAuth();
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null);
  const [latencySummary, setLatencySummary] = useState<LatencySummary | null>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [periodDays, setPeriodDays] = useState(30);

  useEffect(() => {
    loadData();
  }, [periodDays, user?.id]);

  const loadData = () => {
    setIsLoading(true);
    
    const userId = user?.id;
    const cost = costCollector.getSummary(userId, periodDays);
    const latency = latencyCollector.getSummary(userId, periodDays);
    const activities = costCollector.getEntries({ userId, startDate: new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString() });
    
    setCostSummary(cost);
    setLatencySummary(latency);
    setRecentActivities(activities.slice(0, 10));
    
    setIsLoading(false);
  };

  // Calcul du crédit restant (simulation)
  const monthlyLimit = 1000; // €
  const usedThisMonth = costSummary?.totalCost || 0;
  const remainingCredit = Math.max(0, monthlyLimit - usedThisMonth);
  const usagePercentage = (usedThisMonth / monthlyLimit) * 100;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Chargement de votre utilisation..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Mon utilisation IA</h2>
          <p className="text-sm text-gray-500">Suivez votre consommation des services IA</p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Cartes d'utilisation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Coût total</p>
                <p className="text-2xl font-bold text-purple-600">
                  {costSummary?.totalCost.toFixed(4)} €
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Appels IA</p>
                <p className="text-2xl font-bold text-blue-600">
                  {costSummary?.callsCount || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Latence moyenne</p>
                <p className="text-2xl font-bold text-green-600">
                  {latencySummary?.averageLatency.toFixed(0)} ms
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Crédit restant</p>
                <p className="text-2xl font-bold text-orange-600">
                  {remainingCredit.toFixed(2)} €
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jauge de crédit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Utilisation du crédit IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Utilisé: {usedThisMonth.toFixed(2)} € / {monthlyLimit} €</span>
              <span>{usagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`rounded-full h-3 ${usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            {usagePercentage > 80 && (
              <p className="text-xs text-red-500 mt-2">
                ⚠️ Vous approchez de votre limite mensuelle
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-600" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Aucune activité récente</p>
          ) : (
            <div className="space-y-2">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{activity.endpoint}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-purple-600">{activity.cost.toFixed(4)} €</p>
                    <p className="text-xs text-gray-400">{activity.tokensUsed} tokens</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Métriques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Latence P95</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{latencySummary?.p95Latency.toFixed(0)} ms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Taux de succès</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{latencySummary?.successRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrokerUsageView;