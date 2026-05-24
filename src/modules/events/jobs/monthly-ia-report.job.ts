// src/modules/events/jobs/monthly-ia-report.job.ts
// Job de rapport IA mensuel
// <90 lignes

import { apiClient } from '@/modules/api/client/client';
import { EventBus } from '../EventBus';
import { StandardEventLogger } from '../StandardEventLogger';

class MonthlyIAReportJob {
  private isRunning = false;

  async start(): Promise<void> {
    // Exécution le 1er du mois à 8h
    const scheduleMonthly = () => {
      const now = new Date();
      const nextRun = new Date();
      nextRun.setMonth(nextRun.getMonth() + 1);
      nextRun.setDate(1);
      nextRun.setHours(8, 0, 0, 0);
      
      const delay = nextRun.getTime() - now.getTime();
      setTimeout(() => {
        this.execute();
        scheduleMonthly();
      }, delay);
    };
    
    scheduleMonthly();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
  }

  private async execute(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    
    try {
      StandardEventLogger.log('MONTHLY_IA_REPORT_JOB_STARTED', {}, 'MonthlyIAReportJob');
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      
      // Collecter les métriques IA mensuelles
      const [fraudStats, riskStats, performanceStats, costStats] = await Promise.all([
        apiClient.get('/claims/ai/stats', { params: { period: 'MONTHLY' } }),
        apiClient.get('/companies/ai/risk-stats', { params: { period: 'MONTHLY' } }),
        apiClient.get('/admin/ia/performance', { params: { period: 'MONTHLY' } }),
        apiClient.get('/admin/ia/costs', { params: { period: 'MONTHLY' } }),
      ]);
      
      const report = {
        period: { start: startDate, end: endDate },
        fraud: (fraudStats as any).data,
        risk: (riskStats as any).data,
        performance: (performanceStats as any).data,
        costs: (costStats as any).data,
        generated_at: new Date().toISOString(),
      };
      
      // Générer le rapport
      const reportResponse = await apiClient.post('/reports/ia/generate', {
        type: 'MONTHLY_SUMMARY',
        data: report,
        format: 'pdf',
      });
      
      EventBus.emit('MONTHLY_IA_REPORT_READY', {
        reportId: (reportResponse as any).data?.id,
        report,
      });
      
      StandardEventLogger.log('MONTHLY_IA_REPORT_JOB_COMPLETED', {
        reportId: (reportResponse as any).data?.id,
      }, 'MonthlyIAReportJob');
      
    } catch (error) {
      console.error('Monthly IA report job failed:', error);
      StandardEventLogger.log('MONTHLY_IA_REPORT_JOB_FAILED', { error }, 'MonthlyIAReportJob');
    } finally {
      this.isRunning = false;
    }
  }
}

export const monthlyIAReportJob = new MonthlyIAReportJob();
export default monthlyIAReportJob;