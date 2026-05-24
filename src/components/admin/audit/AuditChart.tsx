// src/components/admin/audit/AuditChart.tsx
'use client';

import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

interface AuditChartProps {
  data: {
    labels: string[];
    values: number[];
    title?: string;
    type?: 'bar' | 'line';
    color?: string;
  };
  isLoading?: boolean;
}

export const AuditChart = ({ data, isLoading = false }: AuditChartProps) => {
  const maxValue = Math.max(...data.values, 1);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            {data.title || 'Graphique'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-48 bg-gray-100 rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          {data.title || 'Évolution'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-end gap-2">
          {data.values.map((value, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                  style={{ height: `${(value / maxValue) * 160}px`, minHeight: '4px' }}
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                  {value}
                </div>
              </div>
              <span className="text-[10px] text-gray-400">{data.labels[idx]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditChart;