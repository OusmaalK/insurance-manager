// src/modules/ia-core/components/IACreditBalance.tsx
// Version corrigée
// <110 lignes

'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useIAMonetization } from '../hooks/useIAMonetization';

// Icônes
import { Coins, TrendingUp, CreditCard, AlertCircle, Zap } from 'lucide-react';

interface IACreditBalanceProps {
  showUpgradeButton?: boolean;
  onUpgradeClick?: () => void;
}

export const IACreditBalance = ({ showUpgradeButton = true, onUpgradeClick }: IACreditBalanceProps) => {
  const { state, isLoading, loadUsage } = useIAMonetization();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    loadUsage();
  }, []);

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

  return (
    // ✅ Envelopper avec un div pour gérer les événements
    <div
      className="transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`${isHovered ? 'shadow-md' : ''}`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${state.tier === 'IA' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                {state.tier === 'IA' ? <Zap className="w-4 h-4 text-purple-600" /> : <Coins className="w-4 h-4 text-gray-600" />}
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  {state.tier === 'IA' ? 'Crédits IA' : 'Crédits gratuits'}
                </p>
                <p className={`text-lg font-bold ${state.tier === 'IA' ? 'text-purple-600' : 'text-gray-800'}`}>
                  {state.creditsRemaining} / {state.totalCredits}
                </p>
              </div>
            </div>

            {showUpgradeButton && state.tier !== 'IA' && (
              <Button
                size="sm"
                variant="outline"
                onClick={onUpgradeClick}
                className="text-xs"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Upgrade
              </Button>
            )}

            {state.tier === 'IA' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onUpgradeClick}
                className="text-xs"
              >
                <CreditCard className="w-3 h-3 mr-1" />
                Recharger
              </Button>
            )}
          </div>

          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`rounded-full h-1.5 ${isCritical ? 'bg-red-500' : isLow ? 'bg-yellow-500' : state.tier === 'IA' ? 'bg-purple-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            {isCritical && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Crédits presque épuisés
              </p>
            )}
            {isLow && !isCritical && state.tier !== 'IA' && (
              <p className="text-xs text-yellow-500 mt-1">
                Plus que {state.creditsRemaining} crédits ce mois
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IACreditBalance;