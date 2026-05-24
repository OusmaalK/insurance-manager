// src/components/admin/claims/ClaimFraudAlert.tsx
// Alerte de fraude pour sinistre
// <120 lignes

'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

// Icônes
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';

interface ClaimFraudAlertProps {
  claimId: number;
  fraudScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  onView?: () => void;
  onResolve?: () => void;
  isLoading?: boolean;
}

export const ClaimFraudAlert = ({ claimId, fraudScore, riskLevel, message, onView, onResolve, isLoading = false }: ClaimFraudAlertProps) => {
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'CRITICAL': return 'border-l-red-600 bg-red-50';
      case 'HIGH': return 'border-l-orange-500 bg-orange-50';
      case 'MEDIUM': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-green-500 bg-green-50';
    }
  };

  const getRiskBadge = () => {
    switch (riskLevel) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <Card className={`border-l-4 ${getRiskColor()}`}>
        <CardContent className="p-4 flex justify-center">
          <LoadingSpinner size="sm" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-l-4 ${getRiskColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'bg-red-100' : riskLevel === 'MEDIUM' ? 'bg-yellow-100' : 'bg-green-100'}`}>
              {riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <Shield className="w-5 h-5 text-green-600" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold">Sinistre #{claimId}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getRiskBadge()}`}>{riskLevel}</span>
                <span className="text-sm text-gray-600">Score: {fraudScore}%</span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{message}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {onView && <Button variant="outline" size="sm" onClick={onView}><Eye className="w-4 h-4 mr-1" />Voir</Button>}
            {onResolve && <Button variant="success" size="sm" onClick={onResolve}><CheckCircle className="w-4 h-4 mr-1" />Résoudre</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimFraudAlert;