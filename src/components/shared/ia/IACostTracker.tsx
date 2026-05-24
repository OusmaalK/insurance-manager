// src/components/shared/ia/IACostTracker.tsx
// Tracker de coûts IA
// <120 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { DollarSign, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import { costCollector } from '@/modules/telemetry/collectors/costCollector';
import { useAuth } from '@/hooks/useAuth';

interface IACostTrackerProps {
  compact?: boolean;
  showDetails?: boolean;
}

export const IACostTracker = ({ compact = false, showDetails = false }: IACostTrackerProps) => {
  const { user } = useAuth();
  const [costSummary, setCostSummary] = useState<any>(null);
  const [costByEndpoint, setCostByEndpoint] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = () => {
    setIsLoading(true);
    const userId = user?.role === 'ADMIN' ? undefined : user?.id;
    const summary = costCollector.getSummary(userId, 30);
    const byEndpoint = costCollector.getCostByEndpoint(userId);
    setCostSummary(summary);
    setCostByEndpoint(byEndpoint);
    setIsLoading(false);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <DollarSign className="w-4 h-4 text-gray-400" />
        <span className="font-medium">{costSummary?.totalCost.toFixed(2)} €</span>
        <span className="text-gray-400">/ mois</span>
        <button onClick={loadData} className="text-gray-400 hover:text-gray-600">
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <div className="animate-pulse">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            Coûts IA
          </CardTitle>
          <Button onClick={loadData} variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Coût total</p>
            <p className="text-xl font-bold text-purple-600">{costSummary?.totalCost.toFixed(2)} €</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Appels IA</p>
            <p className="text-xl font-bold">{costSummary?.callsCount}</p>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Coût par endpoint</p>
            <div className="space-y-2">
              {Object.entries(costByEndpoint).slice(0, 5).map(([endpoint, cost]) => (
                <div key={endpoint}>
                  <div className="flex justify-between text-xs">
                    <span className="font-mono truncate">{endpoint.split('/').pop()}</span>
                    <span>{cost.toFixed(4)} €</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div className="bg-purple-500 rounded-full h-1" style={{ width: `${(cost / (costSummary?.totalCost || 1)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {costSummary?.totalCost > 10 && (
          <div className="mt-3 p-2 bg-yellow-50 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <p className="text-xs text-yellow-700">Coût élevé ce mois-ci</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IACostTracker;