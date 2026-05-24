// src/components/admin/policies/PolicyForm.tsx
// Formulaire contrat (composant admin) - Version alignée avec policy.types.ts
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { usePolicies } from '@/hooks/usePolicies';
import { PolicyFormData, POLICY_TYPES } from '@/types/policy.types';

// Icônes
import { FileText, Building2, Calendar, DollarSign, Shield, Save, X } from 'lucide-react';

interface PolicyFormProps {
  policyId?: number;
  onClose?: () => void;
  onSuccess?: () => void;
}

// Données mockées pour les entreprises (en attendant l'API)
const mockCompanies = [
  { id: 1, name: 'AXA France' },
  { id: 2, name: 'Allianz' },
  { id: 3, name: 'Generali' },
  { id: 4, name: 'Groupama' },
];

export const PolicyForm = ({ policyId, onClose, onSuccess }: PolicyFormProps) => {
  const { createPolicy, updatePolicy, getPolicy, isLoading: policiesLoading } = usePolicies();
  const [formData, setFormData] = useState<PolicyFormData>({
    company_id: 0,
    policy_number: '',
    name: '',
    type: 'AUTO',
    coverage_amount: 0,
    premium_amount: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Charger les données si modification
  useEffect(() => {
    if (policyId) {
      const loadPolicy = async () => {
        setIsFetching(true);
        const policy = await getPolicy(policyId);
        if (policy) {
          setFormData({
            company_id: policy.company_id,
            policy_number: policy.policy_number,
            name: policy.name,
            type: policy.type,
            coverage_amount: policy.coverage_amount,
            premium_amount: policy.premium_amount,
            start_date: policy.start_date?.split('T')[0] || '',
            end_date: policy.end_date?.split('T')[0] || '',
          });
        }
        setIsFetching(false);
      };
      loadPolicy();
    }
  }, [policyId, getPolicy]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name.includes('amount') || name === 'company_id'
        ? parseFloat(value) || 0 
        : value 
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.policy_number.trim()) newErrors.policy_number = 'Numéro de contrat requis';
    if (!formData.name.trim()) newErrors.name = 'Nom du contrat requis';
    if (!formData.company_id || formData.company_id === 0) newErrors.company_id = 'Veuillez sélectionner une entreprise';
    if (!formData.type) newErrors.type = 'Type de contrat requis';
    if (!formData.end_date) newErrors.end_date = 'Date de fin requise';
    if (formData.premium_amount <= 0) newErrors.premium_amount = 'La prime doit être supérieure à 0';
    if (formData.coverage_amount < 0) newErrors.coverage_amount = 'Le montant couvert doit être positif';
    if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
      newErrors.end_date = 'La date de fin doit être après la date de début';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const submitData: PolicyFormData = {
      company_id: formData.company_id,
      policy_number: formData.policy_number,
      name: formData.name,
      type: formData.type,
      coverage_amount: formData.coverage_amount,
      premium_amount: formData.premium_amount,
      start_date: formData.start_date,
      end_date: formData.end_date,
    };
    
    let result;
    if (policyId) {
      result = await updatePolicy(policyId, submitData);
    } else {
      result = await createPolicy(submitData);
    }
    
    setIsLoading(false);
    
    if (result) {
      onSuccess?.();
      onClose?.();
    }
  };

  const handleCancel = () => {
    onClose?.();
  };

  if (isFetching || policiesLoading) {
    return (
      <div className="p-8 text-center">
        <LoadingSpinner size="md" text="Chargement du contrat..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {policyId ? 'Modifier le contrat' : 'Nouveau contrat'}
        </h2>
        <Button type="button" variant="ghost" onClick={handleCancel}>
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Numéro contrat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de contrat <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="policy_number"
              value={formData.policy_number}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.policy_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="POL-2024-001"
            />
          </div>
          {errors.policy_number && <p className="text-xs text-red-500 mt-1">{errors.policy_number}</p>}
        </div>

        {/* Nom du contrat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du contrat <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Assurance Auto Pro"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Entreprise */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entreprise <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              name="company_id"
              value={formData.company_id}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.company_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="0">Sélectionner une entreprise</option>
              {mockCompanies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {errors.company_id && <p className="text-xs text-red-500 mt-1">{errors.company_id}</p>}
        </div>

        {/* Type de contrat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de contrat <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {Object.entries(POLICY_TYPES).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
        </div>

        {/* Date début */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Date fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de fin <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.end_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.end_date && <p className="text-xs text-red-500 mt-1">{errors.end_date}</p>}
        </div>

        {/* Prime annuelle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prime annuelle (€) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              name="premium_amount"
              value={formData.premium_amount || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.premium_amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
              step="0.01"
            />
          </div>
          {errors.premium_amount && <p className="text-xs text-red-500 mt-1">{errors.premium_amount}</p>}
        </div>

        {/* Montant couvert */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant couvert (€)</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              name="coverage_amount"
              value={formData.coverage_amount || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.coverage_amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
              step="0.01"
            />
          </div>
          {errors.coverage_amount && <p className="text-xs text-red-500 mt-1">{errors.coverage_amount}</p>}
        </div>
      </div>

      {/* Badge IA */}
      <div className="p-3 bg-purple-50 rounded-lg flex items-center gap-2">
        <Shield className="w-4 h-4 text-purple-500" />
        <p className="text-sm text-purple-700">
          L'IA analysera automatiquement ce contrat et fournira des prédictions de renouvellement.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} variant="primary">
          {isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}
          {isLoading ? 'Sauvegarde...' : (policyId ? 'Mettre à jour' : 'Créer le contrat')}
        </Button>
      </div>
    </form>
  );
};

export default PolicyForm;