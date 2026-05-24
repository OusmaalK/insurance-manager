// src/components/admin/reports/AIPredictions.tsx
'use client';

import { TrendingUp, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

interface AIPredictionsProps {
  data: {
    nextMonthClaims: number;
    nextMonthFraud: number;
    renewalRate: number;
    revenueForecast: number;
    confidence: number;
  };
}

export const AIPredictions = ({ data }: AIPredictionsProps) => {
  const predictions = [
    { label: 'Sinistres prévus', value: data.nextMonthClaims, unit: 'sinistres', icon: AlertCircle, color: 'text-orange-600' },
    { label: 'Fraude attendue', value: data.nextMonthFraud, unit: 'cas', icon: AlertCircle, color: 'text-red-600' },
    { label: 'Taux renouvellement', value: data.renewalRate, unit: '%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Chiffre d\'affaires', value: data.revenueForecast, unit: 'k€', icon: TrendingUp, color: 'text-blue-600' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Prédictions IA - 30 jours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {predictions.map((pred, idx) => (
            <div key={idx} className="p-2 bg-gray-50 rounded-lg text-center">
              <pred.icon className={`w-4 h-4 mx-auto mb-1 ${pred.color}`} />
              <p className="text-lg font-bold">{pred.value}{pred.unit === '%' ? '%' : ''}</p>
              <p className="text-xs text-gray-500">{pred.label}</p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-sm font-medium text-blue-700">Niveau de confiance</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${data.confidence}%` }} />
          </div>
          <p className="text-xs text-blue-600 mt-1">{data.confidence}% de précision</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>Prédictions basées sur l'historique des 12 derniers mois</span>
        </div>
      </CardContent>
    </Card>
  );
};