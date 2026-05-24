// src/components/admin/ia/IAInsightsWidget.tsx
'use client';

import { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Lightbulb, Zap, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

interface Insight {
  id: number;
  type: 'warning' | 'success' | 'info' | 'trend';
  title: string;
  message: string;
  impact?: string;
  action: string;
  icon?: any;
}

export const IAInsightsWidget = () => {
  const [insights, setInsights] = useState<Insight[]>([
    { 
      id: 1, 
      type: 'warning', 
      title: 'Augmentation des sinistres Auto', 
      message: '+23% ce trimestre vs trimestre précédent', 
      impact: 'Risque de hausse des primes',
      action: 'Analyser tendances',
      icon: TrendingUp
    },
    { 
      id: 2, 
      type: 'success', 
      title: 'Détection fraude améliorée', 
      message: 'Précision +12% après mise à jour modèle', 
      impact: 'Économies estimées: 45K€',
      action: 'Voir détails',
      icon: Shield
    },
    { 
      id: 3, 
      type: 'info', 
      title: 'Corrélation sinistres/contrats', 
      message: 'Les contrats Habitation présentent 40% de sinistres en moins', 
      impact: 'Opportunité cross-sell',
      action: 'Explorer',
      icon: Lightbulb
    },
    { 
      id: 4, 
      type: 'trend', 
      title: 'Prédiction résiliation', 
      message: '3 entreprises présentent un risque élevé', 
      impact: 'À contacter avant échéance',
      action: 'Voir la liste',
      icon: AlertCircle
    },
  ]);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return { bg: 'bg-orange-50', border: 'border-l-4 border-orange-500', text: 'text-orange-800', icon: AlertCircle };
      case 'success':
        return { bg: 'bg-green-50', border: 'border-l-4 border-green-500', text: 'text-green-800', icon: CheckCircle };
      case 'trend':
        return { bg: 'bg-blue-50', border: 'border-l-4 border-blue-500', text: 'text-blue-800', icon: TrendingUp };
      default:
        return { bg: 'bg-purple-50', border: 'border-l-4 border-purple-500', text: 'text-purple-800', icon: Lightbulb };
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <CardTitle>Insights IA Transversale</CardTitle>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Corrélé</span>
          </div>
          <Button variant="ghost" size="sm" className="text-purple-600">
            Voir tout <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Analyses croisées entre sinistres, contrats et entreprises</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map(insight => {
          const styles = getTypeStyles(insight.type);
          const IconComponent = insight.icon || styles.icon;
          
          return (
            <div 
              key={insight.id} 
              className={`p-3 rounded-lg ${styles.bg} ${styles.border} transition-all duration-300 hover:shadow-md`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 ${styles.text}`} />
                    <p className={`text-sm font-medium ${styles.text}`}>{insight.title}</p>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                  {insight.impact && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Impact: {insight.impact}
                    </p>
                  )}
                </div>
                <button className={`text-xs ${styles.text} hover:underline ml-2 whitespace-nowrap`}>
                  {insight.action} →
                </button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default IAInsightsWidget;