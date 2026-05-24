// src/components/admin/ia-settings/FraudDetectionSettings.tsx
'use client';

import { useState } from 'react';
import { Shield, AlertCircle, Bell, Clock, Mail, Plus, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { SENSITIVITY_LEVELS, getSensitivityLabel, getSensitivityColor } from '@/types/ia-settings.types';
import { useIASettingsStore } from '@/stores/iaSettingsStore';

export const FraudDetectionSettings = () => {
  const { settings, updateField, updateSection } = useIASettingsStore();
  const fraudDetection = settings?.fraudDetection;
  const [newEmail, setNewEmail] = useState('');
  const [newFactor, setNewFactor] = useState('');

  const handleChange = (field: string, value: any) => {
    updateField('fraudDetection', field, value);
  };

  const addEmail = () => {
    if (newEmail && !fraudDetection?.notificationEmails?.includes(newEmail)) {
      const currentEmails = fraudDetection?.notificationEmails || [];
      updateField('fraudDetection', 'notificationEmails', [...currentEmails, newEmail]);
      setNewEmail('');
    }
  };

  const removeEmail = (email: string) => {
    const currentEmails = fraudDetection?.notificationEmails || [];
    updateField('fraudDetection', 'notificationEmails', currentEmails.filter((e: string) => e !== email));
  };

  const addFactor = () => {
    if (newFactor && !fraudDetection?.suspiciousFactors?.includes(newFactor)) {
      const currentFactors = fraudDetection?.suspiciousFactors || [];
      updateField('fraudDetection', 'suspiciousFactors', [...currentFactors, newFactor]);
      setNewFactor('');
    }
  };

  const removeFactor = (factor: string) => {
    const currentFactors = fraudDetection?.suspiciousFactors || [];
    updateField('fraudDetection', 'suspiciousFactors', currentFactors.filter((f: string) => f !== factor));
  };

  if (!fraudDetection) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          Détection de fraude IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Activation */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Activer la détection de fraude</p>
            <p className="text-sm text-gray-500">Analyse automatique des sinistres suspects</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={fraudDetection.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>

        {/* Sensibilité */}
        <div>
          <label className="block text-sm font-medium mb-2">Niveau de sensibilité</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(SENSITIVITY_LEVELS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleChange('sensitivityLevel', key)}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  fraudDetection.sensitivityLevel === key
                    ? `${val.color} ring-2 ring-offset-2 ring-purple-500`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Seuil d'alerte */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Seuil d'alerte: {fraudDetection.alertThreshold}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={fraudDetection.alertThreshold}
            onChange={(e) => handleChange('alertThreshold', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Faible</span>
            <span>Modéré</span>
            <span>Élevé</span>
            <span>Critique</span>
          </div>
        </div>

        {/* Auto-alerte */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Alertes automatiques</p>
            <p className="text-sm text-gray-500">Notification en cas de fraude détectée</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={fraudDetection.autoAlert}
              onChange={(e) => handleChange('autoAlert', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>

        {/* Délai d'analyse */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Délai d'analyse: {fraudDetection.analysisDelay} minutes
          </label>
          <input
            type="range"
            min="1"
            max="60"
            value={fraudDetection.analysisDelay}
            onChange={(e) => handleChange('analysisDelay', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Facteurs suspects */}
        <div>
          <label className="block text-sm font-medium mb-2">Facteurs de suspicion</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(fraudDetection.suspiciousFactors || []).map((factor: string) => (
              <span key={factor} className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                {factor}
                <button onClick={() => removeFactor(factor)} className="hover:text-red-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFactor}
              onChange={(e) => setNewFactor(e.target.value)}
              placeholder="Nouveau facteur..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <Button type="button" variant="outline" size="sm" onClick={addFactor}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Emails de notification */}
        <div>
          <label className="block text-sm font-medium mb-2">Emails de notification</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(fraudDetection.notificationEmails || []).map((email: string) => (
              <span key={email} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                {email}
                <button onClick={() => removeEmail(email)} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="email@exemple.com"
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <Button type="button" variant="outline" size="sm" onClick={addEmail}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudDetectionSettings;