// src/modules/monetization/usage/IACreditMeter.tsx
// Compteur de crédits IA
// <120 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { apiClient } from '@/modules/api/client/client';
import { useIAMonetization } from '@/modules/ia-core/hooks/useIAMonetization';

// Icônes
import { Zap, TrendingUp, AlertCircle, RefreshCw, CreditCard } from 'lucide-react';

interface IACreditMeterProps {
  showCompact?: boolean;
  onUpgrade?: () => void;
}

export const IACreditMeter = ({ showCompact = false, onUpgrade }: IACreditMeterProps) => {
  const { state, isLoading, loadUsage, canUseIA } = useIAMonetization();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadUsage();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUsage();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-3 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </CardContent>
      </Card>
    );
  }

  if (!state) return null;

  const percentage = (state.creditsRemaining / state.totalCredits) * 100;
  const isLow = percentage < 20;
  const isCritical = percentage < 5;

  if (showCompact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium">{state.creditsRemaining}</span>
          <span className="text-xs text-gray-500">/{state.totalCredits}</span>
        </div>
        {isCritical && <AlertCircle className="w-4 h-4 text-red-500" />}
        <button onClick={handleRefresh} className="text-gray-400 hover:text-gray-600">
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
        {state.tier !== 'IA' && onUpgrade && (
          <Button size="sm" variant="ghost" onClick={onUpgrade} className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Upgrade
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="font-semibold">Crédits IA</span>
            {state.tier === 'IA' && <span className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">Premium</span>}
          </div>
          <button onClick={handleRefresh} className="text-gray-400 hover:text-gray-600">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Crédits restants</span>
            <span className="font-medium">{state.creditsRemaining} / {state.totalCredits}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`rounded-full h-2 ${isCritical ? 'bg-red-500' : isLow ? 'bg-yellow-500' : 'bg-purple-600'}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
          <div>Appels ce mois: {state.callsThisMonth}</div>
          <div className="text-right">Limite: {state.limit}</div>
        </div>

        {isCritical && (
          <div className="p-2 bg-red-50 rounded-lg flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-xs text-red-600">Crédits presque épuisés</p>
          </div>
        )}

        {isLow && !isCritical && state.tier !== 'IA' && (
          <div className="p-2 bg-yellow-50 rounded-lg flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <p className="text-xs text-yellow-600">Plus que {state.creditsRemaining} crédits ce mois</p>
          </div>
        )}

        {state.tier !== 'IA' && onUpgrade && (
          <Button onClick={onUpgrade} variant="primary" size="sm" fullWidth>
            <CreditCard className="w-4 h-4 mr-2" />
            Passer au palier IA
          </Button>
        )}

        {state.tier === 'IA' && (
          <Button onClick={onUpgrade} variant="outline" size="sm" fullWidth>
            <CreditCard className="w-4 h-4 mr-2" />
            Recharger des crédits
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default IACreditMeter;