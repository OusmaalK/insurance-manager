// src/components/admin/shared/IAAlertBanner.tsx
// Bannière d'alerte IA (composant admin)
// <80 lignes

'use client';

import React from 'react';
import { Button } from '@/shared/ui/Button';
import { AlertTriangle, Shield, Bell, X } from 'lucide-react';

interface IAAlertBannerProps {
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  onAction?: () => void;
  onClose?: () => void;
  actionLabel?: string;
}

export const IAAlertBanner = ({ type, title, message, onAction, onClose, actionLabel = 'Voir les détails' }: IAAlertBannerProps) => {
  const styles = {
    critical: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    critical: <AlertTriangle className="w-5 h-5 text-red-600" />,
    warning: <Bell className="w-5 h-5 text-yellow-600" />,
    info: <Shield className="w-5 h-5 text-blue-600" />,
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[type]} relative`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1"><h3 className="font-semibold">{title}</h3><p className="text-sm mt-1">{message}</p></div>
        {onAction && <Button variant="outline" size="sm" onClick={onAction}>{actionLabel}</Button>}
        {onClose && <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
      </div>
    </div>
  );
};

export default IAAlertBanner;