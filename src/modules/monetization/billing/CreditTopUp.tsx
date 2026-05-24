// src/modules/monetization/billing/CreditTopUp.tsx
// Version corrigée
// <140 lignes

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { apiClient } from '@/modules/api/client/client';

// Icônes
import { CreditCard, Zap, Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface CreditPack {
  id: string;
  credits: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}

export const CreditTopUp = () => {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const creditPacks: CreditPack[] = [
    { id: 'pack1', credits: 50, price: 9.90, bonus: 0 },
    { id: 'pack2', credits: 100, price: 18.90, bonus: 10, popular: true },
    { id: 'pack3', credits: 250, price: 44.90, bonus: 30 },
    { id: 'pack4', credits: 500, price: 84.90, bonus: 75 },
    { id: 'pack5', credits: 1000, price: 159.90, bonus: 200 },
  ];

  const handlePurchase = async (pack: CreditPack) => {
    setSelectedPack(pack.id);
    setIsProcessing(true);
    try {
      const response = await apiClient.post('/ia/monetization/topup', {
        credits: pack.credits,
        price: pack.price,
      });
      if ((response as any).success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Purchase failed', error);
      alert("Erreur lors de l'achat");
    } finally {
      setIsProcessing(false);
      setSelectedPack(null);
    }
  };

  const getPricePerCredit = (credits: number, price: number): number => {
    return price / credits;
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recharger mes crédits IA</h2>
        <p className="text-sm text-gray-500 mt-1">Achetez des crédits supplémentaires à la demande</p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-600">Achat effectué avec succès !</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {creditPacks.map((pack) => (
          // ✅ Envelopper avec un div pour gérer le onClick
          <div
            key={pack.id}
            className="cursor-pointer"
            onClick={() => handlePurchase(pack)}
          >
            <Card className={`relative transition-all hover:shadow-md ${selectedPack === pack.id ? 'ring-2 ring-purple-500' : ''}`}>
              {pack.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                  Populaire
                </div>
              )}
              <CardContent className="p-3">
                <Package className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xl font-bold">{pack.credits}</p>
                <p className="text-xs text-gray-500">crédits</p>
                {pack.bonus && <p className="text-xs text-green-600">+{pack.bonus} bonus</p>}
                <p className="text-lg font-bold text-purple-600 mt-1">{pack.price}€</p>
                <p className="text-xs text-gray-400">{getPricePerCredit(pack.credits, pack.price).toFixed(2)}€/crédit</p>
                {selectedPack === pack.id && isProcessing && (
                  <div className="mt-2 flex justify-center">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Card className="mt-6 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Informations</p>
              <p className="text-xs text-blue-600 mt-1">
                Les crédits sont valables 12 mois et sont utilisés pour toutes les analyses IA.
                Les crédits bonus sont offerts et utilisés en premier.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditTopUp;