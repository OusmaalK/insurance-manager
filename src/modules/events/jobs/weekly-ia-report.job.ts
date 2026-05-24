// src/modules/events/jobs/weekly-ia-report.job.ts
// Job de rapport IA hebdomadaire
// <90 lignes

import { apiClient } from '@/modules/api/client/client';
import { EventBus } from '../EventBus';
import { StandardEventLogger } from '../StandardEventLogger';

class WeeklyIAReportJob {
  private isRunning = false;

  async start(): Promise<void> {
    // Exécution tous les dimanches à 22h
    const scheduleWeekly = () => {
      const now = new Date();
      const nextRun = new Date();
      nextRun.setDate(nextRun.getDate() + ((0 + 7 - nextRun.getDay()) % 7));
      nextRun.setHours(22, 0, 0, 0);
      
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
      StandardEventLogger.log('WEEKLY_IA_REPORT_JOB_STARTED', {}, 'WeeklyIAReportJob');
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      // Collecter les métriques IA
      const [fraudStats, riskStats, performanceStats] = await Promise.all([
        apiClient.get('/claims/ai/stats', { params: { period: 'WEEKLY' } }),
        apiClient.get('/companies/ai/risk-stats', { params: { period: 'WEEKLY' } }),
        apiClient.get('/admin/ia/performance', { params: { period: 'WEEKLY' } }),
      ]);
      
      const report = {
        period: { start: startDate, end: endDate },
        fraud: (fraudStats as any).data,
        risk: (riskStats as any).data,
        performance: (performanceStats as any).data,
        generated_at: new Date().toISOString(),
      };
      
      // Générer le rapport via l'API
      const reportResponse = await apiClient.post('/reports/ia/generate', {
        type: 'WEEKLY_SUMMARY',
        data: report,
        format: 'pdf',
      });
      
      EventBus.emit('WEEKLY_IA_REPORT_READY', {
        reportId: (reportResponse as any).data?.id,
        report,
      });
      
      StandardEventLogger.log('WEEKLY_IA_REPORT_JOB_COMPLETED', {
        reportId: (reportResponse as any).data?.id,
      }, 'WeeklyIAReportJob');
      
    } catch (error) {
      console.error('Weekly IA report job failed:', error);
      StandardEventLogger.log('WEEKLY_IA_REPORT_JOB_FAILED', { error }, 'WeeklyIAReportJob');
    } finally {
      this.isRunning = false;
    }
  }
}

export const weeklyIAReportJob = new WeeklyIAReportJob();
export default weeklyIAReportJob;