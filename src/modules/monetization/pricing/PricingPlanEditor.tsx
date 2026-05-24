// src/modules/monetization/pricing/PricingPlanEditor.tsx
// Éditeur des plans de tarification IA
// <160 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { apiClient } from '@/modules/api/client/client';

// Icônes
import { Plus, Edit, Trash2, Save, X, DollarSign, Zap, Crown, Users } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  tier: 'STANDARD' | 'IA';
  price: number;
  creditsPerMonth: number;
  features: string[];
  isActive: boolean;
}

export const PricingPlanEditor = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/admin/monetization/plans');
      const data = (response as any).data;
      if (Array.isArray(data)) {
        setPlans(data);
      } else {
        // Plans par défaut
        setPlans([
          { id: 'free', name: 'Standard', tier: 'STANDARD', price: 0, creditsPerMonth: 10, features: ['Analyses de base', 'Support email'], isActive: true },
          { id: 'pro', name: 'IA Pro', tier: 'IA', price: 49, creditsPerMonth: 500, features: ['Analyses avancées', 'Support prioritaire', 'API accessible'], isActive: true },
          { id: 'enterprise', name: 'Enterprise', tier: 'IA', price: 199, creditsPerMonth: 5000, features: ['Analyses illimitées', 'Support dédié', 'API illimitée', 'SLA'], isActive: true },
        ]);
      }
    } catch (error) {
      console.error('Failed to load plans', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingPlan) return;
    setIsSaving(true);
    try {
      await apiClient.post('/admin/monetization/plans', editingPlan);
      await loadPlans();
      setEditingPlan(null);
    } catch (error) {
      console.error('Failed to save plan', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Supprimer ce plan ?')) return;
    try {
      await apiClient.delete(`/admin/monetization/plans/${planId}`);
      await loadPlans();
    } catch (error) {
      console.error('Failed to delete plan', error);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'IA': return <Zap className="w-4 h-4 text-purple-600" />;
      default: return <Crown className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <LoadingSpinner size="lg" text="Chargement des plans..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Plans de tarification IA</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setEditingPlan({ id: Date.now().toString(), name: '', tier: 'STANDARD', price: 0, creditsPerMonth: 0, features: [], isActive: true })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${!plan.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getTierIcon(plan.tier)}
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditingPlan(plan)} className="p-1 text-gray-400 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold">{plan.price}€</p>
                <p className="text-sm text-gray-500">/mois</p>
                <p className="text-sm text-purple-600 mt-1">{plan.creditsPerMonth} crédits</p>
              </div>
              <ul className="space-y-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal édition */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>{editingPlan.id ? 'Modifier le plan' : 'Nouveau plan'}</CardTitle>
              <button onClick={() => setEditingPlan(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix (€)</label>
                  <input
                    type="number"
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Crédits / mois</label>
                  <input
                    type="number"
                    value={editingPlan.creditsPerMonth}
                    onChange={(e) => setEditingPlan({ ...editingPlan, creditsPerMonth: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fonctionnalités (une par ligne)</label>
                  <textarea
                    value={editingPlan.features.join('\n')}
                    onChange={(e) => setEditingPlan({ ...editingPlan, features: e.target.value.split('\n').filter(f => f.trim()) })}
                    className="w-full px-3 py-2 border rounded-lg h-32"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isSaving} variant="primary" fullWidth>
                    {isSaving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                  <Button onClick={() => setEditingPlan(null)} variant="outline" fullWidth>
                    Annuler
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PricingPlanEditor;