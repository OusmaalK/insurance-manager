// src/components/admin/reports/AIFraudMetrics.tsx
'use client';

import { Shield, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

interface AIFraudMetricsProps {
  data: {
    fraudScore: number;
    fraudAlerts: number;
    fraudTrend: number;
    suspiciousClaims: number;
    blockedAmount: number;
  };
}

export const AIFraudMetrics = ({ data }: AIFraudMetricsProps) => {
  const metrics = [
    { label: 'Score fraude', value: data.fraudScore, unit: '%', icon: Shield, color: 'text-red-600' },
    { label: 'Alertes', value: data.fraudAlerts, icon: AlertTriangle, color: 'text-orange-600' },
    { label: 'Tendance', value: data.fraudTrend, unit: '%', icon: TrendingUp, color: data.fraudTrend > 0 ? 'text-red-600' : 'text-green-600' },
    { label: 'Sinistres suspects', value: data.suspiciousClaims, icon: Clock, color: 'text-yellow-600' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          Métriques Anti-Fraude IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
              <metric.icon className={`w-5 h-5 mx-auto mb-2 ${metric.color}`} />
              <p className="text-xl font-bold">{metric.value}{metric.unit || ''}</p>
              <p className="text-xs text-gray-500">{metric.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 p-2 bg-red-50 rounded-lg text-center">
          <p className="text-sm font-medium text-red-700">Montant bloqué: {data.blockedAmount.toLocaleString()}€</p>
        </div>
      </CardContent>
    </Card>
  );
};