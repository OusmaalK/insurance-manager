// src/hooks/useCalendar.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { CalendarEvent, CalendarFilters, CalendarStats } from '@/types/calendar.types';
import { PaginationParams } from '@/types/api.types';

// Données mockées
const mockEvents: CalendarEvent[] = [
  { id: 1, title: 'Réunion équipe', description: 'Point hebdomadaire', start_date: new Date().toISOString(), end_date: new Date(Date.now() + 3600000).toISOString(), type: 'MEETING', priority: 'HIGH', status: 'PENDING', reminder_minutes: 30, created_by: 1, ai_suggested: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, title: 'Appel client', description: 'Suivi contrat', start_date: new Date(Date.now() + 86400000).toISOString(), end_date: new Date(Date.now() + 86400000 + 1800000).toISOString(), type: 'MEETING', priority: 'MEDIUM', status: 'PENDING', reminder_minutes: 15, created_by: 1, ai_suggested: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const mockStats: CalendarStats = {
  total: 48,
  upcoming: 12,
  overdue: 3,
  completed: 33,
  byType: [{ type: 'MEETING', count: 20 }, { type: 'TASK', count: 28 }],
  byPriority: [{ priority: 'HIGH', count: 10 }, { priority: 'MEDIUM', count: 25 }, { priority: 'LOW', count: 13 }],
};

export const useCalendar = (options: { autoFetch?: boolean } = {}) => {
  const { autoFetch = true } = options;
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setEvents(mockEvents);
    setTotal(mockEvents.length);
    setIsLoading(false);
  }, []);

  const getEvent = useCallback(async (id: number): Promise<CalendarEvent | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const found = mockEvents.find(e => e.id === id) || null;
    setEvent(found);
    setIsLoading(false);
    return found;
  }, []);

  const fetchStats = useCallback(async (): Promise<CalendarStats | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsLoading(false);
    return mockStats;
  }, []);

  const createEvent = useCallback(async (data: any): Promise<CalendarEvent | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEvent = { ...data, id: Date.now(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    setEvents(prev => [newEvent, ...prev]);
    setIsLoading(false);
    return newEvent;
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return {
    events,
    event,
    isLoading,
    error,
    total,
    fetchEvents,
    getEvent,
    fetchStats,
    createEvent,
  };
};

export default useCalendar;