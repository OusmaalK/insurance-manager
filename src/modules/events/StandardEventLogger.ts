// src/modules/events/StandardEventLogger.ts
// Journalisation standard des événements
// <90 lignes

import EventBus from './EventBus';

export interface EventLog {
  id: string;
  event: string;
  data: any;
  timestamp: string;
  source?: string;
  userId?: number;
}

class StandardEventLoggerClass {
  private logs: EventLog[] = [];
  private maxLogs = 1000;
  private isEnabled = true;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Écouter tous les événements du bus
    const events = [
      'USER_LOGIN', 'USER_LOGOUT', 'USER_REGISTER',
      'COMPANY_CREATED', 'COMPANY_UPDATED', 'COMPANY_DELETED',
      'POLICY_CREATED', 'POLICY_UPDATED', 'POLICY_DELETED',
      'CLAIM_CREATED', 'CLAIM_UPDATED', 'CLAIM_APPROVED',
      'IA_ANALYSIS_COMPLETED', 'IA_FRAUD_DETECTED', 'REPORT_GENERATED',
      'RENEWAL_PREDICTED', 'CALENDAR_EVENT_CREATED'
    ];

    events.forEach(event => {
      EventBus.on(event, (data) => {
        this.log(event, data);
      });
    });
  }

  log(event: string, data: any, source?: string, userId?: number): void {
    if (!this.isEnabled) return;

    const logEntry: EventLog = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      event,
      data,
      timestamp: new Date().toISOString(),
      source,
      userId,
    };

    this.logs.unshift(logEntry);
    
    // Limiter la taille
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Log dans la console en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Event] ${event}`, data);
    }
  }

  getLogs(filters?: { event?: string; startDate?: string; endDate?: string; userId?: number }): EventLog[] {
    let filtered = [...this.logs];
    
    if (filters?.event) {
      filtered = filtered.filter(l => l.event === filters.event);
    }
    if (filters?.startDate) {
      filtered = filtered.filter(l => l.timestamp >= filters.startDate!);
    }
    if (filters?.endDate) {
      filtered = filtered.filter(l => l.timestamp <= filters.endDate!);
    }
    if (filters?.userId) {
      filtered = filtered.filter(l => l.userId === filters.userId);
    }
    
    return filtered;
  }

  getEventsByType(event: string): EventLog[] {
    return this.logs.filter(l => l.event === event);
  }

  clearLogs(): void {
    this.logs = [];
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  getStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    for (const log of this.logs) {
      stats[log.event] = (stats[log.event] || 0) + 1;
    }
    return stats;
  }
}

export const StandardEventLogger = new StandardEventLoggerClass();
export default StandardEventLogger;