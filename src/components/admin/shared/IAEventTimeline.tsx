// src/components/admin/shared/IAEventTimeline.tsx
// Chronologie des événements IA (composant admin)
// <100 lignes

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Clock, Shield, AlertTriangle, CheckCircle, Brain } from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'fraud' | 'risk' | 'prediction' | 'analysis';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'critical';
}

interface IAEventTimelineProps {
  events: TimelineEvent[];
  title?: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'fraud': return <Shield className="w-4 h-4 text-red-500" />;
    case 'risk': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'prediction': return <Brain className="w-4 h-4 text-purple-500" />;
    default: return <CheckCircle className="w-4 h-4 text-green-500" />;
  }
};

export const IAEventTimeline = ({ events, title = 'Activité IA récente' }: IAEventTimelineProps) => {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" />{title}</CardTitle></CardHeader>
      <CardContent>
        {events.length === 0 ? (<div className="text-center py-8 text-gray-500">Aucun événement récent</div>) : (
          <div className="space-y-4">
            {events.map((event) => (<div key={event.id} className="flex gap-3"><div className="flex-shrink-0">{getTypeIcon(event.type)}</div><div className="flex-1"><p className="text-sm font-medium">{event.title}</p><p className="text-xs text-gray-500 mt-0.5">{event.description}</p><p className="text-xs text-gray-400 mt-1">{new Date(event.timestamp).toLocaleString()}</p></div></div>))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IAEventTimeline;