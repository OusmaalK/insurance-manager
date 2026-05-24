// src/components/admin/settings/BillingSettings.tsx
'use client';

import { useState } from 'react';
import { Save, CreditCard, Calendar, Download, Crown, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useSettings } from '@/hooks/useSettings';
import { PLANS } from '@/types/settings.types';

export const BillingSettings = () => {
  const { billing, updateBilling, isLoading } = useSettings();
  const [formData, setFormData] = useState(billing);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    await updateBilling(formData);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChange = (field: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleUpgrade = (plan: string) => {
    console.log('Upgrade to:', plan);
    setShowUpgradeModal(false);
  };

  if (!formData) return null;

  const currentPlan = PLANS?.[formData.plan as keyof typeof PLANS] || { 
    label: 'Standard', 
    price: 0, 
    features: [] 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan actuel */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-500" />
            Plan actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-2xl font-bold text-purple-700">{currentPlan.label}</p>
              <p className="text-sm text-gray-600">{currentPlan.price === 0 ? 'Gratuit' : `${currentPlan.price}€/mois`}</p>
            </div>
            <Button variant="outline" onClick={() => setShowUpgradeModal(true)}>
              <Zap className="w-4 h-4 mr-2" />
              Changer de formule
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {currentPlan.features?.map((feature: string, idx: number) => (
              <span key={idx} className="inline-flex items-center gap-1 text-xs text-gray-600">
                <CheckCircle className="w-3 h-3 text-green-500" /> {feature}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reste du composant identique à votre code... */}
      <div className="flex justify-end gap-3">
        {saveSuccess && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Informations mises à jour
          </span>
        )}
        <Button type="submit" disabled={isSaving || isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
};