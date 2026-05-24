// src/components/admin/settings/SecuritySettings.tsx
'use client';

import { useState } from 'react';
import { Save, Shield, Lock, Clock, Bell, Plus, X, AlertCircle, Fingerprint, Key, Globe } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useSettings } from '@/hooks/useSettings';

export const SecuritySettings = () => {
  const { security, updateSecurity, isLoading } = useSettings();
  const [formData, setFormData] = useState(security);
  const [newIp, setNewIp] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    await updateSecurity(formData);
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

  const addIp = () => {
    if (!formData) return;
    if (newIp && !formData.allowedIPs.includes(newIp)) {
      setFormData({
        ...formData,
        allowedIPs: [...formData.allowedIPs, newIp]
      });
      setNewIp('');
    }
  };

  const removeIp = (ip: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      allowedIPs: formData.allowedIPs.filter(i => i !== ip)
    });
  };

  // ✅ Vérifier si formData est null
  if (!formData) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Authentification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-500" />
            Authentification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Authentification à deux facteurs (2FA)</p>
              <p className="text-sm text-gray-500">Ajoute une couche de sécurité supplémentaire</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.twoFactorEnabled || false}
                onChange={(e) => handleChange('twoFactorEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Délai d'inactivité (minutes)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.sessionTimeout || 30}
                  onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiration mot de passe (jours)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.passwordExpiryDays || 90}
                  onChange={(e) => handleChange('passwordExpiryDays', parseInt(e.target.value))}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tentatives max de connexion</label>
              <input
                type="number"
                value={formData.maxLoginAttempts || 5}
                  onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Notifications de connexion</p>
              <p className="text-sm text-gray-500">Recevoir une alerte lors d'une nouvelle connexion</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.loginNotifications || false}
                onChange={(e) => handleChange('loginNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* IP Whitelist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            IP Whitelist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Activer la whitelist IP</p>
              <p className="text-sm text-gray-500">Restreindre l'accès aux IP autorisées</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.ipWhitelistEnabled || false}
                onChange={(e) => handleChange('ipWhitelistEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {formData.ipWhitelistEnabled && (
            <div>
              <label className="block text-sm font-medium mb-2">IP autorisées</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(formData.allowedIPs || []).map((ip) => (
                  <span key={ip} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {ip}
                    <button onClick={() => removeIp(ip)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="192.168.1.1"
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <Button type="button" variant="outline" onClick={addIp}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {saveSuccess && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Sauvegardé
          </span>
        )}
        <Button type="submit" disabled={isSaving || isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
        </Button>
      </div>

      {/* Badge sécurité */}
      <div className="p-3 bg-green-50 rounded-lg flex items-center gap-2">
        <Shield className="w-4 h-4 text-green-600" />
        <p className="text-sm text-green-700">Vos paramètres de sécurité sont conformes aux recommandations RGPD</p>
      </div>
    </form>
  );
};

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);