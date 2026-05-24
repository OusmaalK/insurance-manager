// src/hooks/useSettings.ts
import { useState, useEffect, useCallback, useMemo } from 'react';

// Types
export interface GeneralSettings {
  platformName: string;
  language: string;
  timezone: string;
  dateFormat: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordPolicy: string;
}

export interface BillingSettings {
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  billingEmail: string;
  vatNumber: string;
  invoicePrefix: string;
  paymentMethod: string;
  autoRenew: boolean;
  nextInvoiceDate: string;
}

export interface ApiSettings {
  rateLimit: number;
  apiKeys: Array<{ id: number; name: string; key: string; createdAt: string }>;
}

export interface NotificationSettings {
  email: { marketing: boolean; security: boolean; billing: boolean; features: boolean };
  push: { mentions: boolean; comments: boolean; reactions: boolean };
  system: { maintenance: boolean; updates: boolean; backup: boolean };
  dailyDigest: boolean;
  quietHours: boolean;
  reminderFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

export interface SettingsStats {
  activeSessions: number;
  apiCalls: number;
  lastBackup: string | null;
  systemHealth: 'HEALTHY' | 'DEGRADED' | 'DOWN';
}

// Interface complète des paramètres
export interface CompleteSettings {
  general: GeneralSettings | null;
  security: SecuritySettings | null;
  billing: BillingSettings | null;
  apiSettings: ApiSettings | null;
  notifications: NotificationSettings | null;
  stats: SettingsStats | null;
  updatedAt?: string;
  updatedBy?: string;
}

export const useSettings = () => {
  // États
  const [general, setGeneral] = useState<GeneralSettings | null>(null);
  const [security, setSecurity] = useState<SecuritySettings | null>(null);
  const [billing, setBilling] = useState<BillingSettings | null>(null);
  const [apiSettings, setApiSettings] = useState<ApiSettings | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null);
  const [stats, setStats] = useState<SettingsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | undefined>(undefined);
  const [updatedBy, setUpdatedBy] = useState<string | undefined>(undefined);

  // Objet settings agrégé (calculé avec useMemo pour optimisation)
  const settings = useMemo<CompleteSettings>(() => ({
    general,
    security,
    billing,
    apiSettings,
    notifications,
    stats,
    updatedAt,
    updatedBy
  }), [general, security, billing, apiSettings, notifications, stats, updatedAt, updatedBy]);

  // Fonction pour mettre à jour l'objet settings complet
  const setSettings = useCallback((newSettings: Partial<CompleteSettings>) => {
    if (newSettings.general !== undefined) setGeneral(newSettings.general);
    if (newSettings.security !== undefined) setSecurity(newSettings.security);
    if (newSettings.billing !== undefined) setBilling(newSettings.billing);
    if (newSettings.apiSettings !== undefined) setApiSettings(newSettings.apiSettings);
    if (newSettings.notifications !== undefined) setNotifications(newSettings.notifications);
    if (newSettings.stats !== undefined) setStats(newSettings.stats);
    if (newSettings.updatedAt !== undefined) setUpdatedAt(newSettings.updatedAt);
    if (newSettings.updatedBy !== undefined) setUpdatedBy(newSettings.updatedBy);
  }, []);

  // Fonction fetchSettings - Charge tous les paramètres
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Appels API parallèles
      const [generalRes, securityRes, billingRes, apiRes, notifRes, statsRes] = await Promise.allSettled([
        fetch('/api/settings/general'),
        fetch('/api/settings/security'),
        fetch('/api/settings/billing'),
        fetch('/api/settings/api'),
        fetch('/api/settings/notifications'),
        fetch('/api/settings/stats')
      ]);

      // Traitement des réponses
      if (generalRes.status === 'fulfilled' && generalRes.value.ok) {
        setGeneral(await generalRes.value.json());
      } else {
        setGeneral(getDefaultGeneralSettings());
      }

      if (securityRes.status === 'fulfilled' && securityRes.value.ok) {
        setSecurity(await securityRes.value.json());
      } else {
        setSecurity(getDefaultSecuritySettings());
      }

      if (billingRes.status === 'fulfilled' && billingRes.value.ok) {
        setBilling(await billingRes.value.json());
      } else {
        setBilling(getDefaultBillingSettings());
      }

      if (apiRes.status === 'fulfilled' && apiRes.value.ok) {
        setApiSettings(await apiRes.value.json());
      } else {
        setApiSettings(getDefaultApiSettings());
      }

      if (notifRes.status === 'fulfilled' && notifRes.value.ok) {
        setNotifications(await notifRes.value.json());
      } else {
        setNotifications(getDefaultNotificationSettings());
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        setStats(await statsRes.value.json());
      } else {
        setStats(getDefaultStats());
      }

