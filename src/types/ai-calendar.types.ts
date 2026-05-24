// src/types/ai-calendar.types.ts
// Types pour le Calendrier IA
// <55 lignes

export interface CalendarEvent {
    id: number;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    type: 'RENEWAL' | 'CLAIM' | 'MEETING' | 'TASK' | 'OTHER';
    company_id?: number;
    company_name?: string;
    policy_id?: number;
    user_id: number;
    color: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface OptimizedSlot {
    id: string;
    start_time: string;
    end_time: string;
    score: number;
    reason: string;
    client_id?: number;
    client_name?: string;
    location?: string;
  }
  
  export interface ProductivityReport {
    period: string;
    total_events: number;
    completed_tasks: number;
    completion_rate: number;
    average_duration: number;
    best_performing_hours: number[];
    recommendations: string[];
    generated_at: string;
  }
  
  export interface CalendarReminder {
    id: number;
    event_id: number;
    reminder_time: string;
    sent: boolean;
    type: 'EMAIL' | 'PUSH' | 'BOTH';
    sent_at?: string;
  }
  
  export interface SmartPlanningRequest {
    days_ahead: number;
    preferred_hours?: number[];
    excluded_days?: number[];
    max_suggestions?: number;
  }
  
  export interface CalendarStats {
    total_meetings: number;
    upcoming_meetings: number;
    missed_meetings: number;
    average_meeting_duration: number;
    most_productive_day: string;
    most_productive_hour: number;
  }