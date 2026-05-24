// src/components/admin/ia/IAFraudAlertWidget.tsx
'use client';

import { useState } from 'react';
import { AlertCircle, Shield, Eye, CheckCircle, XCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

interface FraudAlert {
  id: number;
  level: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  claimId: number;
  score: number;
  timestamp: string;
}

export const IAFraudAlertWidget = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([
    { id: 1, level: 'critical', title: 'Sinistre #CL-2024-001', message: 'Score fraude: 92% - Action requise immédiate', claimId: 1, score: 92, timestamp: '2026-05-24T10:30:00' },
    { id: 2, level: 'high', title: 'Sinistre #CL-2024-045', message: 'Score fraude: 78% - Analyse recommandée', claimId: 2, score: 78, timestamp: '2026-05-23T14:15:00' },
    { id: 3, level: 'medium', title: 'Sinistre #CL-2024-078', message: 'Score fraude: 65% - Surveillance conseillée', claimId: 3, score: 65, timestamp: '2026-05-22T09:45:00' },
  ]);

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'critical':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: 'Critique', icon: XCircle };
      case 'high':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', badge: 'Élevé', icon: AlertTriangle };
      case 'medium':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', badge: 'Modéré', icon: AlertCircle };
      default:
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', badge: 'Faible', icon: CheckCircle };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleViewClaim = (claimId: number) => {
    window.location.href = `/admin/claims/${claimId}`;
  };

  return (
    <Card className="border-red-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <CardTitle>Alertes Fraude</CardTitle>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full animate-pulse">
              {alerts.length} active(s)
            </span>
          </div>
          <Button variant="ghost" size="sm" className="text-red-600">
            Tout traiter <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Sinistres suspects détectés par l'IA</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map(alert => {
          const styles = getLevelStyles(alert.level);
          const IconComponent = styles.icon;
          
          return (
            <div 
              key={alert.id} 
              className={`p-3 rounded-lg border ${styles.bg} ${styles.border} cursor-pointer transition-all duration-300 hover:shadow-md`}
              onClick={() => handleViewClaim(alert.claimId)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <IconComponent className={`w-4 h-4 ${styles.text}`} />
                    <p className={`text-sm font-medium ${styles.text}`}>{alert.title}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${styles.bg} ${styles.text} border ${styles.border}`}>
                      {styles.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-gray-400" />
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${getScoreColor(alert.score)}`} style={{ width: `${alert.score}%` }} />
                      </div>
                      <span className="text-xs font-medium">{alert.score}%</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
              </div>
            </div>
          );
        })}
        
        {alerts.length === 0 && (
          <div className="text-center py-6">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aucune alerte de fraude</p>
            <p className="text-xs text-gray-400">Tous les sinistres sont sous contrôle</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IAFraudAlertWidget;