// src/components/admin/ia/EventOrchestratorPanel.tsx
'use client';

import { useState } from 'react';
import { Play, Pause, Zap, Clock, CheckCircle, AlertCircle, RefreshCw, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

interface Event {
  id: number;
  name: string;
  status: 'running' | 'paused' | 'completed' | 'failed';
  lastRun: string;
  nextRun: string;
  frequency: string;
}

export const EventOrchestratorPanel = () => {
  const [events, setEvents] = useState<Event[]>([
    { id: 1, name: 'Prédiction renouvellement', status: 'running', lastRun: '2026-05-24 06:00', nextRun: '2026-05-25 06:00', frequency: 'Quotidien' },
    { id: 2, name: 'Détection fraude', status: 'running', lastRun: '2026-05-24 00:15', nextRun: '2026-05-25 00:15', frequency: 'Horaire' },
    { id: 3, name: 'Rapport hebdomadaire IA', status: 'paused', lastRun: '2026-05-18 08:00', nextRun: 'En attente', frequency: 'Hebdomadaire' },
    { id: 4, name: 'Mise à jour scores risque', status: 'completed', lastRun: '2026-05-24 02:00', nextRun: '2026-05-25 02:00', frequency: 'Quotidien' },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running': return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 animate-pulse">En cours</span>;
      case 'paused': return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">En pause</span>;
      case 'completed': return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">Terminé</span>;
      default: return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">Échoué</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4 text-green-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Orchestrateur d'événements
          </CardTitle>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Configurer
          </Button>
        </div>
        <p className="text-xs text-gray-500">Gestion des jobs planifiés IA</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(event.status)}
                <div>
                  <p className="text-sm font-medium">{event.name}</p>
                  <p className="text-xs text-gray-500">Fréquence: {event.frequency}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Dernier run</p>
                  <p className="text-xs font-medium">{event.lastRun}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Prochain run</p>
                  <p className="text-xs font-medium">{event.nextRun}</p>
                </div>
                {getStatusBadge(event.status)}
                <button className="p-1 hover:bg-gray-200 rounded">
                  <RefreshCw className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};