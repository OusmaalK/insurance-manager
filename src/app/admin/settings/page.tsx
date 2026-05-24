// src/app/admin/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, Shield, CreditCard, Key, User, Bell, 
  Brain, Sparkles, Globe, Lock, Database, Zap,
  Target, Award, Activity, CheckCircle, AlertCircle,
  Mail, Code, Server, Eye, Edit, Trash2, Plus,
  Cloud, Clock, FileText, HelpCircle, LogOut,
  Moon, Sun, Smartphone, Laptop, RefreshCw,
  Palette, Rocket, Heart, Star, Gem, Crown
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useSettings } from '@/hooks/useSettings';
import { ProfileSettings } from '@/components/settings/ProfileSettings';

// ============================================
// COMPOSANT PARAMÈTRES GÉNÉRAUX - Thème Bleu Océan
// ============================================
const GeneralSettingsComponent = () => {
  const [formData, setFormData] = useState({
    platformName: 'Courtier IA',
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    weekStart: 'monday',
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 bg-blue-500 rounded-xl">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-blue-900">Paramètres Généraux</h2>
          <p className="text-sm text-blue-600">Configuration de base de la plateforme</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
          <label className="block text-sm font-medium text-blue-800 mb-1">Nom de la plateforme</label>
          <input
            type="text"
            value={formData.platformName}
            onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
            <label className="block text-sm font-medium text-blue-800 mb-1">Langue par défaut</label>
            <select className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white">
              <option>Français</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>
          <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
            <label className="block text-sm font-medium text-blue-800 mb-1">Fuseau horaire</label>
            <select className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white">
              <option>Europe/Paris</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button className="bg-blue-600 hover:bg-blue-700">Enregistrer</Button>
      </div>
    </div>
  );
};

// ============================================
// COMPOSANT SÉCURITÉ - Thème Rouge/Orange
// ============================================
const SecuritySettingsComponent = () => {
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
  });

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 bg-red-500 rounded-xl">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-red-900">Sécurité & Authentification</h2>
          <p className="text-sm text-red-600">Protégez votre compte et vos données</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-800">Double authentification (2FA)</p>
              <p className="text-sm text-red-600">Ajoutez une couche de sécurité supplémentaire</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
          <label className="block text-sm font-medium text-red-800 mb-1">Timeout de session (minutes)</label>
          <input type="number" value="30" className="w-full px-3 py-2 border border-red-200 rounded-lg bg-white" />
        </div>

        <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
          <label className="block text-sm font-medium text-red-800 mb-1">Politique de mots de passe</label>
          <select className="w-full px-3 py-2 border border-red-200 rounded-lg bg-white">
            <option>Fort (12+ caractères, chiffres, symboles)</option>
            <option>Moyen (8+ caractères, chiffres)</option>
            <option>Simple (8 caractères minimum)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button className="bg-red-600 hover:bg-red-700">Enregistrer</Button>
      </div>
    </div>
  );
};

// ============================================
// COMPOSANT FACTURATION - Thème Vert Émeraude
// ============================================
const BillingSettingsComponent = () => {
  const [plan, setPlan] = useState('pro');
  
  const plans = [
    { id: 'free', name: 'Gratuit', price: 0, color: 'gray', icon: Heart },
    { id: 'pro', name: 'Professionnel', price: 49, color: 'green', icon: Star, popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 199, color: 'purple', icon: Crown }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 bg-green-500 rounded-xl">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-900">Facturation & Abonnement</h2>
          <p className="text-sm text-green-600">Gérez votre formule et vos paiements</p>
        </div>
      </div>

      <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-green-600">Plan actuel</p>
            <p className="text-2xl font-bold text-green-700">Professionnel</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Actif</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">Prochaine facture : 15 Juin 2026 - 49€</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.id} className={`bg-white rounded-lg p-4 border-2 ${plan === p.id ? 'border-green-500 shadow-lg' : 'border-gray-200'} cursor-pointer transition-all hover:shadow-md`} onClick={() => setPlan(p.id)}>
            {p.popular && <div className="text-xs text-center text-green-600 mb-2">⭐ Le plus populaire</div>}
            <p className="font-bold text-lg">{p.name}</p>
            <p className="text-2xl font-bold mt-2">{p.price}€<span className="text-sm font-normal">/mois</span></p>
            <Button variant={plan === p.id ? 'primary' : 'outline'} className="w-full mt-4" size="sm">
              {plan === p.id ? 'Actuel' : 'Choisir'}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button className="bg-green-600 hover:bg-green-700">Mettre à jour</Button>
      </div>
    </div>
  );
};

// ============================================
// COMPOSANT API & WEBHOOKS - Thème Violet/Indigo
// ============================================
const ApiSettingsComponent = () => {
  const [apiKeys] = useState([
    { id: 1, name: 'Production API', key: 'pk_live_abc123...', createdAt: '2024-01-15' }
  ]);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 bg-purple-500 rounded-xl">
          <Key className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-purple-900">API & Webhooks</h2>
          <p className="text-sm text-purple-600">Intégrations et connecteurs</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="font-medium text-purple-800 mb-3">Clés API</h3>
          {apiKeys.map(key => (
            <div key={key.id} className="flex items-center justify-between p-3 bg-white rounded-lg mb-2">
              <div>
                <p className="font-medium">{key.name}</p>
                <p className="font-mono text-sm text-gray-500">{key.key}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </div>
          ))}
          <Button className="w-full mt-2 bg-purple-600 hover:bg-purple-700"><Plus className="w-4 h-4 mr-2" /> Générer nouvelle clé</Button>
        </div>

        <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="font-medium text-purple-800 mb-3">Webhooks</h3>
          <div className="flex gap-2">
            <input type="text" placeholder="https://votre-site.com/webhook" className="flex-1 px-3 py-2 border border-purple-200 rounded-lg bg-white" />
            <Button className="bg-purple-600">Ajouter</Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button className="bg-purple-600 hover:bg-purple-700">Sauvegarder</Button>
      </div>
    </div>
  );
};

