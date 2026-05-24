// src/components/shared/ia/IANotificationToast.tsx
// Toast de notification IA
// <130 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { X, Bell, AlertTriangle, CheckCircle, Info, Shield } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
}

interface IANotificationToastProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

let addNotification: (notification: Omit<Notification, 'id'>) => void;

export const IANotificationToast = ({ position = 'top-right' }: IANotificationToastProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    addNotification = (notification) => {
      const id = `${Date.now()}_${Math.random()}`;
      setNotifications(prev => [...prev, { ...notification, id }]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        notification.onClose?.();
      }, notification.duration || 5000);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className={`fixed z-50 space-y-2 ${positionClasses[position]}`}>
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`flex items-start gap-3 p-3 rounded-lg shadow-lg border w-80 animate-in slide-in-from-right ${getTypeStyles(notif.type)}`}
        >
          {getTypeIcon(notif.type)}
          <div className="flex-1">
            <p className="font-medium text-sm">{notif.title}</p>
            <p className="text-xs mt-0.5 opacity-90">{notif.message}</p>
          </div>
          <button onClick={() => removeNotification(notif.id)} className="opacity-50 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Fonction utilitaire pour afficher une notification
export const showNotification = (notification: Omit<Notification, 'id'>) => {
  if (addNotification) {
    addNotification(notification);
  } else {
    console.warn('IANotificationToast not mounted yet');
  }
};

// Notifications prédéfinies
export const showFraudAlert = (claimId: number, score: number) => {
  showNotification({
    title: '🚨 Alerte Fraude IA',
    message: `Sinistre #${claimId} - Score de fraude: ${score}%`,
    type: 'warning',
    duration: 8000,
  });
};

export const showRiskAlert = (companyName: string, score: number) => {
  showNotification({
    title: '⚠️ Risque Élevé',
    message: `${companyName} - Score de risque: ${score}%`,
    type: 'warning',
    duration: 8000,
  });
};

export const showReportReady = (reportName: string) => {
  showNotification({
    title: '📄 Rapport disponible',
    message: `Le rapport "${reportName}" est prêt à être téléchargé`,
    type: 'success',
    duration: 5000,
  });
};

export default IANotificationToast;