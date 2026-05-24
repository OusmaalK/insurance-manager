// src/app/admin/policies/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Building2, FileText, Calendar, Euro, Shield } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { usePolicies } from '@/hooks/usePolicies';
import { useCompanies } from '@/hooks/useCompanies';
import { POLICY_TYPES } from '@/types/policy.types';

export default function NewPolicyPage() {
  const router = useRouter();
  const { createPolicy } = usePolicies();
  const { companies } = useCompanies({ autoFetch: true });
  const [formData, setFormData] = useState({
    company_id: '',
    policy_number: '',
    name: '',
    type: 'AUTO',
    coverage_amount: '',
    premium_amount: '',
    start_date: '',
    end_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createPolicy({
      ...formData,
      coverage_amount: parseFloat(formData.coverage_amount),
      premium_amount: parseFloat(formData.premium_amount),
      company_id: parseInt(formData.company_id),
    });
    setIsSubmitting(false);
    if (result) router.push('/admin/policies');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6"><Link href="/admin/policies" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link><h1 className="text-2xl font-bold text-gray-900">Nouveau contrat</h1></div>

      <form onSubmit={handleSubmit}>
        <Card><CardHeader><CardTitle>Informations générales</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Entreprise *</label><select name="company_id" value={formData.company_id} onChange={(e) => setFormData({...formData, company_id: e.target.value})} className="w-full p-2 border rounded-lg" required><option value="">Sélectionner</option>{companies.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
            <div><label className="block text-sm font-medium mb-1">Numéro contrat *</label><input type="text" value={formData.policy_number} onChange={(e) => setFormData({...formData, policy_number: e.target.value})} className="w-full p-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium mb-1">Nom du contrat *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium mb-1">Type *</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full p-2 border rounded-lg">{Object.entries(POLICY_TYPES).map(([key, val]) => (<option key={key} value={key}>{val.label}</option>))}</select></div>
            <div><label className="block text-sm font-medium mb-1">Montant couvert (€)</label><input type="number" value={formData.coverage_amount} onChange={(e) => setFormData({...formData, coverage_amount: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Prime annuelle (€) *</label><input type="number" value={formData.premium_amount} onChange={(e) => setFormData({...formData, premium_amount: e.target.value})} className="w-full p-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium mb-1">Date début *</label><input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} className="w-full p-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium mb-1">Date fin *</label><input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} className="w-full p-2 border rounded-lg" required /></div>
          </div>
        </CardContent></Card>

        <div className="flex justify-end gap-3 mt-6"><Button type="button" variant="outline" onClick={() => router.push('/admin/policies')}><X className="w-4 h-4 mr-2" />Annuler</Button><Button type="submit" disabled={isSubmitting}><Save className="w-4 h-4 mr-2" />{isSubmitting ? 'Création...' : 'Créer le contrat'}</Button></div>
      </form>
    </div>
  );
}