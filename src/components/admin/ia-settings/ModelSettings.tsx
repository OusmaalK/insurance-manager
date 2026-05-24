// src/components/admin/ia-settings/ModelSettings.tsx
'use client';

import { Cpu, Database, Zap, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { MODEL_PROVIDERS } from '@/types/ia-settings.types';
import { useIASettingsStore } from '@/stores/iaSettingsStore';

export const ModelSettings = () => {
  const { settings, updateField } = useIASettingsStore();
  const models = settings?.models;

  const handleChange = (field: string, value: any) => {
    updateField('models', field, value);
  };

  if (!models) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-500" />
          Configuration du modèle IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fournisseur */}
        <div>
          <label className="block text-sm font-medium mb-2">Fournisseur IA</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(MODEL_PROVIDERS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleChange('provider', key)}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  models.provider === key
                    ? `${val.color} ring-2 ring-offset-2 ring-purple-500`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Version modèle */}
        <div>
          <label className="block text-sm font-medium mb-2">Version du modèle</label>
          <select
            value={models.modelVersion}
            onChange={(e) => handleChange('modelVersion', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Expérimental)</option>
            <option value="gemini-2.0-pro-exp">Gemini 2.0 Pro (Expérimental)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
          </select>
        </div>

        {/* Température */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Température: {models.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={models.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Précis</span>
            <span>Équilibré</span>
            <span>Créatif</span>
          </div>
        </div>

        {/* Tokens max */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tokens maximum: {models.maxTokens}
          </label>
          <input
            type="range"
            min="512"
            max="8192"
            step="512"
            value={models.maxTokens}
            onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Cache */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Activer le cache</p>
            <p className="text-sm text-gray-500">Mise en cache des réponses IA</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={models.cacheEnabled}
              onChange={(e) => handleChange('cacheEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* TTL Cache */}
        {models.cacheEnabled && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Durée de vie cache: {models.cacheTTL} secondes
            </label>
            <input
              type="range"
              min="60"
              max="86400"
              step="3600"
              value={models.cacheTTL}
              onChange={(e) => handleChange('cacheTTL', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 min</span>
              <span>1h</span>
              <span>6h</span>
              <span>12h</span>
              <span>24h</span>
            </div>
          </div>
        )}

        {/* Fallback */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Activer le fallback</p>
            <p className="text-sm text-gray-500">Utiliser un modèle secondaire en cas d'échec</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={models.fallbackEnabled}
              onChange={(e) => handleChange('fallbackEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Informations modèle */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium">Statut du modèle</p>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1">🟢 En ligne</span>
            <span className="flex items-center gap-1">⚡ Latence: 1.2s</span>
            <span className="flex items-center gap-1">📊 Précision: 94%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelSettings;