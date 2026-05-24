// src/app/admin/settings/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Settings, Brain, Shield, Zap, Bell, Lock, 
  Sliders, Activity, Database, Cpu, CheckCircle, AlertCircle,
  History, Clock, User, Calendar, RefreshCw, Globe,
  CreditCard, Key, Eye, Plus
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useSettings } from '@/hooks/useSettings';
import { useSettingsStore } from '@/stores/settingsStore';
import { useIASettingsStore } from '@/stores/iaSettingsStore';
import { formatDate } from '@/types/settings.types'; // Assurez-vous que cette fonction existe
import { formatDateTime } from '@/types/ia-settings.types';

// ============================================
// COMPOSANT HISTORIQUE DES MODIFICATIONS
// ============================================
const HistoryTimeline = () => {
  const { settings } = useSettingsStore();
  
  const history = [
    { id: 1, action: 'Modification des paramètres généraux', user: 'admin@courtier.fr', date: '2026-05-24T10:30:00', details: 'Langue changée en Français, fuseau horaire Europe/Paris' },
    { id: 2, action: 'Mise à jour sécurité', user: 'admin@courtier.fr', date: '2026-05-23T14:15:00', details: '2FA activé, politique mots de passe renforcée' },
    { id: 3, action: 'Configuration API', user: 'system', date: '2026-05-22T08:00:00', details: 'Nouvelle clé API générée pour l\'intégration CRM' },
    { id: 4, action: 'Modification plan facturation', user: 'admin@courtier.fr', date: '2026-05-21T16:45:00', details: 'Passage au plan PRO + 5000 appels API' },
    { id: 5, action: 'Optimisation IA', user: 'ai-system', date: '2026-05-20T09:30:00', details: 'Recommandation IA appliquée : ajustement des seuils' },
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
                  {item.user === 'ai-system' && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Brain className="w-2 h-2" /> IA
                    </span>
                  )}
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
// COMPOSANT RECOMMANDATIONS IA
// ============================================
const IARecommendations = () => {
  const { applyRecommendation, isSaving } = useIASettingsStore();
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  
  const mockRecommendations = [
    {
      id: 1,
      type: 'security',
      title: 'Activer la double authentification',
      description: '83% des administrateurs utilisent la 2FA pour sécuriser leurs comptes',
      impact: 'high',
      savings: 'Réduit les risques de compromission de 99%'
    },
    {
      id: 2,
      type: 'performance',
      title: 'Augmenter le cache API',
      description: 'Une durée de cache de 5 minutes améliorerait les performances de 40%',
      impact: 'medium',
      savings: 'Gain de temps estimé: 2h/semaine'
    },
    {
      id: 3,
      type: 'billing',
      title: 'Passer au plan Enterprise',
      description: 'Basé sur votre utilisation actuelle, le plan Enterprise serait plus économique',
      impact: 'high',
      savings: 'Économies estimées: 200€/mois'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const handleApply = async (id: number) => {
    if (appliedIds.includes(id)) return;
    await applyRecommendation(id);
    setAppliedIds([...appliedIds, id]);
  };

  const availableRecommendations = mockRecommendations.filter(r => !appliedIds.includes(r.id));

  if (availableRecommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Recommandations IA
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">À jour</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
            <p className="text-gray-600">Toutes les recommandations ont été appliquées</p>
            <p className="text-sm text-gray-400 mt-1">Votre configuration est optimisée</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Recommandations IA
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            {availableRecommendations.length} recommandation(s)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {availableRecommendations.map((rec) => (
            <div key={rec.id} className={`p-3 rounded-lg border ${getImpactColor(rec.impact)}`}>
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-gray-900">{rec.title}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleApply(rec.id)}
                  disabled={isSaving}
                >
                  {isSaving ? 'Application...' : 'Appliquer'}
                </Button>
              </div>
              <p className="text-sm text-gray-600">{rec.description}</p>
              <p className="text-xs text-green-600 mt-2">💡 {rec.savings}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// COMPOSANT INTÉGRATIONS IA
// ============================================
const IAIntegrations = () => {
  const { settings: iaSettings } = useIASettingsStore();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-500" />
          Intégrations IA actives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              <div>
                <p className="font-medium text-sm">Anti-fraude</p>
                <p className="text-xs text-gray-500">Détection en temps réel</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${iaSettings?.fraudDetection?.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {iaSettings?.fraudDetection?.enabled ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-500" />
              <div>
                <p className="font-medium text-sm">Auto-approbation</p>
                <p className="text-xs text-gray-500">Décisions automatiques</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${iaSettings?.autoApproval?.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {iaSettings?.autoApproval?.enabled ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <div>
                <p className="font-medium text-sm">Modèle prédictif</p>
                <p className="text-xs text-gray-500">Gemini 2.0</p>
              </div>
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Opérationnel</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t">
          <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/admin/ia-settings'}>
            <Settings className="w-4 h-4 mr-2" />
            Configurer les services IA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// COMPOSANT STATUT DES SERVICES
// ============================================
const ServiceStatus = () => {
  const services = [
    { name: 'API Gateway', status: 'operational', latency: '45ms', uptime: '99.99%' },
    { name: 'Base de données', status: 'operational', latency: '12ms', uptime: '99.95%' },
    { name: 'Service IA', status: 'operational', latency: '120ms', uptime: '99.9%' },
    { name: 'Webhooks', status: 'degraded', latency: '250ms', uptime: '98.5%' },
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
          Statut des services
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
export default function SettingsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const settingId = parseInt(params.id as string);
  
  const { 
    settings,
    isLoading, 
    fetchSettings,
    error,
    updatedAt,
    updatedBy
  } = useSettings();
  
  const { setSettings } = useSettingsStore();
  const { settings: iaSettings } = useIASettingsStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      await fetchSettings();
    };
    load();
  }, [fetchSettings, settingId]);

  useEffect(() => {
    if (settings) {
      setSettings(settings);
    }
  }, [settings, setSettings]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement de la configuration..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchSettings} className="mt-4">Réessayer</Button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Aucune configuration trouvée..." />
      </div>
    );
  }

  const general = settings.general;
  const security = settings.security;
  const billing = settings.billing;
  const apiSettingsData = settings.apiSettings;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuration plateforme</h1>
            <p className="text-sm text-gray-500 mt-1">
              Détails et historique des paramètres
              {updatedAt && ` • Dernière modification: ${formatDateTime(updatedAt)}`}
              {updatedBy && ` par ${updatedBy}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/settings')}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button onClick={() => router.push('/admin/ia-settings')}>
            <Brain className="w-4 h-4 mr-2" />
            Configuration IA
          </Button>
        </div>
      </div>

      {/* Bannière IA */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-900">Optimisation IA active</p>
            <p className="text-sm text-purple-700">
              L'IA analyse vos paramètres en temps réel. 
              {iaSettings?.autoApproval?.enabled ? ' Auto-approbation activée' : ' Décisions manuelles requises'} • 
              Anti-fraude {iaSettings?.fraudDetection?.enabled ? 'actif' : 'inactif'} • 
              Précision modèle: {iaSettings?.fraudDetection?.alertThreshold || 85}%
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/ia-settings')}>
            Voir détails →
          </Button>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Dernière mise à jour</p>
            <p className="font-medium">{updatedAt ? formatDateTime(updatedAt) : 'Non définie'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-xs text-gray-500">Modifié par</p>
            <p className="font-medium">{updatedBy || 'Système'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Globe className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Version plateforme</p>
            <p className="font-medium">v2.4.0</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Brain className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-xs text-gray-500">Statut IA</p>
            <p className="font-medium text-green-600">Optimisation active</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="overview">📊 Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="security">🔒 Sécurité</TabsTrigger>
          <TabsTrigger value="billing">💰 Facturation</TabsTrigger>
          <TabsTrigger value="integrations">🔌 Intégrations IA</TabsTrigger>
          <TabsTrigger value="history">📜 Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  Paramètres généraux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom plateforme</span>
                    <span className="font-medium">{general?.platformName || 'Courtier IA'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Langue</span>
                    <span className="font-medium">{general?.language || 'Français'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuseau horaire</span>
                    <span className="font-medium">{general?.timezone || 'Europe/Paris'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format date</span>
                    <span className="font-medium">{general?.dateFormat || 'DD/MM/YYYY'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  Plan actuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium text-purple-600">{billing?.plan || 'FREE'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Renouvellement</span>
                    <span className="font-medium">{billing?.autoRenew ? 'Automatique' : 'Manuel'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prochaine facture</span>
                    <span className="font-medium">{billing?.nextInvoiceDate ? formatDateTime(billing.nextInvoiceDate) : 'Non définie'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <IARecommendations />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-orange-500" />
                  Clés API actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {apiSettingsData?.apiKeys && apiSettingsData.apiKeys.length > 0 ? (
                    apiSettingsData.apiKeys.map((key: any) => (
                      <div key={key.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-mono text-xs">{key.key?.substring(0, 20)}••••••</p>
                          <p className="text-xs text-gray-500">{key.name} • Créée le {formatDateTime(key.createdAt)}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Aucune clé API configurée</p>
                  )}
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Générer nouvelle clé
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-500" />
                  Configuration sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Double authentification (2FA)</span>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${security?.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {security?.twoFactorEnabled ? 'Activé' : 'Désactivé'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Session timeout</span>
                    <span>{security?.sessionTimeout || 30} minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Politique mots de passe</span>
                    <span>{security?.passwordPolicy === 'strong' ? 'Fort' : security?.passwordPolicy === 'medium' ? 'Moyen' : 'Simple'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ServiceStatus />
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  Détails facturation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email facturation</span>
                    <span>{billing?.billingEmail || 'Non renseigné'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">N° TVA</span>
                    <span>{billing?.vatNumber || 'Non renseigné'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Méthode paiement</span>
                    <span>{billing?.paymentMethod === 'CARD' ? 'Carte bancaire' : billing?.paymentMethod === 'PAYPAL' ? 'PayPal' : 'Virement'}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Gérer la facturation →
                  </Button>
                </div>
              </CardContent>
            </Card>

            <IAIntegrations />
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <IAIntegrations />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <HistoryTimeline />
        </TabsContent>
      </Tabs>
    </div>
  );
}