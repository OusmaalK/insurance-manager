// src/components/admin/ia-settings/IASettingsForm.tsx
'use client';

import { useEffect } from 'react';
import { Save, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useIASettingsStore } from '@/stores/iaSettingsStore';
import { FraudDetectionSettings } from './FraudDetectionSettings';
import { AutoApprovalSettings } from './AutoApprovalSettings';
import { NotificationSettings } from './NotificationSettings';
import { PrivacySettings } from './PrivacySettings';
import { ModelSettings } from './ModelSettings';
import { ThresholdSettings } from './ThresholdSettings';

interface IASettingsFormProps {
  onSave?: (settings: any) => Promise<void>;
  onReset?: () => Promise<void>;
  onTest?: () => Promise<{ success: boolean; message: string }>;
  isLoading?: boolean;
}

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const IASettingsForm = ({ 
  onSave, 
  onReset, 
  onTest,
  isLoading = false 
}: IASettingsFormProps) => {
  const { 
    settings, 
    isSaving, 
    testResult, 
    activeTab,
    setActiveTab,
    setTestResult,
    setSaving,
    resetSettings
  } = useIASettingsStore();

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    await onSave(settings);
    setSaving(false);
  };

  const handleReset = async () => {
    if (confirm('Confirmer la réinitialisation des paramètres IA ?')) {
      resetSettings();
      await onReset?.();
    }
  };

  const handleTest = async () => {
    if (!onTest) return;
    const result = await onTest();
    setTestResult(result);
    setTimeout(() => setTestResult(null), 5000);
  };

  if (!settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Chargement de la configuration..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barre d'actions */}
      <div className="flex justify-end gap-3">
        {onTest && (
          <Button variant="outline" onClick={handleTest}>
            <Zap className="w-4 h-4 mr-2" />
            Tester la configuration
          </Button>
        )}
        {onReset && (
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        )}
        <Button variant="primary" onClick={handleSave} disabled={isSaving || isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving || isLoading ? 'Sauvegarde...' : 'Enregistrer'}
        </Button>
      </div>

      {/* Résultat du test */}
      {testResult && (
        <div className={`p-3 rounded-lg flex items-center gap-2 ${
          testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {testResult.success ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <p className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
            {testResult.message}
          </p>
        </div>
      )}

      {/* Tabs de configuration */}
      <Tabs 
        defaultValue="fraud"
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="flex flex-wrap gap-1 sm:gap-2">
          <TabsTrigger value="fraud" className="text-xs sm:text-sm px-2 sm:px-3">🛡️ Anti-Fraude</TabsTrigger>
          <TabsTrigger value="auto" className="text-xs sm:text-sm px-2 sm:px-3">⚡ Auto-approbation</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm px-2 sm:px-3">🔔 Notifications</TabsTrigger>
          <TabsTrigger value="privacy" className="text-xs sm:text-sm px-2 sm:px-3">🔒 Confidentialité</TabsTrigger>
          <TabsTrigger value="models" className="text-xs sm:text-sm px-2 sm:px-3">🧠 Modèles</TabsTrigger>
          <TabsTrigger value="thresholds" className="text-xs sm:text-sm px-2 sm:px-3">📊 Seuils</TabsTrigger>
        </TabsList>

        <TabsContent value="fraud" className="mt-4">
          <FraudDetectionSettings />
        </TabsContent>

        <TabsContent value="auto" className="mt-4">
          <AutoApprovalSettings />
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="privacy" className="mt-4">
          <PrivacySettings />
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <ModelSettings />
        </TabsContent>

        <TabsContent value="thresholds" className="mt-4">
          <ThresholdSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IASettingsForm;