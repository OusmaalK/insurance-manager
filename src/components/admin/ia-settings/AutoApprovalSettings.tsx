// src/components/admin/ia-settings/AutoApprovalSettings.tsx
'use client';

import { useState } from 'react';
import { Zap, DollarSign, TrendingUp, Shield, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useIASettingsStore } from '@/stores/iaSettingsStore';

export const AutoApprovalSettings = () => {
  const { settings, updateField, updateSection } = useIASettingsStore();
  const autoApproval = settings?.autoApproval;
  const claimTypes = ['AUTO', 'HOME', 'HEALTH', 'LIABILITY', 'CATASTROPHE', 'FRAUDE'];

  const handleChange = (field: string, value: any) => {
    updateField('autoApproval', field, value);
  };

  const toggleExcludedType = (type: string) => {
    const currentExcluded = autoApproval?.excludedClaimTypes || [];
    const newExcluded = currentExcluded.includes(type)
      ? currentExcluded.filter((t: string) => t !== type)
      : [...currentExcluded, type];
    updateField('autoApproval', 'excludedClaimTypes', newExcluded);
  };

  if (!autoApproval) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-500" />
          Auto-approbation IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Activation */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Activer l'auto-approbation</p>
            <p className="text-sm text-gray-500">Approbation automatique des sinistres simples</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoApproval.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* Montant max */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Montant maximum: {autoApproval.maxAmount.toLocaleString()} €
          </label>
          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            value={autoApproval.maxAmount}
            onChange={(e) => handleChange('maxAmount', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0€</span>
            <span>10k€</span>
            <span>20k€</span>
            <span>30k€</span>
            <span>40k€</span>
            <span>50k€</span>
          </div>
        </div>

        {/* Score de confiance */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Score de confiance minimum: {autoApproval.minConfidenceScore}%
          </label>
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={autoApproval.minConfidenceScore}
            onChange={(e) => handleChange('minConfidenceScore', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Types exclus */}
        <div>
          <label className="block text-sm font-medium mb-2">Types de sinistres exclus</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {claimTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={autoApproval.excludedClaimTypes?.includes(type)}
                  onChange={() => toggleExcludedType(type)}
                  className="w-4 h-4 accent-red-500"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Deuxième relecture */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Exiger une deuxième relecture</p>
            <p className="text-sm text-gray-500">Pour les sinistres dépassant le seuil</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoApproval.requireSecondReview}
              onChange={(e) => handleChange('requireSecondReview', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        {/* Seuil deuxième relecture */}
        {autoApproval.requireSecondReview && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Seuil deuxième relecture: {autoApproval.secondReviewThreshold.toLocaleString()} €
            </label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={autoApproval.secondReviewThreshold}
              onChange={(e) => handleChange('secondReviewThreshold', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoApprovalSettings;