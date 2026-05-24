// src/hooks/useIAEvents.ts
// Hook pour les événements IA
// <70 lignes

'use client';

import { useState, useEffect, useCallback } from 'react';
import EventBus from '@/modules/events/EventBus';
import { StandardEventLogger } from '@/modules/events/StandardEventLogger';

interface EventLog {
  id: string;
  event: string;
  data: any;
  timestamp: string;
}

export const useIAEvents = () => {
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
          data,
          timestamp: new Date().toISOString()
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

  const clearEvents = useCallback(() => setEvents([]), []);

  const getEventsByType = useCallback((eventType: string) => {
    return events.filter(e => e.event === eventType);
  }, [events]);

  const getEventStats = useCallback(() => {
    const stats: Record<string, number> = {};
    events.forEach(e => {
      stats[e.event] = (stats[e.event] || 0) + 1;
    });
    return stats;
  }, [events]);

  const filteredEvents = filter
    ? events.filter(e => e.event.toLowerCase().includes(filter.toLowerCase()))
    : events;

  return {
    events: filteredEvents,
    allEvents: events,
    isRecording,
    setIsRecording,
    filter,
    setFilter,
    clearEvents,
    getEventsByType,
    getEventStats,
  };
};

export default useIAEvents;