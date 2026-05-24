// src/components/admin/shared/IAMetricCard.tsx
// Carte métrique IA (composant admin)
// <70 lignes

'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IAMetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const colorStyles = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  purple: 'bg-purple-100 text-purple-600',
};

export const IAMetricCard = ({ title, value, unit, change, icon, color = 'blue' }: IAMetricCardProps) => {
  const isPositive = change && change > 0;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div><p className="text-sm text-gray-500">{title}</p><p className="text-2xl font-bold">{value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}</p></div>
          {icon && <div className={`p-3 rounded-full ${colorStyles[color]}`}>{icon}</div>}
        </div>
        {change !== undefined && (<div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}{Math.abs(change)}%</div>)}
      </CardContent>
    </Card>
  );
};

export default IAMetricCard;