// src/types/calendar.types.ts
// Types pour le module Calendar
// <150 lignes

// ============================================
// EVENT - Types principaux
// ============================================

export interface CalendarEvent {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    type: 'MEETING' | 'TASK' | 'REMINDER' | 'DEADLINE' | 'RENEWAL';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    location?: string;
    attendees?: string[];
    reminder_minutes: number;
    created_by: number;
    created_by_name?: string;
    related_id?: number; // policy_id, claim_id, company_id
    related_type?: 'POLICY' | 'CLAIM' | 'COMPANY' | 'CLIENT';
    ai_suggested: boolean;
    ai_score?: number;
    created_at: string;
    updated_at: string;
  }
  
  // ============================================
  // FORMULAIRE
  // ============================================
  
  export interface CalendarEventFormData {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    type: CalendarEvent['type'];
    priority: CalendarEvent['priority'];
    location?: string;
    attendees?: string[];
    reminder_minutes: number;
    related_id?: number;
    related_type?: CalendarEvent['related_type'];
  }
  
  // ============================================
  // SUGGESTIONS IA
  // ============================================
  
  export interface AISuggestion {
    id: number;
    title: string;
    description: string;
    suggested_start: string;
    suggested_end: string;
    confidence_score: number;
    reason: string;
    related_to?: string;
  }
  
  export interface AIOptimizationResult {
    optimal_slots: OptimalSlot[];
    productivity_impact: number;
    conflicts_resolved: number;
  }
  
  export interface OptimalSlot {
    start: string;
    end: string;
    score: number;
    reason: string;
  }
  
  // ============================================
  // PRODUCTIVITÉ
  // ============================================
  
  export interface ProductivityReport {
    period: 'day' | 'week' | 'month';
    total_events: number;
    completed_events: number;
    completion_rate: number;
    average_duration: number;
    most_productive_hours: number[];
    top_priorities: {
      priority: string;
      count: number;
      completed: number;
    }[];
    ai_suggestions_count: number;
    time_saved_estimate: number;
  }
  
  // ============================================
  // STATISTIQUES
  // ============================================
  
  export interface CalendarStats {
    total: number;
    upcoming: number;
    overdue: number;
    completed: number;
    byType: {
      type: string;
      count: number;
    }[];
    byPriority: {
      priority: string;
      count: number;
    }[];
  }
  
  // ============================================
  // FILTRES & PAGINATION
  // ============================================
  
  export interface CalendarFilters {
    type?: CalendarEvent['type'];
    priority?: CalendarEvent['priority'];
    status?: CalendarEvent['status'];
    start_date?: string;
    end_date?: string;
    search?: string;
    related_type?: CalendarEvent['related_type'];
    ai_suggested?: boolean;
  }
  
  // ============================================
  // CONSTANTES & UTILITAIRES
  // ============================================
  
  export const EVENT_TYPES = {
    MEETING: { label: 'Rendez-vous', color: 'bg-blue-100 text-blue-700', icon: '👥' },
    TASK: { label: 'Tâche', color: 'bg-green-100 text-green-700', icon: '✓' },
    REMINDER: { label: 'Rappel', color: 'bg-yellow-100 text-yellow-700', icon: '🔔' },
    DEADLINE: { label: 'Échéance', color: 'bg-red-100 text-red-700', icon: '⚠️' },
    RENEWAL: { label: 'Renouvellement', color: 'bg-purple-100 text-purple-700', icon: '🔄' },
  } as const;
  
  export const EVENT_PRIORITIES = {
    HIGH: { label: 'Haute', color: 'bg-red-100 text-red-700', order: 1 },
    MEDIUM: { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-700', order: 2 },
    LOW: { label: 'Basse', color: 'bg-green-100 text-green-700', order: 3 },
  } as const;
  
  export const getPriorityColor = (priority: string): string => {
    return EVENT_PRIORITIES[priority as keyof typeof EVENT_PRIORITIES]?.color || 'bg-gray-100 text-gray-700';
  };
  
  export const getEventTypeColor = (type: string): string => {
    return EVENT_TYPES[type as keyof typeof EVENT_TYPES]?.color || 'bg-gray-100 text-gray-700';
  };
  
  export const formatDateTime = (date: string): string => {
    return new Date(date).toLocaleString('fr-FR');
  };
  
  export const formatTime = (date: string): string => {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };