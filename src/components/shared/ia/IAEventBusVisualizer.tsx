// src/components/shared/ia/IAEventBusVisualizer.tsx
// Visualiseur du bus d'événements IA
// <130 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Activity, Zap, Clock, Trash2, Play } from 'lucide-react';
import EventBus from '@/modules/events/EventBus';
import { StandardEventLogger } from '@/modules/events/StandardEventLogger';

interface EventLog {
  id: string;
  event: string;
  timestamp: string;
  data: any;
}

export const IAEventBusVisualizer = () => {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [isRecording, setIsRecording] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!isRecording) return;

    const eventsToListen = [
      'CLAIM_CREATED', 'CLAIM_UPDATED', 'CLAIM_APPROVED',
      'POLICY_CREATED', 'POLICY_UPDATED',
      'COMPANY_CREATED', 'COMPANY_UPDATED',
      'IA_FRAUD_DETECTED', 'IA_ANALYSIS_COMPLETED',
      'REPORT_GENERATED', 'RENEWAL_PREDICTED'
    ];

    const handlers: Record<string, (data: any) => void> = {};

    eventsToListen.forEach(event => {
      const handler = (data: any) => {
        setEvents(prev => [{
          id: `${Date.now()}_${Math.random()}`,
          event,
          timestamp: new Date().toISOString(),
          data
        }, ...prev].slice(0, 100));
      };
      handlers[event] = handler;
      EventBus.on(event, handler);
    });

    return () => {
      eventsToListen.forEach(event => {
        EventBus.off(event);
      });
    };
  }, [isRecording]);

  const filteredEvents = filter
    ? events.filter(e => e.event.toLowerCase().includes(filter.toLowerCase()))
    : events;

  const clearEvents = () => setEvents([]);

  const getEventColor = (event: string) => {
    if (event.includes('FRAUD')) return 'text-red-600 bg-red-50';
    if (event.includes('CREATE')) return 'text-green-600 bg-green-50';
    if (event.includes('UPDATE')) return 'text-blue-600 bg-blue-50';
    if (event.includes('PREDICT')) return 'text-purple-600 bg-purple-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Bus d'événements IA
            {isRecording && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
          </CardTitle>
          <div className="flex gap-2">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrer..."
              className="px-2 py-1 text-sm border rounded-lg"
            />
            <Button onClick={() => setIsRecording(!isRecording)} variant="outline" size="sm">
              {isRecording ? <Zap className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button onClick={clearEvents} variant="outline" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucun événement</p>
              <p className="text-xs">Les événements apparaîtront ici</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className={`p-2 rounded-lg text-sm ${getEventColor(event.event)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-medium">{event.event}</span>
                    <p className="text-xs mt-1 opacity-75">
                      {JSON.stringify(event.data).slice(0, 100)}
                      {JSON.stringify(event.data).length > 100 && '...'}
                    </p>
                  </div>
                  <span className="text-xs opacity-50">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IAEventBusVisualizer;