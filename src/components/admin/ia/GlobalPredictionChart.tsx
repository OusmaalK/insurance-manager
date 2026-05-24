// src/components/admin/ia/GlobalPredictionChart.tsx
'use client';

import { useState } from 'react';
import { TrendingUp, Calendar, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

interface ChartData {
  month: string;
  claims: number;
  fraud: number;
  renewals: number;
}

export const GlobalPredictionChart = () => {
  const [period, setPeriod] = useState<'6months' | '12months'>('12months');
  
  const data: ChartData[] = [
    { month: 'Jan', claims: 145, fraud: 32, renewals: 234 },
    { month: 'Fév', claims: 156, fraud: 35, renewals: 245 },
    { month: 'Mar', claims: 168, fraud: 38, renewals: 256 },
    { month: 'Avr', claims: 172, fraud: 42, renewals: 268 },
    { month: 'Mai', claims: 185, fraud: 45, renewals: 275 },
    { month: 'Juin', claims: 192, fraud: 48, renewals: 282 },
    { month: 'Juil', claims: 201, fraud: 52, renewals: 291 },
    { month: 'Aoû', claims: 198, fraud: 50, renewals: 288 },
    { month: 'Sep', claims: 205, fraud: 55, renewals: 295 },
    { month: 'Oct', claims: 212, fraud: 58, renewals: 302 },
    { month: 'Nov', claims: 218, fraud: 62, renewals: 308 },
    { month: 'Déc', claims: 225, fraud: 65, renewals: 315 },
  ];

  const maxValue = 350;
  const chartHeight = 180;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <CardTitle>Prédictions globales</CardTitle>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPeriod('6months')}
              className={`px-3 py-1 text-xs rounded-lg ${period === '6months' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              6 mois
            </button>
            <button 
              onClick={() => setPeriod('12months')}
              className={`px-3 py-1 text-xs rounded-lg ${period === '12months' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              12 mois
            </button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span>Sinistres</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span>Fraudes</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span>Renouvellements</span></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-64 items-end gap-2">
          {(period === '12months' ? data : data.slice(-6)).map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full">
                <div 
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${(item.claims / maxValue) * chartHeight}px`, minHeight: '4px' }}
                />
                <div 
                  className="w-full bg-red-500 rounded-t mt-0.5 transition-all"
                  style={{ height: `${(item.fraud / maxValue) * chartHeight * 0.6}px`, minHeight: '2px' }}
                />
                <div 
                  className="w-full bg-green-500 rounded-t mt-0.5 transition-all"
                  style={{ height: `${(item.renewals / maxValue) * chartHeight * 0.8}px`, minHeight: '2px' }}
                />
              </div>
              <span className="text-[10px] text-gray-400">{item.month}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};