// src/components/admin/calendar/CalendarProductivityReport.tsx
'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Clock, CheckCircle, Target, BarChart3, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useCalendarAI } from '@/hooks/useCalendarAI';

export const CalendarProductivityReport = () => {
  const { productivity, getProductivityReport, isLoading } = useCalendarAI();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    getProductivityReport(period);
  }, [period]);

  const handleRefresh = () => {
    getProductivityReport(period);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <CardTitle>Rapport productivité IA</CardTitle>
          </div>
          <div className="flex gap-2">
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value as any)}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="day">Jour</option>
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
            </select>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Analyse de votre productivité basée sur l'IA</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-6 text-gray-500">Calcul en cours...</div>
        ) : productivity ? (
          <>
            {/* Métriques principales */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-green-700">{productivity.completion_rate}%</p>
                <p className="text-xs text-gray-600">Taux complétion</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-blue-700">{productivity.average_duration} min</p>
                <p className="text-xs text-gray-600">Durée moyenne</p>
              </div>
            </div>

            {/* Top priorités */}
            <div>
              <p className="text-sm font-medium mb-2">Top priorités</p>
              <div className="space-y-2">
                {productivity.top_priorities?.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="capitalize">{p.priority.toLowerCase()}</span>
                    <span className="font-medium">{p.completed}/{p.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Heures productives */}
            {productivity.most_productive_hours && (
              <div>
                <p className="text-sm font-medium mb-2">Heures productives</p>
                <div className="flex flex-wrap gap-2">
                  {productivity.most_productive_hours.map((hour, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs">
                      {hour}:00
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Impact IA */}
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-700">Impact de l'IA</p>
              <p className="text-xs text-purple-600 mt-1">
                Temps estimé économisé: {productivity.time_saved_estimate} min
              </p>
              <p className="text-xs text-purple-500 mt-1">
                {productivity.ai_suggestions_count} suggestions IA intégrées
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">Données insuffisantes</div>
        )}
      </CardContent>
    </Card>
  );
};