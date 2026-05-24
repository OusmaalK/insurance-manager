// src/components/admin/companies/CompanyForm.tsx
// Formulaire entreprise - Version corrigée
// <140 lignes

'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { CompanyFormData } from '@/types/company.types';
import { useCompanyFormStore } from '@/stores/companyFormStore';

// Icônes
import { Building2, Mail, Phone, MapPin, Briefcase, Users, DollarSign, Save, X } from 'lucide-react';

interface CompanyFormProps {
  onClose?: () => void;
}

export const CompanyForm = ({ onClose }: CompanyFormProps) => {
  const { initialData, submitForm, closeForm } = useCompanyFormStore();
  const [formData, setFormData] = useState<CompanyFormData>(initialData || {
    name: '', siret: '', email: '', phone: '', address: '', city: '', postal_code: '', activity_sector: '', employee_count: undefined, annual_revenue: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nom requis';
    if (!formData.siret.trim()) newErrors.siret = 'SIRET requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
    if (!formData.address.trim()) newErrors.address = 'Adresse requise';
    if (!formData.city.trim()) newErrors.city = 'Ville requise';
    if (!formData.postal_code.trim()) newErrors.postal_code = 'Code postal requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    await submitForm(formData);
    setIsLoading(false);
    if (onClose) onClose();
  };

  const handleCancel = () => {
    closeForm();
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{initialData ? 'Modifier entreprise' : 'Nouvelle entreprise'}</h2>
        <Button type="button" variant="ghost" onClick={handleCancel}><X className="w-4 h-4 mr-2" />Annuler</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1">Nom *</label><div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full pl-10 pr-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`} /></div>{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}</div>
        <div><label className="block text-sm font-medium mb-1">SIRET *</label><input type="text" name="siret" value={formData.siret} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Email *</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" /></div></div>
        <div><label className="block text-sm font-medium mb-1">Téléphone *</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" /></div></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Adresse *</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" /></div></div>
        <div><label className="block text-sm font-medium mb-1">Ville *</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Code postal *</label><input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" /></div>
        <div><label className="block text-sm font-medium mb-1">Secteur d'activité</label><div className="relative"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" name="activity_sector" value={formData.activity_sector} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" /></div></div>
        <div><label className="block text-sm font-medium mb-1">Employés</label><div className="relative"><Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="number" name="employee_count" value={formData.employee_count || ''} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" /></div></div>
        <div><label className="block text-sm font-medium mb-1">CA annuel (€)</label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="number" name="annual_revenue" value={formData.annual_revenue || ''} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" /></div></div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={handleCancel}>Annuler</Button>
        <Button type="submit" disabled={isLoading} variant="primary">{isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}{isLoading ? 'Sauvegarde...' : 'Enregistrer'}</Button>
      </div>
    </form>
  );
};

export default CompanyForm;