// src/components/admin/reports/AIReportSummary.tsx
'use client';

import { Brain, TrendingUp, Shield, Target, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

interface AIReportSummaryProps {
  report: {
    summary: string;
    metrics?: {
      fraudScore: number;
      riskScore: number;
      renewalRate: number;
      satisfactionScore: number;
    };
    insights?: any[];
  };
}

export const AIReportSummary = ({ report }: AIReportSummaryProps) => {
  const metrics = [
    { label: 'Score fraude', value: report.metrics?.fraudScore || 0, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Score risque', value: report.metrics?.riskScore || 0, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Taux renouvellement', value: report.metrics?.renewalRate || 0, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Satisfaction', value: report.metrics?.satisfactionScore || 0, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Résumé IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 leading-relaxed">{report.summary}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((metric, idx) => (
            <div key={idx} className={`p-2 rounded-lg text-center ${metric.bg}`}>
              <p className={`text-xl font-bold ${metric.color}`}>{metric.value}%</p>
              <p className="text-xs text-gray-600">{metric.label}</p>
            </div>
          ))}
        </div>

        {report.insights && report.insights.length > 0 && (
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-700 mb-2">🔍 Insights clés</p>
            <ul className="space-y-1">
              {report.insights.slice(0, 3).map((insight, idx) => (
                <li key={idx} className="text-sm text-purple-600 flex items-start gap-2">
                  <Sparkles className="w-3 h-3 mt-0.5" />
                  {insight.title || insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};