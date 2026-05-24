// src/components/admin/ia-settings/PrivacySettings.tsx
'use client';

import { Lock, Database, Users, FileText, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useIASettingsStore } from '@/stores/iaSettingsStore';

export const PrivacySettings = () => {
  const { settings, updateField } = useIASettingsStore();
  const privacy = settings?.privacy;

  const handleChange = (field: string, value: any) => {
    updateField('privacy', field, value);
  };

  if (!privacy) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-500" />
          Confidentialité et Sécurité
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rétention données */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rétention des données: {privacy.dataRetentionDays} jours
          </label>
          <input
            type="range"
            min="30"
            max="1095"
            step="30"
            value={privacy.dataRetentionDays}
            onChange={(e) => handleChange('dataRetentionDays', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>30j</span>
            <span>1 an</span>
            <span>2 ans</span>
            <span>3 ans</span>
          </div>
        </div>

        {/* Anonymisation */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Anonymiser les données</p>
            <p className="text-sm text-gray-500">Supprimer les informations personnelles</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.anonymizeData}
              onChange={(e) => handleChange('anonymizeData', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Partage données */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Autoriser le partage de données</p>
            <p className="text-sm text-gray-500">Partage anonyme pour amélioration IA</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.allowDataSharing}
              onChange={(e) => handleChange('allowDataSharing', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Logs d'audit */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Activer les logs d'audit</p>
            <p className="text-sm text-gray-500">Traçabilité des actions IA</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.auditLogs}
              onChange={(e) => handleChange('auditLogs', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Consentement utilisateur */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Consentement utilisateur requis</p>
            <p className="text-sm text-gray-500">Demander l'accord avant analyse IA</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.userConsentRequired}
              onChange={(e) => handleChange('userConsentRequired', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Informations RGPD */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-700">Conformité RGPD</p>
          <p className="text-xs text-blue-600 mt-1">Les paramètres actuels sont conformes au RGPD.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;