// src/components/admin/settings/ApiSettings.tsx
'use client';

import { useState } from 'react';
import { Save, Key, Plus, X, Copy, Eye, EyeOff, RefreshCw, Globe, Zap } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useSettings } from '@/hooks/useSettings';

export const ApiSettings = () => {
  const { apiSettings, updateApiSettings, createApiKey, deleteApiKey, isLoading } = useSettings();
  const [formData, setFormData] = useState(apiSettings);
  const [newKeyName, setNewKeyName] = useState('');
  const [showKeys, setShowKeys] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [webhookSuccess, setWebhookSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    await updateApiSettings(formData);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // ✅ Correction : Vérifier que formData existe avant de modifier
  const handleChange = (field: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleCreateKey = async () => {
    if (!newKeyName) return;
    await createApiKey(newKeyName);
    setNewKeyName('');
  };

  const handleDeleteKey = async (id: number) => {
    if (confirm('Confirmer la suppression de cette clé API ?')) {
      await deleteApiKey(id);
    }
  };

  const handleTestWebhook = async () => {
    setWebhookSuccess(true);
    setTimeout(() => setWebhookSuccess(false), 3000);
  };

  const toggleShowKey = (id: number) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // ✅ Vérifier si formData est null
  if (!formData) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Clés API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" />
            Clés API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {formData.apiKeys && formData.apiKeys.length > 0 ? (
              formData.apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-white px-2 py-1 rounded">
                        {showKeys[key.id] ? key.key : '••••••••••••••••••••••••••••'}
                      </code>
                      <button
                        type="button"
                        onClick={() => toggleShowKey(key.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showKeys[key.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(key.key)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Créée le {new Date(key.createdAt).toLocaleDateString()} • Dernière utilisation {new Date(key.lastUsed).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteKey(key.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Aucune clé API créée</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Nom de la clé API"
              className="flex-1 px-3 py-2 border rounded-lg"
            />
            <Button type="button" variant="outline" onClick={handleCreateKey}>
              <Plus className="w-4 h-4 mr-2" />
              Créer une clé
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Les clés API permettent d&apos;accéder à l&apos;API de la plateforme. Conservez-les secrètes.
          </p>
        </CardContent>
      </Card>

      {/* Webhook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Webhook
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">URL du webhook</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.webhookUrl || ''}
                onChange={(e) => handleChange('webhookUrl', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="https://votre-serveur.com/webhook"
              />
              <Button type="button" variant="outline" onClick={handleTestWebhook}>
                <Zap className="w-4 h-4 mr-2" />
                Tester
              </Button>
            </div>
            {webhookSuccess && (
              <p className="text-xs text-green-600 mt-1">✅ Webhook testé avec succès</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Événements à envoyer</label>
            <div className="grid grid-cols-2 gap-2">
              {['claim.created', 'claim.updated', 'policy.renewed', 'policy.expired', 'user.created', 'report.generated'].map((event) => (
                <label key={event} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(formData.webhookEvents || []).includes(event)}
                    onChange={(e) => {
                      const currentEvents = formData.webhookEvents || [];
                      const newEvents = e.target.checked
                        ? [...currentEvents, event]
                        : currentEvents.filter(ev => ev !== event);
                      handleChange('webhookEvents', newEvents);
                    }}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm">{event}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate limiting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-500" />
            Rate Limiting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Requêtes par minute</label>
            <input
              type="number"
              value={formData.rateLimit || 1000}
              onChange={(e) => handleChange('rateLimit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Nombre maximum de requêtes par minute par utilisateur</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Origines autorisées (CORS)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(formData.allowedOrigins || []).map((origin) => (
                <span key={origin} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                  {origin}
                  <button
                    type="button"
                    onClick={() => handleChange('allowedOrigins', (formData.allowedOrigins || []).filter(o => o !== origin))}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://exemple.com"
                className="flex-1 px-3 py-2 border rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value && !(formData.allowedOrigins || []).includes(input.value)) {
                      handleChange('allowedOrigins', [...(formData.allowedOrigins || []), input.value]);
                      input.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {saveSuccess && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Configuration sauvegardée
          </span>
        )}
        <Button type="submit" disabled={isSaving || isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);