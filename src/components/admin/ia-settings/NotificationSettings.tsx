// src/components/admin/ia-settings/NotificationSettings.tsx
'use client';

import { useState } from 'react';
import { Bell, Mail, BellRing, Calendar, FileText, Plus, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useIASettingsStore } from '@/stores/iaSettingsStore';

export const NotificationSettings = () => {
  const { settings, updateField } = useIASettingsStore();
  const notifications = settings?.notifications;
  const [newRecipient, setNewRecipient] = useState('');
  const [webhookUrl, setWebhookUrl] = useState(notifications?.webhookUrl || '');

  const handleChange = (field: string, value: any) => {
    updateField('notifications', field, value);
  };

  const addRecipient = () => {
    const currentRecipients = notifications?.recipients || [];
    if (newRecipient && !currentRecipients.includes(newRecipient)) {
      handleChange('recipients', [...currentRecipients, newRecipient]);
      setNewRecipient('');
    }
  };

  const removeRecipient = (email: string) => {
    const currentRecipients = notifications?.recipients || [];
    handleChange('recipients', currentRecipients.filter((r: string) => r !== email));
  };

  const saveWebhook = () => {
    handleChange('webhookUrl', webhookUrl);
  };

  if (!notifications) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Notifications IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Notifications par email</p>
            <p className="text-sm text-gray-500">Recevoir les alertes par email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.emailEnabled}
              onChange={(e) => handleChange('emailEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Push */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Notifications push</p>
            <p className="text-sm text-gray-500">Notifications en temps réel</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.pushEnabled}
              onChange={(e) => handleChange('pushEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Alerte fraude */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Alertes fraude par email</p>
            <p className="text-sm text-gray-500">Recevoir les alertes de fraude détectée</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.fraudAlertEmail}
              onChange={(e) => handleChange('fraudAlertEmail', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>

        {/* Résumé quotidien */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Résumé quotidien</p>
            <p className="text-sm text-gray-500">Recevoir un résumé des activités IA</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.dailyDigest}
              onChange={(e) => handleChange('dailyDigest', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* Rapport hebdomadaire */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Rapport hebdomadaire IA</p>
            <p className="text-sm text-gray-500">Analyse des performances IA</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.weeklyReport}
              onChange={(e) => handleChange('weeklyReport', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Destinataires */}
        <div>
          <label className="block text-sm font-medium mb-2">Destinataires</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(notifications.recipients || []).map((email: string) => (
              <span key={email} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                {email}
                <button onClick={() => removeRecipient(email)} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              placeholder="email@exemple.com"
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Webhook */}
        <div>
          <label className="block text-sm font-medium mb-2">Webhook URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://votre-serveur.com/webhook"
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <Button type="button" variant="outline" size="sm" onClick={saveWebhook}>
              Enregistrer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;