// src/components/admin/settings/NotificationSettings.tsx
'use client';

import { useState } from 'react';
import { Save, Bell, BellRing, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useSettings } from '@/hooks/useSettings';

// Types
interface EmailSettings {
  marketing: boolean;
  security: boolean;
  billing: boolean;
  features: boolean;
}

interface PushSettings {
  mentions: boolean;
  comments: boolean;
  reactions: boolean;
}

interface SystemSettings {
  maintenance: boolean;
  updates: boolean;
  backup: boolean;
}

interface NotificationCategory {
  email: EmailSettings;
  push: PushSettings;
  system: SystemSettings;
  dailyDigest: boolean;
  quietHours: boolean;
  reminderFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

type ReminderFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly';

// Composant Toggle réutilisable avec typage générique
const ToggleSwitch = ({ 
  checked, 
  onChange, 
  disabled = false 
}: { 
  checked: boolean; 
  onChange: () => void; 
  disabled?: boolean;
}) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  </label>
);

// Composant pour les paramètres email
const EmailSettingsSection = ({ 
  data, 
  onToggle 
}: { 
  data: EmailSettings; 
  onToggle: (key: keyof EmailSettings) => void;
}) => {
  const emailSettings = [
    { key: 'marketing' as const, label: 'Offres et nouveautés' },
    { key: 'security' as const, label: 'Alertes de sécurité' },
    { key: 'billing' as const, label: 'Facturation' },
    { key: 'features' as const, label: 'Nouvelles fonctionnalités' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-500" />
          Notifications email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {emailSettings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">{setting.label}</p>
              <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
            </div>
            <ToggleSwitch 
              checked={data[setting.key]} 
              onChange={() => onToggle(setting.key)} 
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Composant pour les paramètres push
const PushSettingsSection = ({ 
  data, 
  onToggle 
}: { 
  data: PushSettings; 
  onToggle: (key: keyof PushSettings) => void;
}) => {
  const pushSettings = [
    { key: 'mentions' as const, label: 'Mentions' },
    { key: 'comments' as const, label: 'Commentaires' },
    { key: 'reactions' as const, label: 'Réactions' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Notifications push
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pushSettings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">{setting.label}</p>
              <p className="text-sm text-gray-500">Recevoir des notifications push</p>
            </div>
            <ToggleSwitch 
              checked={data[setting.key]} 
              onChange={() => onToggle(setting.key)} 
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Composant pour les paramètres système
const SystemSettingsSection = ({ 
  data, 
  onToggle 
}: { 
  data: SystemSettings; 
  onToggle: (key: keyof SystemSettings) => void;
}) => {
  const systemSettings = [
    { key: 'maintenance' as const, label: 'Maintenance' },
    { key: 'updates' as const, label: 'Mises à jour' },
    { key: 'backup' as const, label: 'Sauvegardes' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Notifications système
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {systemSettings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">{setting.label}</p>
              <p className="text-sm text-gray-500">Recevoir des notifications système</p>
            </div>
            <ToggleSwitch 
              checked={data[setting.key]} 
              onChange={() => onToggle(setting.key)} 
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Composant principal
export const NotificationSettings = () => {
  const { notifications, updateNotifications, isLoading } = useSettings();
  const [formData, setFormData] = useState<NotificationCategory | null>(notifications as NotificationCategory);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    await updateNotifications(formData);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleEmailToggle = (key: keyof EmailSettings) => {
    if (!formData) return;
    setFormData({
      ...formData,
      email: { ...formData.email, [key]: !formData.email[key] }
    });
  };

  const handlePushToggle = (key: keyof PushSettings) => {
    if (!formData) return;
    setFormData({
      ...formData,
      push: { ...formData.push, [key]: !formData.push[key] }
    });
  };

  const handleSystemToggle = (key: keyof SystemSettings) => {
    if (!formData) return;
    setFormData({
      ...formData,
      system: { ...formData.system, [key]: !formData.system[key] }
    });
  };

  const handleDailyDigestToggle = () => {
    if (!formData) return;
    setFormData({ ...formData, dailyDigest: !formData.dailyDigest });
  };

  const handleQuietHoursToggle = () => {
    if (!formData) return;
    setFormData({ ...formData, quietHours: !formData.quietHours });
  };

  const handleReminderFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!formData) return;
    setFormData({ ...formData, reminderFrequency: e.target.value as ReminderFrequency });
  };

  if (!formData) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EmailSettingsSection data={formData.email} onToggle={handleEmailToggle} />
      <PushSettingsSection data={formData.push} onToggle={handlePushToggle} />
      <SystemSettingsSection data={formData.system} onToggle={handleSystemToggle} />

      {/* Paramètres supplémentaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-purple-500" />
            Préférences avancées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Digest quotidien</p>
              <p className="text-sm text-gray-500">Recevoir un résumé de toutes les notifications à 9h</p>
            </div>
            <ToggleSwitch checked={formData.dailyDigest} onChange={handleDailyDigestToggle} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications silencieuses (22h - 8h)</p>
              <p className="text-sm text-gray-500">Désactiver les sons pendant la nuit</p>
            </div>
            <ToggleSwitch checked={formData.quietHours} onChange={handleQuietHoursToggle} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fréquence des rappels</label>
            <select
              value={formData.reminderFrequency}
              onChange={handleReminderFrequencyChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="realtime">Temps réel</option>
              <option value="hourly">Toutes les heures</option>
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {saveSuccess && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Préférences mises à jour
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