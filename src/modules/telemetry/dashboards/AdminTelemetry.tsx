// src/modules/telemetry/dashboards/AdminTelemetry.tsx
// Dashboard de télémétrie pour l'administrateur
// <160 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { costCollector, CostSummary } from '../collectors/costCollector';
import { latencyCollector, LatencySummary } from '../collectors/latencyCollector';

// Icônes
import { TrendingUp, DollarSign, Clock, Activity, AlertTriangle, RefreshCw, Download } from 'lucide-react';

export const AdminTelemetry = () => {
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null);
  const [latencySummary, setLatencySummary] = useState<LatencySummary | null>(null);
  const [costByEndpoint, setCostByEndpoint] = useState<Record<string, number>>({});
  const [latencyByEndpoint, setLatencyByEndpoint] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [periodDays, setPeriodDays] = useState(30);

  useEffect(() => {
    loadData();
  }, [periodDays]);

  const loadData = () => {
    setIsLoading(true);
    
    const cost = costCollector.getSummary(undefined, periodDays);
    const latency = latencyCollector.getSummary(undefined, periodDays);
    const costEndpoints = costCollector.getCostByEndpoint();
    const latencyEndpoints = latencyCollector.getAverageLatencyByEndpoint();
    
    setCostSummary(cost);
    setLatencySummary(latency);
    setCostByEndpoint(costEndpoints);
    setLatencyByEndpoint(latencyEndpoints);
    
    setIsLoading(false);
  };

  const handleExport = () => {
    const data = {
      costSummary,
      latencySummary,
      costByEndpoint,
      latencyByEndpoint,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Chargement des métriques..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Télémétrie IA</h2>
        <div className="flex gap-2">
          <select
            value={periodDays}
            onChange={(e) => setPeriodDays(Number(e.target.value))}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            <option value={7}>7 jours</option>
            <option value={30}>30 jours</option>
            <option value={90}>90 jours</option>
          </select>
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Cartes principales */}
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
                <p className="text-sm text-gray-500">Taux succès</p>
                <p className="text-2xl font-bold text-green-600">
                  {latencySummary?.successRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails des coûts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              Coût par endpoint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(costByEndpoint).map(([endpoint, cost]) => (
                <div key={endpoint}>
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-xs truncate">{endpoint}</span>
                    <span className="font-medium">{cost.toFixed(4)} €</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-purple-500 rounded-full h-1.5"
                      style={{ width: `${Math.min((cost / (costSummary?.totalCost || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {Object.keys(costByEndpoint).length === 0 && (
                <p className="text-center text-gray-500 py-4">Aucune donnée disponible</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Latence par endpoint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(latencyByEndpoint).map(([endpoint, latency]) => (
                <div key={endpoint}>
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-xs truncate">{endpoint}</span>
                    <span className="font-medium">{latency.toFixed(0)} ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-blue-500 rounded-full h-1.5"
                      style={{ width: `${Math.min((latency / 5000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {Object.keys(latencyByEndpoint).length === 0 && (
                <p className="text-center text-gray-500 py-4">Aucune donnée disponible</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métriques supplémentaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Métriques détaillées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">P95 Latence</p>
              <p className="text-lg font-semibold">{latencySummary?.p95Latency.toFixed(0)} ms</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">P99 Latence</p>
              <p className="text-lg font-semibold">{latencySummary?.p99Latency.toFixed(0)} ms</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total tokens</p>
              <p className="text-lg font-semibold">{costSummary?.totalTokens.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Coût moyen/appel</p>
              <p className="text-lg font-semibold">{costSummary?.averageCostPerCall.toFixed(4)} €</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTelemetry;