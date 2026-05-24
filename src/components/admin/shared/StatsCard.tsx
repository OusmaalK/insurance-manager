// src/components/admin/shared/StatsCard.tsx
// Carte de statistiques - Version corrigée
// <70 lignes

'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/ui/Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  onClick?: () => void;
}

const colorStyles = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  purple: 'bg-purple-100 text-purple-600',
};

export const StatsCard = ({ title, value, icon, trend, color = 'blue', onClick }: StatsCardProps) => {
  // ✅ Si onClick est présent, envelopper avec un div cliquable
  const content = (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {trend && (
              <p className={`text-xs mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorStyles[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <div 
        className="cursor-pointer hover:shadow-md transition-shadow" 
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default StatsCard;