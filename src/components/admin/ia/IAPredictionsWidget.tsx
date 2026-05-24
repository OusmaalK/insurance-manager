// src/components/admin/ia/IAPredictionsWidget.tsx
'use client';

import { useState } from 'react';
import { TrendingUp, Calendar, DollarSign, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

interface Prediction {
  id: number;
  label: string;
  value: string | number;
  trend: string;
  color: string;
  icon?: any;
  description?: string;
}

export const IAPredictionsWidget = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const predictions: Prediction[] = [
    { 
      id: 1,
      label: 'Sinistres prévus mois prochain', 
      value: 28, 
      trend: '+8%', 
      color: 'text-orange-600',
      icon: AlertTriangle,
      description: 'Principalement sur les contrats Auto'
    },
    { 
      id: 2,
      label: 'Montant estimé total', 
      value: '142K€', 
      trend: '+12%', 
      color: 'text-red-600',
      icon: DollarSign,
      description: 'Basé sur les tendances actuelles'
    },
    { 
      id: 3,
      label: 'Taux fraude attendu', 
      value: '18%', 
      trend: '-2%', 
      color: 'text-green-600',
      icon: TrendingUp,
      description: 'Amélioration de la détection'
    },
    { 
      id: 4,
      label: 'Délai traitement moyen', 
      value: '7.2j', 
      trend: '-15%', 
      color: 'text-blue-600',
      icon: Calendar,
      description: 'Optimisation des processus'
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <CardTitle>Prédictions IA</CardTitle>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">30 jours</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Projections basées sur l'analyse des données historiques</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {predictions.map((pred) => (
            <div key={pred.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {pred.icon && <pred.icon className={`w-3 h-3 ${pred.color}`} />}
                  <span className="text-xs text-gray-500">{pred.label}</span>
                </div>
                <span className={`text-xs font-medium ${pred.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                  {pred.trend}
                </span>
              </div>
              <p className={`text-xl font-bold mt-1 ${pred.color}`}>{pred.value}</p>
              {pred.description && (
                <p className="text-[10px] text-gray-400 mt-1">{pred.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Confidence bar */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Niveau de confiance</span>
            <span>92%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        <Button variant="ghost" size="sm" className="w-full mt-3 text-blue-600">
          Voir toutes les prédictions <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default IAPredictionsWidget;