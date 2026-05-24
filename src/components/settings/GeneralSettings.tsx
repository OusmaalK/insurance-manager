// src/components/admin/settings/GeneralSettings.tsx
'use client';

import { useState } from 'react';
import { Save, Building2, Mail, Phone, MapPin, Globe, Calendar, Languages, Sun, Moon } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useSettings } from '@/hooks/useSettings';
import { TIMEZONES, DATE_FORMATS, LANGUAGES } from '@/types/settings.types';

export const GeneralSettings = () => {
  const { general, updateGeneral, isLoading } = useSettings();
  const [formData, setFormData] = useState(general);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    await updateGeneral(formData);
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

  // ✅ Vérifier si formData est null
  if (!formData) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            Informations de l'entreprise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom de l'entreprise</label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email de contact</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.companyEmail || ''}
                  onChange={(e) => handleChange('companyEmail', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.companyPhone || ''}
                  onChange={(e) => handleChange('companyPhone', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adresse</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.companyAddress || ''}
                  onChange={(e) => handleChange('companyAddress', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-500" />
            Préférences régionales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fuseau horaire</label>
              <select
                value={formData.timezone || 'Europe/Paris'}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Format de date</label>
              <select
                value={formData.dateFormat || 'DD/MM/YYYY'}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {DATE_FORMATS.map(df => (
                  <option key={df} value={df}>{df}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Langue</label>
              <select
                value={formData.language || 'fr'}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            Apparence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium mb-2">Thème</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleChange('theme', 'light')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                  formData.theme === 'light' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Sun className="w-4 h-4" /> Clair
              </button>
              <button
                type="button"
                onClick={() => handleChange('theme', 'dark')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                  formData.theme === 'dark' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Moon className="w-4 h-4" /> Sombre
              </button>
              <button
                type="button"
                onClick={() => handleChange('theme', 'system')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                  formData.theme === 'system' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Monitor className="w-4 h-4" /> Système
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </form>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Monitor = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" />
    <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
    <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
  </svg>
);