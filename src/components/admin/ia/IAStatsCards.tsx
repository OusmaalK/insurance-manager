// src/components/admin/ia/IAStatsCards.tsx
'use client';

import { AlertTriangle, Euro, Clock, Shield, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'stable';
  description?: string;
}

interface IAStatsCardsProps {
  stats: {
    total?: number;
    totalAmount?: number;
    pendingCount?: number;
    fraudAlerts?: number;
    approvedCount?: number;
    rejectedCount?: number;
    avgProcessingDays?: number;
  };
  isLoading: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const IAStatsCards = ({ stats, isLoading, variant = 'default' }: IAStatsCardsProps) => {
  const cards: StatCard[] = [
    { 
      title: 'Total sinistres', 
      value: stats?.total || 0, 
      icon: AlertTriangle, 
      color: 'bg-blue-500',
      trend: '+5%',
      trendDirection: 'up',
      description: 'vs mois dernier'
    },
    { 
      title: 'Montant total', 
      value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats?.totalAmount || 0), 
      icon: Euro, 
      color: 'bg-green-500',
      trend: '+8%',
      trendDirection: 'up',
      description: 'cumul annuel'
    },
    { 
      title: 'En attente', 
      value: stats?.pendingCount || 0, 
      icon: Clock, 
      color: 'bg-yellow-500',
      trend: '-2%',
      trendDirection: 'down',
      description: 'à traiter'
    },
    { 
      title: 'Alertes fraude', 
      value: stats?.fraudAlerts || 0, 
      icon: Shield, 
      color: 'bg-red-500',
      trend: '+12%',
      trendDirection: 'up',
      description: 'détectées par IA'
    },
  ];

  // Cartes supplémentaires pour le mode detailed
  const detailedCards: StatCard[] = [
    { 
      title: 'Taux approbation', 
      value: `${Math.round((stats?.approvedCount || 0) / (stats?.total || 1) * 100)}%`, 
      icon: Activity, 
      color: 'bg-teal-500',
      trend: '+3%',
      trendDirection: 'up'
    },
    { 
      title: 'Délai moyen', 
      value: `${stats?.avgProcessingDays || 8.2}j`, 
      icon: Clock, 
      color: 'bg-indigo-500',
      trend: '-12%',
      trendDirection: 'down'
    },
  ];

  const getTrendIcon = (direction?: string) => {
    if (direction === 'up') return <TrendingUp className="w-3 h-3" />;
    if (direction === 'down') return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  if (isLoading) {
    const skeletonCount = variant === 'detailed' ? 6 : 4;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(skeletonCount)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const allCards = variant === 'detailed' ? [...cards, ...detailedCards] : cards;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {allCards.map((card, idx) => (
        <div 
          key={idx} 
          className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`${card.color} p-2.5 rounded-xl`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            {card.trend && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                card.trendDirection === 'up' ? 'text-green-600 bg-green-50' : 
                card.trendDirection === 'down' ? 'text-red-600 bg-red-50' : 
                'text-gray-600 bg-gray-50'
              }`}>
                {getTrendIcon(card.trendDirection)}
                {card.trend}
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-sm text-gray-500 mt-1">{card.title}</p>
          {card.description && (
            <p className="text-xs text-gray-400 mt-1">{card.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default IAStatsCards;