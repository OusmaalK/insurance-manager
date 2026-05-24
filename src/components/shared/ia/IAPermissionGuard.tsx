// src/components/shared/ia/IAPermissionGuard.tsx
// Guard de permissions IA
// <90 lignes

'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIAMonetization } from '@/modules/ia-core/hooks/useIAMonetization';
import { Shield, AlertTriangle, Crown } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface IAPermissionGuardProps {
  children: React.ReactNode;
  feature: string;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

const featureRequirements: Record<string, string[]> = {
  fraud_detection: ['ADMIN', 'IA'],
  voice_assistant: ['IA'],
  advanced_reports: ['IA'],
  batch_analysis: ['IA'],
  risk_scoring: ['ADMIN', 'BROKER', 'USER'],
  renewal_prediction: ['ADMIN', 'BROKER'],
};

export const IAPermissionGuard = ({ children, feature, fallback, showUpgradePrompt = true }: IAPermissionGuardProps) => {
  const { user, isAuthenticated } = useAuth();
  const { canUseIA, state } = useIAMonetization();

  const hasPermission = () => {
    if (!isAuthenticated || !user) return false;
    
    const requirements = featureRequirements[feature];
    if (!requirements) return true;
    
    if (requirements.includes('IA')) {
      return canUseIA() && state?.tier === 'IA';
    }
    
    return requirements.includes(user.role);
  };

  if (hasPermission()) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpgradePrompt) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Fonctionnalité IA Premium</h3>
        <p className="text-sm text-gray-500 mb-4">
          Cette fonctionnalité nécessite le palier IA Premium.
          Débloquez toutes les capacités de l'intelligence artificielle.
        </p>
        <Button variant="primary">
          Passer au palier IA
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">Accès non autorisé</p>
    </div>
  );
};

export default IAPermissionGuard;