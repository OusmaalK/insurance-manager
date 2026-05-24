// src/app/admin/claims/new/page.tsx
// Page de déclaration de sinistre
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, AlertTriangle, Calendar, Euro, FileText, 
  Building2, Save, X, Shield, Brain, Sparkles,
  Upload, AlertCircle, CheckCircle
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useClaims } from '@/hooks/useClaims';
import { usePolicies } from '@/hooks/usePolicies';
import { useClaimAI } from '@/hooks/useClaimAI';

// Types pour le formulaire
interface ClaimFormData {
  policy_id: number;
  title: string;
  description: string;
  incident_date: string;
  estimated_amount: number;
}

export default function NewClaimPage() {
  const router = useRouter();
  const { createClaim, isLoading: claimLoading } = useClaims();
  const { policies, fetchPolicies, isLoading: policiesLoading } = usePolicies({ autoFetch: false });
  const { predictAmount, isLoading: aiLoading } = useClaimAI();
  
  const [formData, setFormData] = useState<ClaimFormData>({
    policy_id: 0,
    title: '',
    description: '',
    incident_date: new Date().toISOString().split('T')[0],
    estimated_amount: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<any>(null);
  const [showAIPrediction, setShowAIPrediction] = useState(false);

  // Charger les contrats pour le sélecteur
  useEffect(() => {
    fetchPolicies({ limit: 100, status: 'ACTIVE' });
  }, [fetchPolicies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'estimated_amount' || name === 'policy_id' ? parseFloat(value) || 0 : value 
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    
    // Réinitialiser la prédiction IA quand le montant change
    if (name === 'estimated_amount') {
      setShowAIPrediction(false);
      setAiPrediction(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.policy_id || formData.policy_id === 0) newErrors.policy_id = 'Veuillez sélectionner un contrat';
    if (!formData.title.trim()) newErrors.title = 'Titre du sinistre requis';
    if (!formData.description.trim()) newErrors.description = 'Description du sinistre requise';
    if (!formData.incident_date) newErrors.incident_date = 'Date d\'incident requise';
    if (formData.estimated_amount <= 0) newErrors.estimated_amount = 'Le montant estimé doit être supérieur à 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Prédiction IA du montant
  const handleAIPrediction = async () => {
    if (!formData.policy_id) {
      setErrors(prev => ({ ...prev, policy_id: 'Sélectionnez d\'abord un contrat' }));
      return;
    }
    
    // Simuler une prédiction IA (en attendant l'API)
    setAiPrediction({
      predicted_amount: Math.round(formData.estimated_amount * 0.85),
      confidence_score: 92,
      estimated_processing_days: 7,
      fraud_risk: 'LOW',
      suggested_action: 'Analyse standard recommandée'
    });
    setShowAIPrediction(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const result = await createClaim(formData);
    setIsSubmitting(false);
    
    if (result) {
      router.push(`/admin/claims/${result.id}`);
    }
  };

  const handleCancel = () => {
    router.push('/admin/claims');
  };

  if (policiesLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement des contrats..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/claims" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Déclarer un sinistre</h1>
          <p className="text-sm text-gray-500 mt-1">Formulaire de déclaration avec analyse IA intégrée</p>
        </div>
      </div>

      {/* Bannière IA */}
      <div className="mb-6 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">IA Anti-Fraude Active</p>
            <p className="text-xs text-gray-600">L'IA analysera automatiquement ce sinistre pour détecter les fraudes potentielles et suggérer un montant optimal.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations du sinistre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Contrat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contrat associé <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="policy_id"
                  value={formData.policy_id}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.policy_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="0">Sélectionner un contrat</option>
                  {policies.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.policy_number}
                    </option>
                  ))}
                </select>
              </div>
              {errors.policy_id && <p className="text-xs text-red-500 mt-1">{errors.policy_id}</p>}
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre du sinistre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Dégât des eaux, Accident de la route..."
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Décrivez les circonstances du sinistre..."
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Date incident et Montant estimé */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'incident <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    name="incident_date"
                    value={formData.incident_date}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.incident_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.incident_date && <p className="text-xs text-red-500 mt-1">{errors.incident_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant estimé (€) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    name="estimated_amount"
                    value={formData.estimated_amount || ''}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.estimated_amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                {errors.estimated_amount && <p className="text-xs text-red-500 mt-1">{errors.estimated_amount}</p>}
              </div>
            </div>

            {/* Bouton prédiction IA */}
            {formData.policy_id > 0 && formData.estimated_amount > 0 && !showAIPrediction && (
              <button
                type="button"
                onClick={handleAIPrediction}
                className="mt-2 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Brain className="w-4 h-4" />
                Estimer avec l'IA
              </button>
            )}

            {/* Résultat prédiction IA */}
            {showAIPrediction && aiPrediction && (
              <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <p className="text-sm font-medium text-purple-700">Prédiction IA</p>
                  </div>
                  <span className="text-xs text-purple-600">Confiance: {aiPrediction.confidence_score}%</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Montant suggéré</p>
                    <p className="text-lg font-bold text-purple-700">{aiPrediction.predicted_amount.toLocaleString()} €</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Délai estimé</p>
                    <p className="text-lg font-bold text-purple-700">{aiPrediction.estimated_processing_days} jours</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{aiPrediction.suggested_action}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badge sécurité */}
        <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <p className="text-sm text-blue-700">Les informations sont confidentielles et sécurisées.</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting || claimLoading}>
            {isSubmitting || claimLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}
            {isSubmitting || claimLoading ? 'Déclaration en cours...' : 'Déclarer le sinistre'}
          </Button>
        </div>
      </form>
    </div>
  );
}