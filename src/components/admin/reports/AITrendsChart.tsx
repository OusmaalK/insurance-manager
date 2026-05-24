// src/components/admin/reports/AITrendsChart.tsx
'use client';

import { useEffect, useState } from 'react';
import { BarChart, TrendingUp, PieChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

interface AITrendsChartProps {
  data: Array<{ month: string; value: number; previousValue?: number }>;
  title?: string;
  type?: 'line' | 'bar';
}

export const AITrendsChart = ({ data, title = 'Évolution des tendances', type = 'line' }: AITrendsChartProps) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.previousValue || 0)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5 text-blue-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end gap-2">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full">
                <div 
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${(item.value / maxValue) * 180}px`, minHeight: '4px' }}
                />
                {item.previousValue !== undefined && (
                  <div 
                    className="w-full bg-gray-300 rounded-t mt-0.5 transition-all"
                    style={{ height: `${(item.previousValue / maxValue) * 120}px`, minHeight: '2px' }}
                  />
                )}
              </div>
              <span className="text-[10px] text-gray-400">{item.month}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded" />Valeur actuelle</div>
          {data[0]?.previousValue !== undefined && (
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-300 rounded" />Période précédente</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};