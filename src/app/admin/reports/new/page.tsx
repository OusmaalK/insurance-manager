// src/app/admin/reports/new/page.tsx
// Page de génération de rapport
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, FileText, Brain, Calendar, Clock,
  Save, X, Sparkles, AlertCircle, CheckCircle
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useReports } from '@/hooks/useReports';
import { useAIReports } from '@/hooks/useAIReports';
import { REPORT_TYPES, REPORT_FORMATS } from '@/types/report.types';

export default function NewReportPage() {
  const router = useRouter();
  const { generateReport, isLoading: reportLoading } = useReports();
  const { generateAIReport, isLoading: aiLoading } = useAIReports();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'STANDARD',
    format: 'PDF',
    dateRange: {
      start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    filters: {},
    schedule: {
      enabled: false,
      frequency: 'WEEKLY',
      time: '08:00',
      recipients: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationType, setGenerationType] = useState<'standard' | 'ai'>('standard');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let result;
    if (generationType === 'ai') {
      result = await generateAIReport(formData.dateRange);
    } else {
      result = await generateReport(formData);
    }
    
    setIsSubmitting(false);
    
    if (result) {
      router.push('/admin/reports');
    }
  };

  const handleCancel = () => {
    router.push('/admin/reports');
  };

  const isLoading = reportLoading || aiLoading || isSubmitting;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/reports" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Générer un rapport</h1>
          <p className="text-sm text-gray-500 mt-1">Choisissez le type de rapport et ses paramètres</p>
        </div>
      </div>

      {/* Bannière IA */}
      <div className="mb-6 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Rapports IA intelligents</p>
            <p className="text-xs text-gray-600">
              Les rapports IA incluent des analyses prédictives, des insights et des recommandations personnalisées.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration du rapport</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Type de rapport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de rapport</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGenerationType('standard')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    generationType === 'standard' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="font-medium">Rapport standard</p>
                  <p className="text-xs text-gray-500">Données brutes</p>
                </button>
                <button
                  type="button"
                  onClick={() => setGenerationType('ai')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    generationType === 'ai' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Brain className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="font-medium">Rapport IA</p>
                  <p className="text-xs text-gray-500">+ Insights & prédictions</p>
                </button>
              </div>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre du rapport <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Rapport mensuel - Mai 2026"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Description optionnelle..."
              />
            </div>

            {/* Période */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                <input
                  type="date"
                  value={formData.dateRange.start}
                  onChange={(e) => setFormData({
                    ...formData, 
                    dateRange: {...formData.dateRange, start: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                <input
                  type="date"
                  value={formData.dateRange.end}
                  onChange={(e) => setFormData({
                    ...formData, 
                    dateRange: {...formData.dateRange, end: e.target.value}
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format d'export</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({...formData, format: e.target.value as any})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(REPORT_FORMATS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Planification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Planification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.schedule.enabled}
                onChange={(e) => setFormData({
                  ...formData,
                  schedule: {...formData.schedule, enabled: e.target.checked}
                })}
                className="w-4 h-4 accent-purple-600"
              />
              <span className="text-sm">Planifier ce rapport (génération automatique)</span>
            </label>

            {formData.schedule.enabled && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence</label>
                  <select
                    value={formData.schedule.frequency}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: {...formData.schedule, frequency: e.target.value as any}
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="DAILY">Quotidien</option>
                    <option value="WEEKLY">Hebdomadaire</option>
                    <option value="MONTHLY">Mensuel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure d'envoi</label>
                  <input
                    type="time"
                    value={formData.schedule.time}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: {...formData.schedule, time: e.target.value}
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destinataires (email)</label>
                  <input
                    type="text"
                    value={formData.schedule.recipients}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: {...formData.schedule, recipients: e.target.value}
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="email1@exemple.com, email2@exemple.com"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badge IA */}
        {generationType === 'ai' && (
          <div className="p-3 bg-purple-50 rounded-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <p className="text-sm text-purple-700">Le rapport IA inclura des analyses prédictives et des recommandations personnalisées.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}
            {isLoading ? 'Génération...' : 'Générer le rapport'}
          </Button>
        </div>
      </form>
    </div>
  );
}