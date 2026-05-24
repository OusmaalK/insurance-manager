// src/modules/ia-core/components/IAPalierSwitch.tsx
// Switch pour basculer entre palier Standard et IA
// <110 lignes

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useIAMonetization } from '../hooks/useIAMonetization';

// Icônes
import { Zap, Sparkles, Crown, CreditCard, TrendingUp, Shield } from 'lucide-react';

interface IAPalierSwitchProps {
  onTierChange?: (tier: 'STANDARD' | 'IA') => void;
}

export const IAPalierSwitch = ({ onTierChange }: IAPalierSwitchProps) => {
  const { state, isLoading, upgradeToIA, getPricingPlans, loadUsage } = useIAMonetization();
  const [showPlans, setShowPlans] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);

  React.useEffect(() => {
    loadUsage();
    getPricingPlans().then(setPlans);
  }, []);

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true);
    const success = await upgradeToIA(planId);
    if (success) {
      onTierChange?.('IA');
      setShowPlans(false);
    }
    setIsUpgrading(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <LoadingSpinner size="md" text="Chargement..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {state?.tier === 'IA' ? <Sparkles className="w-5 h-5 text-purple-600" /> : <Zap className="w-5 h-5 text-gray-600" />}
          Palier IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state?.tier === 'IA' ? (
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-purple-800">Palier IA Actif</p>
                <p className="text-sm text-purple-600">Crédits restants: {state.creditsRemaining} / {state.totalCredits}</p>
              </div>
              <Crown className="w-8 h-8 text-purple-500" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 rounded-full h-2"
                style={{ width: `${(state.creditsRemaining / state.totalCredits) * 100}%` }}
              />
            </div>
            <Button variant="outline" size="sm" fullWidth>
              <CreditCard className="w-4 h-4 mr-2" />
              Recharger des crédits
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Crédits restants ce mois</span>
                <span className="font-bold">{state?.creditsRemaining || 0}/{state?.limit || 10}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 rounded-full h-2"
                  style={{ width: `${((state?.creditsRemaining || 0) / (state?.limit || 10)) * 100}%` }}
                />
              </div>
            </div>
            {!showPlans ? (
              <Button onClick={() => setShowPlans(true)} variant="primary" fullWidth>
                <TrendingUp className="w-4 h-4 mr-2" />
                Passer au palier IA
              </Button>
            ) : (
              <div className="space-y-3">
                {plans.map((plan) => (
                  <div key={plan.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{plan.name}</h4>
                        <p className="text-xs text-gray-500">{plan.credits} crédits/mois</p>
                        <ul className="mt-1 text-xs text-gray-600">
                          {plan.features.slice(0, 2).map((f: string, i: number) => (
                            <li key={i}>✓ {f}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{plan.price}€</p>
                        <p className="text-xs text-gray-500">/mois</p>
                        <Button
                          size="sm"
                          variant="primary"
                          className="mt-2"
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isUpgrading}
                        >
                          {isUpgrading ? <LoadingSpinner size="sm" /> : 'Choisir'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={() => setShowPlans(false)} fullWidth>
                  Annuler
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IAPalierSwitch;