// src/modules/monetization/pricing/BrokerSubscription.tsx
// Abonnement courtier
// <140 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { apiClient } from '@/modules/api/client/client';

// Icônes
import { CreditCard, Zap, CheckCircle, AlertCircle, Calendar, DollarSign, Crown } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}

export const BrokerSubscription = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [plansRes, subscriptionRes] = await Promise.all([
        apiClient.get('/ia/monetization/plans'),
        apiClient.get('/ia/monetization/current'),
      ]);
      setPlans((plansRes as any).data || [
        { id: 'free', name: 'Standard', price: 0, credits: 10, features: ['10 analyses/mois', 'Support email'] },
        { id: 'pro', name: 'IA Pro', price: 49, credits: 500, features: ['500 analyses/mois', 'Support prioritaire', 'API accessible'], popular: true },
        { id: 'enterprise', name: 'Enterprise', price: 199, credits: 5000, features: ['5000 analyses/mois', 'Support dédié', 'API illimitée'] },
      ]);
      setCurrentPlan((subscriptionRes as any).data?.planId || 'free');
    } catch (error) {
      console.error('Failed to load subscription data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);
    try {
      const response = await apiClient.post('/ia/monetization/subscribe', { planId });
      if ((response as any).success) {
        setCurrentPlan(planId);
        alert('Abonnement mis à jour avec succès !');
      }
    } catch (error) {
      console.error('Subscription failed', error);
      alert("Erreur lors de l'abonnement");
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Chargement des offres..." />
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Choisissez votre offre IA</h2>
        <p className="text-gray-500 mt-1">Passez au palier IA pour débloquer toutes les fonctionnalités</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isSelected = selectedPlan === plan.id;
          
          return (
            <Card key={plan.id} className={`relative transition-all ${plan.popular ? 'border-2 border-purple-500 shadow-lg' : ''} ${isCurrent ? 'ring-2 ring-green-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white text-xs rounded-full">
                  Populaire
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  Actuel
                </div>
              )}
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {plan.price === 0 ? <Crown className="w-8 h-8 text-gray-400" /> : <Zap className="w-8 h-8 text-purple-600" />}
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-3xl font-bold mt-2">{plan.price}€</p>
                <p className="text-sm text-gray-500">/mois</p>
                <p className="text-sm text-purple-600 mt-1">{plan.credits} crédits/mois</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrent || isProcessing}
                  variant={plan.price === 0 ? 'outline' : 'primary'}
                  fullWidth
                >
                  {isSelected ? <LoadingSpinner size="sm" /> : plan.price === 0 ? 'Actuel' : isCurrent ? 'Actif' : 'Souscrire'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 bg-blue-50">
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Paiement sécurisé</p>
              <p className="text-sm text-blue-600">Facturation mensuelle sans engagement</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Voir historique
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrokerSubscription;