// src/components/admin/audit/AuditStatsCards.tsx
'use client';

import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, DollarSign, Brain, Zap } from 'lucide-react';

interface AuditStatsCardsProps {
  stats: {
    totalLogs: number;
    totalIALogs: number;
    errorsCount: number;
    warningsCount: number;
    criticalCount: number;
    averageDuration: number;
    totalCost: number;
    successRate?: number;
  } | null;  // ✅ Ajouter | null
  isLoading?: boolean;
  variant?: 'default' | 'compact';
}

export const AuditStatsCards = ({ stats, isLoading = false, variant = 'default' }: AuditStatsCardsProps) => {
  const defaultStats = {
    totalLogs: 0,
    totalIALogs: 0,
    errorsCount: 0,
    warningsCount: 0,
    criticalCount: 0,
    averageDuration: 0,
    totalCost: 0,
  };

  const displayStats = stats || defaultStats;

  const cards = [
    { 
      title: 'Total logs', 
      value: displayStats.totalLogs?.toLocaleString() || '0', 
      icon: Activity, 
      color: 'bg-blue-500',
      description: 'Actions tracées',
      trend: '+12%'
    },
    { 
      title: 'Logs IA', 
      value: displayStats.totalIALogs?.toLocaleString() || '0', 
      icon: Brain, 
      color: 'bg-purple-500',
      description: 'Appels IA',
      trend: '+24%'
    },
    { 
      title: 'Erreurs', 
      value: displayStats.errorsCount || 0, 
      icon: AlertTriangle, 
      color: 'bg-red-500',
      description: 'À analyser',
      trend: '-8%'
    },
    { 
      title: 'Coût total', 
      value: `${displayStats.totalCost?.toLocaleString() || 0}€`, 
      icon: DollarSign, 
      color: 'bg-green-500',
      description: 'IA uniquement',
      trend: '+5%'
    },
  ];

  const compactCards = [
    { title: 'Total logs', value: displayStats.totalLogs?.toLocaleString() || '0', icon: Activity, color: 'bg-blue-500' },
    { title: 'Logs IA', value: displayStats.totalIALogs?.toLocaleString() || '0', icon: Brain, color: 'bg-purple-500' },
    { title: 'Erreurs', value: displayStats.errorsCount || 0, icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Coût', value: `${displayStats.totalCost?.toLocaleString() || 0}€`, icon: DollarSign, color: 'bg-green-500' },
  ];

  const displayCards = variant === 'compact' ? compactCards : cards;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse bg-white rounded-xl border p-5 h-28"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayCards.map((card, idx) => (
        <div key={idx} className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className={`${card.color} p-2.5 rounded-xl`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            {(card as any).trend && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {(card as any).trend}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-sm text-gray-500 mt-1">{card.title}</p>
          {(card as any).description && (
            <p className="text-xs text-gray-400 mt-1">{(card as any).description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AuditStatsCards;