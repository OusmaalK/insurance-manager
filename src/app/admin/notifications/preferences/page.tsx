// src/app/admin/notifications/preferences/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Bell, Mail, BellRing, Calendar, Clock, 
  Save, RefreshCw, AlertCircle, CheckCircle, Brain, 
  Sparkles, Zap, Target, Award
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { notificationsApi } from '@/modules/api/notifications/notifications.api';
import { NotificationPreferences as NotificationPreferencesType } from '@/types/notification.types';

export default function PreferencesPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<NotificationPreferencesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationsApi.getPreferences();
      setPreferences((response as any).data || response);
    } catch (err) {
      console.error('Failed to load preferences', err);
      // Données mockées
      setPreferences({
        id: 1,
        userId: 1,
        emailEnabled: true,
        pushEnabled: true,
        inAppEnabled: true,
        categories: {
          SYSTEM: true,
          IA: true,
          USER: true,
          CLAIM: true,
          POLICY: true,
          COMPANY: true,
        },
        priorities: {
          LOW: true,
          MEDIUM: true,
          HIGH: true,
          URGENT: true,
        },
        digestFrequency: 'REALTIME',
        quietHours: { enabled: false, start: '22:00', end: '08:00' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;
    setIsSaving(true);
    setError(null);
    try {
      await notificationsApi.updatePreferences(preferences);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save preferences', err);
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategoryChange = (category: string, value: boolean) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      categories: { ...preferences.categories, [category]: value },
    });
  };

  const handlePriorityChange = (priority: string, value: boolean) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      priorities: { ...preferences.priorities, [priority]: value },
    });
  };

  const handleQuietHoursChange = (field: string, value: any) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      quietHours: { ...preferences.quietHours, [field]: value },
    });
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement des préférences..." />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-600">Erreur de chargement</p>
          <Button variant="primary" className="mt-4" onClick={loadPreferences}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header avec retour */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/notifications" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Préférences de notification</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configurez comment vous souhaitez recevoir les notifications
          </p>
        </div>
      </div>

      {/* Bannière IA */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6" />
          <div>
            <p className="text-sm font-medium">IA Transversale Active</p>
            <p className="text-xs text-purple-200">
              L'IA optimisera l'envoi de vos notifications en fonction de vos préférences
            </p>
          </div>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex justify-end gap-3">
        {saveSuccess && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Préférences sauvegardées
          </span>
        )}
        {error && (
          <span className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {error}
          </span>
        )}
        <Button variant="outline" onClick={loadPreferences}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Réinitialiser
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
        </Button>
      </div>

      {/* Canaux de notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            Canaux de notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Notifications par email</p>
              <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailEnabled}
                onChange={(e) => handleFieldChange('emailEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Notifications push</p>
              <p className="text-sm text-gray-500">Notifications en temps réel sur le navigateur</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.pushEnabled}
                onChange={(e) => handleFieldChange('pushEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Notifications dans l'application</p>
              <p className="text-sm text-gray-500">Affichage dans le centre de notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.inAppEnabled}
                onChange={(e) => handleFieldChange('inAppEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Catégories à suivre */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-purple-500" />
            Catégories à suivre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(preferences.categories).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleCategoryChange(key, e.target.checked)}
                  className="w-4 h-4 accent-purple-600"
                />
                <span className="text-sm capitalize">{key.toLowerCase()}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priorités à recevoir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Priorités à recevoir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(preferences.priorities).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePriorityChange(key, e.target.checked)}
                  className="w-4 h-4 accent-orange-600"
                />
                <span className="text-sm capitalize">{key.toLowerCase()}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fréquence et heures silencieuses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Fréquence du résumé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={preferences.digestFrequency}
              onChange={(e) => handleFieldChange('digestFrequency', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="REALTIME">Temps réel</option>
              <option value="HOURLY">Horaire</option>
              <option value="DAILY">Quotidien</option>
              <option value="WEEKLY">Hebdomadaire</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Les notifications seront regroupées selon la fréquence choisie
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Heures silencieuses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.quietHours.enabled}
                onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
                className="w-4 h-4 accent-amber-600"
              />
              <span className="text-sm">Activer les heures silencieuses</span>
            </label>
            {preferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Début</label>
                  <input
                    type="time"
                    value={preferences.quietHours.start}
                    onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fin</label>
                  <input
                    type="time"
                    value={preferences.quietHours.end}
                    onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Badge IA */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t flex items-center justify-center gap-2">
        <Brain className="w-3 h-3 text-purple-400" />
        <span>Préférences optimisées par IA • Mise à jour en temps réel</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </div>
  );
}