// ============================================
// COMPOSANT NOTIFICATIONS - Thème Jaune/Ambre
// ============================================
const NotificationsSettingsComponent = () => {
  const [settings, setSettings] = useState({
    email: { marketing: true, security: true, billing: true },
    push: { mentions: true, comments: true }
  });

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 bg-amber-500 rounded-xl">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-amber-900">Notifications</h2>
          <p className="text-sm text-amber-600">Alertes et communications</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="font-medium text-amber-800 mb-3">Notifications email</h3>
          {Object.entries(settings.email).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="capitalize">{key}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={value as boolean} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="font-medium text-amber-800 mb-3">Notifications push</h3>
          {Object.entries(settings.push).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="capitalize">{key}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={value as boolean} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button className="bg-amber-600 hover:bg-amber-700">Enregistrer</Button>
      </div>
    </div>
  );
};

// ============================================
// COMPOSANT PROFIL - Thème Rose/Cerise
// ============================================
const ProfileSettingsComponent = () => {
  return (
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 bg-rose-500 rounded-xl">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-rose-900">Mon Profil</h2>
          <p className="text-sm text-rose-600">Informations personnelles et préférences</p>
        </div>
      </div>
      
      <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
        <ProfileSettings />
      </div>
    </div>
  );
};

// ============================================
// BANNIÈRE IA
// ============================================
const IATransversalBanner = () => {
  const router = useRouter();
  
  return (
    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-5 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold">Configuration IA Transversale</h3>
              <span className="text-xs bg-green-500/30 px-2 py-0.5 rounded-full">Optimisation continue</span>
            </div>
            <p className="text-purple-100 text-sm mt-1 max-w-2xl">
              L'IA analyse vos paramètres et suggère des optimisations pour améliorer la sécurité, les performances et réduire les coûts.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-purple-200">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Optimisation automatique</span>
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Recommandations personnalisées</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> Sécurité renforcée</span>
            </div>
          </div>
        </div>
        <button onClick={() => router.push('/admin/ia-settings')} className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all">
          <Brain className="w-4 h-4" /> Configuration IA
        </button>
      </div>
    </div>
  );
};

// ============================================
// STATISTIQUES
// ============================================
const StatsCards = () => {
  const cards = [
    { title: 'Sessions actives', value: '42', icon: Activity, color: 'bg-blue-500' },
    { title: 'Appels API', value: '12.8k', icon: Database, color: 'bg-purple-500' },
    { title: 'Dernier backup', value: 'Aujourd\'hui', icon: Shield, color: 'bg-green-500' },
    { title: 'Santé système', value: 'Optimal', icon: CheckCircle, color: 'bg-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className={`${card.color} p-2 rounded-lg`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-gray-500">{card.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// TABS AVEC COULEURS
// ============================================
const StyledTabsTrigger = ({ value, icon: Icon, label, color }: { value: string; icon: React.ElementType; label: string; color: string }) => (
  <TabsTrigger 
    value={value} 
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all data-[state=active]:${color} data-[state=active]:text-white data-[state=active]:shadow-md`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </TabsTrigger>
);

// ============================================
// PAGE PRINCIPALE
// ============================================
export default function SettingsPage() {
  const { stats, isLoading } = useSettings();
  const [activeTab, setActiveTab] = useState('general');

  if (isLoading && !stats) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement des paramètres..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Settings className="w-5 h-5 text-white" />
            </div>
            Paramètres
          </h1>
          <p className="text-sm text-gray-500 mt-1">Configuration de la plateforme</p>
        </div>
      </div>

      {/* Bannière IA */}
      <IATransversalBanner />

      {/* Statistiques */}
      <StatsCards />

      {/* Tabs avec couleurs personnalisées */}
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap gap-3 bg-transparent">
          <TabsTrigger value="general" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Globe className="w-4 h-4" /> Général
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Lock className="w-4 h-4" /> Sécurité
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <CreditCard className="w-4 h-4" /> Facturation
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Key className="w-4 h-4" /> API & Webhooks
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-100 text-rose-700 data-[state=active]:bg-rose-600 data-[state=active]:text-white">
            <User className="w-4 h-4" /> Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-700 data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSettingsComponent />
        </TabsContent>
        <TabsContent value="security" className="mt-6">
          <SecuritySettingsComponent />
        </TabsContent>
        <TabsContent value="billing" className="mt-6">
          <BillingSettingsComponent />
        </TabsContent>
        <TabsContent value="api" className="mt-6">
          <ApiSettingsComponent />
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <ProfileSettingsComponent />
        </TabsContent>
        <TabsContent value="notifications" className="mt-6">
          <NotificationsSettingsComponent />
        </TabsContent>
      </Tabs>

      {/* Badge IA */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t flex items-center justify-center gap-2">
        <Brain className="w-3 h-3 text-purple-400" />
        <span>Paramètres optimisés par IA • Recommandations personnalisées</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </div>
  );
}