      // Métadonnées
      setUpdatedAt(new Date().toISOString());
      setUpdatedBy('system');

    } catch (err) {
      console.error('Erreur chargement des paramètres:', err);
      setError('Erreur lors du chargement des paramètres');
      
      // Valeurs par défaut en cas d'erreur
      setGeneral(getDefaultGeneralSettings());
      setSecurity(getDefaultSecuritySettings());
      setBilling(getDefaultBillingSettings());
      setApiSettings(getDefaultApiSettings());
      setNotifications(getDefaultNotificationSettings());
      setStats(getDefaultStats());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Fonctions de mise à jour
  const updateGeneral = async (data: GeneralSettings) => {
    try {
      const response = await fetch('/api/settings/general', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const updated = await response.json();
        setGeneral(updated);
        setUpdatedAt(new Date().toISOString());
        setUpdatedBy('user');
        return updated;
      }
      throw new Error('Erreur mise à jour paramètres généraux');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateSecurity = async (data: SecuritySettings) => {
    try {
      const response = await fetch('/api/settings/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const updated = await response.json();
        setSecurity(updated);
        setUpdatedAt(new Date().toISOString());
        setUpdatedBy('user');
        return updated;
      }
      throw new Error('Erreur mise à jour sécurité');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateBilling = async (data: BillingSettings) => {
    try {
      const response = await fetch('/api/settings/billing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const updated = await response.json();
        setBilling(updated);
        setUpdatedAt(new Date().toISOString());
        setUpdatedBy('user');
        return updated;
      }
      throw new Error('Erreur mise à jour facturation');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateApiSettings = async (data: ApiSettings) => {
    try {
      const response = await fetch('/api/settings/api', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const updated = await response.json();
        setApiSettings(updated);
        setUpdatedAt(new Date().toISOString());
        setUpdatedBy('user');
        return updated;
      }
      throw new Error('Erreur mise à jour API');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateNotifications = async (data: NotificationSettings) => {
    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const updated = await response.json();
        setNotifications(updated);
        setUpdatedAt(new Date().toISOString());
        setUpdatedBy('user');
        return updated;
      }
      throw new Error('Erreur mise à jour notifications');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteApiKey = async (id: number) => {
    try {
      const response = await fetch(`/api/settings/api/keys/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok && apiSettings) {
        const updatedKeys = apiSettings.apiKeys.filter(key => key.id !== id);
        setApiSettings({ ...apiSettings, apiKeys: updatedKeys });
        setUpdatedAt(new Date().toISOString());
        setUpdatedBy('user');
        return true;
      }
      throw new Error('Erreur suppression clé API');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Fonctions de réinitialisation
  const resetSettings = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetch('/api/settings/general/reset', { method: 'POST' }),
        fetch('/api/settings/security/reset', { method: 'POST' }),
        fetch('/api/settings/billing/reset', { method: 'POST' })
      ]);
      await fetchSettings(); // Recharger après reset
    } catch (error) {
      console.error('Erreur reset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Valeurs par défaut
  const getDefaultGeneralSettings = (): GeneralSettings => ({
    platformName: 'Courtier IA',
    language: 'Français',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY'
  });

  const getDefaultSecuritySettings = (): SecuritySettings => ({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordPolicy: 'medium'
  });

  const getDefaultBillingSettings = (): BillingSettings => ({
    plan: 'FREE',
    billingEmail: '',
    vatNumber: '',
    invoicePrefix: 'INV-',
    paymentMethod: 'CARD',
    autoRenew: true,
    nextInvoiceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });

  const getDefaultApiSettings = (): ApiSettings => ({
    rateLimit: 1000,
    apiKeys: []
  });

  const getDefaultNotificationSettings = (): NotificationSettings => ({
    email: { marketing: true, security: true, billing: true, features: false },
    push: { mentions: true, comments: true, reactions: false },
    system: { maintenance: true, updates: true, backup: true },
    dailyDigest: false,
    quietHours: true,
    reminderFrequency: 'daily'
  });

  const getDefaultStats = (): SettingsStats => ({
    activeSessions: 0,
    apiCalls: 0,
    lastBackup: null,
    systemHealth: 'HEALTHY'
  });

  return {
    // États individuels (pour compatibilité existante)
    general,
    security,
    billing,
    apiSettings,
    notifications,
    stats,
    isLoading,
    error,
    updatedAt,
    updatedBy,
    
    // Objet settings agrégé (NOUVEAU)
    settings,
    
    // Fonctions
    fetchSettings,
    setSettings,        // NOUVEAU : pour mettre à jour plusieurs settings à la fois
    updateGeneral,
    updateSecurity,
    updateBilling,
    updateApiSettings,
    updateNotifications,
    deleteApiKey,
    resetSettings
  };
};