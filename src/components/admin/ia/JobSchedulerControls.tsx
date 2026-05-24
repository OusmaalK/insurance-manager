// src/components/admin/ia/JobSchedulerControls.tsx
'use client';

import { useState } from 'react';
import { Calendar, Clock, Play, Pause, Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

interface ScheduledJob {
  id: number;
  name: string;
  cron: string;
  nextRun: string;
  lastRun: string;
  status: 'active' | 'paused';
  enabled: boolean;
}

export const JobSchedulerControls = () => {
  const [jobs, setJobs] = useState<ScheduledJob[]>([
    { id: 1, name: 'Prédiction renouvellement', cron: '0 6 * * *', nextRun: '2026-05-25 06:00', lastRun: '2026-05-24 06:00', status: 'active', enabled: true },
    { id: 2, name: 'Détection fraude', cron: '0 * * * *', nextRun: '2026-05-24 13:00', lastRun: '2026-05-24 12:00', status: 'active', enabled: true },
    { id: 3, name: 'Rapport hebdomadaire', cron: '0 8 * * 1', nextRun: '2026-05-25 08:00', lastRun: '2026-05-18 08:00', status: 'paused', enabled: false },
    { id: 4, name: 'Mise à jour scores', cron: '0 2 * * *', nextRun: '2026-05-25 02:00', lastRun: '2026-05-24 02:00', status: 'active', enabled: true },
  ]);

  const toggleJob = (id: number) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, enabled: !job.enabled, status: !job.enabled ? 'active' : 'paused' } : job
    ));
  };

  const getCronDescription = (cron: string): string => {
    const parts = cron.split(' ');
    if (parts.length < 5) return 'Non défini';
    
    const minute = parts[0];
    const hour = parts[1];
    const dayOfMonth = parts[2];
    const month = parts[3];
    const dayOfWeek = parts[4];
    
    // Quotidien à une heure spécifique
    if (minute === '0' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      const hourNum = parseInt(hour, 10);
      return `Quotidien à ${hourNum}h00`;
    }
    
    // Horaire (toutes les heures)
    if (minute === '0' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Horaire (à chaque heure pleine)';
    }
    
    // Hebdomadaire (lundi)
    if (minute === '0' && hour === '8' && dayOfMonth === '*' && month === '*' && dayOfWeek === '1') {
      return 'Hebdomadaire (lundi) à 08h00';
    }
    
    // Mensuel (1er du mois)
    if (minute === '0' && hour === '6' && dayOfMonth === '1' && month === '*' && dayOfWeek === '*') {
      return 'Mensuel (1er du mois) à 06h00';
    }
    
    // Toutes les minutes
    if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Toutes les minutes';
    }
    
    // Cas par défaut
    return `Programmé (${cron})`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Planificateur de tâches IA
          </CardTitle>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Nouvelle tâche
          </Button>
        </div>
        <p className="text-xs text-gray-500">Gestion des jobs planifiés IA</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${job.enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium">{job.name}</p>
                  <p className="text-xs text-gray-500">{getCronDescription(job.cron)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Prochain run</p>
                  <p className="text-xs font-medium">{job.nextRun}</p>
                </div>
                <button
                  onClick={() => toggleJob(job.id)}
                  className={`p-1.5 rounded-lg transition-all ${
                    job.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {job.enabled ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded-lg">
                  <Edit className="w-3 h-3 text-gray-500" />
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded-lg">
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