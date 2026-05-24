// src/app/admin/ia-settings/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, Brain, Shield, Zap, Bell, Lock, 
  Sliders, Activity, Database, Cpu, CheckCircle, AlertCircle,
  TrendingUp, Target, Award, Sparkles, Eye, Edit
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useIASettings } from '@/hooks/useIASettings';
import { useIASettingsStore } from '@/stores/iaSettingsStore';
import { IASettingsForm } from '@/components/admin/ia-settings/IASettingsForm';
import { formatDateTime } from '@/types/ia-settings.types';

// ============================================
// BANNIÈRE IA TRANSVERSALE (ENRICHIE)
// ============================================
const IATransversalBanner = () => {
  const router = useRouter();
  const { settings } = useIASettingsStore();
  
  return (
    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-5 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold">IA Transversale Active</h3>
              <span className="text-xs bg-green-500/30 px-2 py-0.5 rounded-full">Configuration temps réel</span>
              <span className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full">Gemini 2.0</span>
            </div>
            <p className="text-purple-100 text-sm mt-1 max-w-2xl">
              L'IA analyse en continu tous les modules. Paramétrez les seuils et comportements ci-dessous.
              Les modifications sont appliquées instantanément.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-purple-200">
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Précision 94%</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Temps réel</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> 1.2M analyses</span>
              <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> 99.9% disponibilité</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/admin/ia-settings/1')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all"
          >
            <Eye className="w-4 h-4" />
            Détails configuration
          </button>
          <button 
            onClick={() => router.push('/admin/ia/dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Dashboard IA
          </button>
        </div>
      </div>
      {/* Barre de progression IA */}
      <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-300 to-blue-300 rounded-full animate-pulse" style={{ width: '70%' }} />
      </div>
    </div>
  );
};

// ============================================
// STATISTIQUES IA
// ============================================
const StatsCards = ({ stats, isLoading }: { stats: any; isLoading: boolean }) => {
  const cards = [
    { title: 'Appels API', value: stats?.totalApiCalls?.toLocaleString() || '0', icon: Activity, color: 'bg-blue-500', trend: '+15%' },
    { title: 'Latence moyenne', value: `${stats?.averageLatency || 0}ms`, icon: Zap, color: 'bg-yellow-500', trend: '-8%' },
    { title: 'Détection fraude', value: `${stats?.fraudDetectionRate || 0}%`, icon: Shield, color: 'bg-red-500', trend: '+12%' },
    { title: 'Auto-approbation', value: `${stats?.autoApprovalRate || 0}%`, icon: CheckCircle, color: 'bg-green-500', trend: '+5%' },
    { title: 'Coût mensuel', value: `${stats?.monthlyCost?.toLocaleString() || 0}€`, icon: Database, color: 'bg-purple-500', trend: '+3%' },
    { title: 'Précision modèle', value: `${stats?.modelAccuracy || 0}%`, icon: Cpu, color: 'bg-indigo-500', trend: '+2%' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1,2,3,4,5,6].map(i => <div key={i} className="animate-pulse h-24 bg-gray-100 rounded-xl"></div>)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="group bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className={`${card.color} p-2 rounded-lg`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{card.trend}</span>
          </div>
          <p className="text-xl font-bold">{card.value}</p>
          <p className="text-xs text-gray-500">{card.title}</p>
        </div>
      ))}
    </div>
  );
};

// ============================================
// WIDGET CONFIGURATION RAPIDE
// ============================================
const QuickConfigWidget = () => {
  const router = useRouter();
  const { settings } = useIASettingsStore();
  
  const configItems = [
    { label: 'Anti-fraude', value: settings?.fraudDetection?.enabled ? 'Activé' : 'Désactivé', status: settings?.fraudDetection?.enabled, path: '#fraud' },
    { label: 'Auto-approbation', value: settings?.autoApproval?.enabled ? 'Activé' : 'Désactivé', status: settings?.autoApproval?.enabled, path: '#auto' },
    { label: 'Notifications', value: settings?.notifications?.emailEnabled ? 'Email actif' : 'Email inactif', status: settings?.notifications?.emailEnabled, path: '#notifications' },
    { label: 'Modèle IA', value: settings?.models?.provider || 'Gemini', status: true, path: '#models' },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Configuration rapide</h3>
          </div>
          <button onClick={() => router.push('/admin/ia-settings/1')} className="text-xs text-purple-600">
            Tout voir →
          </button>
        </div>
        <div className="space-y-2">
          {configItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <span className="text-sm">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.value}
                </span>
                <Edit className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// PAGE PRINCIPALE
// ============================================
export default function IASettingsPage() {
  const router = useRouter();
  const { settings, stats, isLoading, updateSettings, resetSettings, testConfiguration } = useIASettings();
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = async (newSettings: any) => {
    setIsSaving(true);
    await updateSettings(newSettings);
    setIsSaving(false);
  };

  const handleReset = async () => {
    if (confirm('Confirmer la réinitialisation des paramètres IA ?')) {
      await resetSettings();
    }
  };



  const handleTest = async (): Promise<{ success: boolean; message: string }> => {
    const result = await testConfiguration();
    return result;
  };


  if (isLoading && !settings) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement de la configuration..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-600" />
            Configuration IA
          </h1>
          <p className="text-sm text-gray-500 mt-1">Paramètres avancés de l'intelligence artificielle</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/ia-settings/1')}>
            <Eye className="w-4 h-4 mr-2" />
            Vue détaillée
          </Button>
        </div>
      </div>

      {/* Bannière IA Transversale */}
      <IATransversalBanner />

      {/* Résultat du test */}
      {testResult && (
        <div className={`p-3 rounded-lg flex items-center gap-2 ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {testResult.success ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          <p className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>{testResult.message}</p>
        </div>
      )}

      {/* Statistiques IA */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Grille secondaire */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IASettingsForm
            onSave={handleSave}
            onReset={handleReset}
            onTest={handleTest}
            isLoading={isLoading}
          />
        </div>
        <div className="space-y-6">
          <QuickConfigWidget />
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-gray-900">Recommandations IA</h3>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium">Augmenter le seuil de fraude</p>
                  <p className="text-xs text-gray-600">Pour réduire les faux positifs</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Activer le cache</p>
                  <p className="text-xs text-gray-600">Réduit la latence de 40%</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium">Planifier des rapports</p>
                  <p className="text-xs text-gray-600">Automatisez l'analyse</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Badge version */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t flex items-center justify-center gap-2">
        <Brain className="w-3 h-3 text-purple-400" />
        <span>Configuration IA • Mise à jour temps réel • Gemini 2.0</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </div>
  );
}