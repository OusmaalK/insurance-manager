// src/components/broker/shared/BrokerStats.tsx
// Composant de statistiques pour le courtier
// <70 lignes

import React from 'react';
import { Card, CardContent } from '@/shared/ui/Card';

// ============================================
// TYPES
// ============================================

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
}

interface BrokerStatsProps {
  stats: StatItem[];
  title?: string;
  columns?: 2 | 3 | 4;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const BrokerStats = ({ stats, title, columns = 4 }: BrokerStatsProps) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <Card>
      {title && (
        <div className="px-4 pt-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <CardContent>
        <div className={`grid ${gridCols[columns]} gap-4`}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-gray-100 bg-gray-50/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{stat.label}</span>
                {stat.icon && <span className="text-gray-400">{stat.icon}</span>}
              </div>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
              {stat.change !== undefined && (
                <p className={`text-xs mt-1 ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}% vs mois dernier
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrokerStats;