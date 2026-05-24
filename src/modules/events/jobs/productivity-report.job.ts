// src/modules/events/jobs/productivity-report.job.ts
// Job de rapport de productivité
// <80 lignes

import { apiClient } from '@/modules/api/client/client';
import { EventBus } from '../EventBus';
import { StandardEventLogger } from '../StandardEventLogger';

class ProductivityReportJob {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  async start(): Promise<void> {
    if (this.intervalId) return;
    
    // Exécution tous les lundis à 8h
    const scheduleWeekly = () => {
      const now = new Date();
      const nextRun = new Date();
      nextRun.setDate(nextRun.getDate() + ((1 + 7 - nextRun.getDay()) % 7));
      nextRun.setHours(8, 0, 0, 0);
      
      if (now > nextRun) {
        nextRun.setDate(nextRun.getDate() + 7);
      }
      
      const delay = nextRun.getTime() - now.getTime();
      setTimeout(() => {
        this.execute();
        scheduleWeekly();
      }, delay);
    };
    
    scheduleWeekly();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
  }

  private async execute(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    
    try {
      StandardEventLogger.log('PRODUCTIVITY_REPORT_JOB_STARTED', {}, 'ProductivityReportJob');
      
      // Calculer les métriques de productivité
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const response = await apiClient.get('/calendar/ai/productivity', {
        params: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
        }
      });
      
      const productivity = (response as any).data;
      
      // Générer le rapport
      const report = {
        period: { start: startDate, end: endDate },
        total_events: productivity?.total_events || 0,
        completion_rate: productivity?.completion_rate || 0,
        average_duration: productivity?.average_duration || 0,
        best_performing_hours: productivity?.best_performing_hours || [],
        recommendations: productivity?.recommendations || [],
      };
      
      // Émettre l'événement
      EventBus.emit('PRODUCTIVITY_REPORT_READY', report);
      
      StandardEventLogger.log('PRODUCTIVITY_REPORT_JOB_COMPLETED', report, 'ProductivityReportJob');
      
    } catch (error) {
      console.error('Productivity report job failed:', error);
      StandardEventLogger.log('PRODUCTIVITY_REPORT_JOB_FAILED', { error }, 'ProductivityReportJob');
    } finally {
      this.isRunning = false;
    }
  }

  getStatus(): { isRunning: boolean } {
    return { isRunning: this.isRunning };
  }
}

export const productivityReportJob = new ProductivityReportJob();
export default productivityReportJob;