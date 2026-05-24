// src/app/admin/ia-settings/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Settings, Brain, Shield, Zap, Bell, Lock, 
  Sliders, Activity, Database, Cpu, CheckCircle, AlertCircle,
  History, Clock, User, Calendar, Save, RefreshCw
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useIASettings } from '@/hooks/useIASettings';
import { useIASettingsStore } from '@/stores/iaSettingsStore';
import { formatDateTime } from '@/types/ia-settings.types';

// ============================================
// COMPOSANT HISTORIQUE DES MODIFICATIONS
// ============================================
const HistoryTimeline = () => {
  const { settings } = useIASettingsStore();
  
  // Historique mocké (à remplacer par appel API)
  const history = [
    { id: 1, action: 'Modification des seuils de risque', user: 'admin@courtier.fr', date: '2026-05-24T10:30:00', details: 'Seuil risque élevé passé de 80% à 90%' },
    { id: 2, action: 'Activation auto-approbation', user: 'admin@courtier.fr', date: '2026-05-23T14:15:00', details: 'Montant max augmenté à 5000€' },
    { id: 3, action: 'Mise à jour modèle IA', user: 'system', date: '2026-05-22T08:00:00', details: 'Migration vers Gemini 2.0 Flash' },
    { id: 4, action: 'Configuration notifications', user: 'admin@courtier.fr', date: '2026-05-21T16:45:00', details: 'Ajout des alertes email' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-500" />
          Historique des modifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <p className="font-medium text-gray-900">{item.action}</p>
                  <span className="text-xs text-gray-400">{formatDateTime(item.date)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{item.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// COMPOSANT STATUT DES SERVICES IA
// ============================================
const IAServiceStatus = () => {
  const services = [
    { name: 'Gemini API', status: 'operational', latency: '1.2s', uptime: '99.9%' },
    { name: 'Détection fraude', status: 'operational', latency: '0.8s', uptime: '99.8%' },
    { name: 'Prédictions', status: 'operational', latency: '1.5s', uptime: '99.7%' },
    { name: 'Auto-approbation', status: 'degraded', latency: '2.1s', uptime: '98.5%' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">🟢 Opérationnel</span>;
      case 'degraded':
        return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">🟡 Dégradé</span>;
      default:
        return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">🔴 Indisponible</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500" />
          Statut des services IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{service.name}</p>
                <p className="text-xs text-gray-500">Latence: {service.latency} • Uptime: {service.uptime}</p>
              </div>
              {getStatusBadge(service.status)}
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
export default function IASettingsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const settingId = parseInt(params.id as string);
  const { settings, isLoading, fetchSettings } = useIASettings();
  const { setSettings } = useIASettingsStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      await fetchSettings();
      if (settings) {
        setSettings(settings);
      }
    };
    load();
  }, [settingId]);

  if (isLoading || !settings) {
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
        <div className="flex items-center gap-3">
          <Link href="/admin/ia-settings" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuration IA</h1>
            <p className="text-sm text-gray-500 mt-1">Détails et historique des paramètres</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/ia-settings')}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Dernière mise à jour</p>
            <p className="font-medium">{formatDateTime(settings.updatedAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-xs text-gray-500">Modifié par</p>
            <p className="font-medium">{settings.updatedBy || 'Administrateur'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Brain className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Version modèle</p>
            <p className="font-medium">{settings.models?.modelVersion || 'Gemini 2.0'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="overview">📊 Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="services">🔧 Services IA</TabsTrigger>
          <TabsTrigger value="history">📜 Historique</TabsTrigger>
          <TabsTrigger value="metrics">📈 Métriques</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  Détection fraude
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activée</span>
                    <span className="font-medium">{settings.fraudDetection?.enabled ? '✅ Oui' : '❌ Non'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sensibilité</span>
                    <span className="font-medium">{settings.fraudDetection?.sensitivityLevel || 'Moyenne'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seuil d'alerte</span>
                    <span className="font-medium">{settings.fraudDetection?.alertThreshold || 70}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Délai d'analyse</span>
                    <span className="font-medium">{settings.fraudDetection?.analysisDelay || 5} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-500" />
                  Auto-approbation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activée</span>
                    <span className="font-medium">{settings.autoApproval?.enabled ? '✅ Oui' : '❌ Non'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant max</span>
                    <span className="font-medium">{settings.autoApproval?.maxAmount?.toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confiance min</span>
                    <span className="font-medium">{settings.autoApproval?.minConfidenceScore || 85}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deuxième relecture</span>
                    <span className="font-medium">{settings.autoApproval?.requireSecondReview ? '✅ Oui' : '❌ Non'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{settings.notifications?.emailEnabled ? '✅ Oui' : '❌ Non'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Push</span>
                    <span className="font-medium">{settings.notifications?.pushEnabled ? '✅ Oui' : '❌ Non'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alertes fraude</span>
                    <span className="font-medium">{settings.notifications?.fraudAlertEmail ? '✅ Oui' : '❌ Non'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rapport hebdomadaire</span>
                    <span className="font-medium">{settings.notifications?.weeklyReport ? '✅ Oui' : '❌ Non'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-500" />
                  Confidentialité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rétention données</span>
                    <span className="font-medium">{settings.privacy?.dataRetentionDays || 365} jours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Anonymisation</span>
                    <span className="font-medium">{settings.privacy?.anonymizeData ? '✅ Oui' : '❌ Non'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Logs d'audit</span>
                    <span className="font-medium">{settings.privacy?.auditLogs ? '✅ Oui' : '❌ Non'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consentement requis</span>
                    <span className="font-medium">{settings.privacy?.userConsentRequired ? '✅ Oui' : '❌ Non'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <IAServiceStatus />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <HistoryTimeline />
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Performance IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Précision globale</span>
                      <span className="font-bold">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Détection fraude</span>
                      <span className="font-bold">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '87%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Taux auto-approbation</span>
                      <span className="font-bold">76%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-500" />
                  Coûts IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">124,50 €</p>
                    <p className="text-xs text-gray-500">Coût total ce mois</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Appels API</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Coût moyen par appel</span>
                    <span className="font-medium">0,10 €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimation mois prochain</span>
                    <span className="font-medium">~150 €</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}