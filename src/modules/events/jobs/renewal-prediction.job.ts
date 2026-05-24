// src/modules/events/jobs/renewal-prediction.job.ts
// Job de prédiction des renouvellements
// <80 lignes

import { apiClient } from '@/modules/api/client/client';
import { EventBus } from '../EventBus';
import { StandardEventLogger } from '../StandardEventLogger';

interface RenewalPredictionJobConfig {
  enabled: boolean;
  cronSchedule: string;
  batchSize: number;
}

class RenewalPredictionJob {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private config: RenewalPredictionJobConfig = {
    enabled: true,
    cronSchedule: '0 6 * * *', // Tous les jours à 6h
    batchSize: 50,
  };

  async start(): Promise<void> {
    if (this.intervalId) return;
    
    // Exécution quotidienne à 6h
    const scheduleDaily = () => {
      const now = new Date();
      const nextRun = new Date();
      nextRun.setHours(6, 0, 0, 0);
      
      if (now > nextRun) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
      
      const delay = nextRun.getTime() - now.getTime();
      setTimeout(() => {
        this.execute();
        scheduleDaily();
      }, delay);
    };
    
    if (this.config.enabled) {
      scheduleDaily();
    }
  }

  async stop(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  private async execute(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    
    try {
      StandardEventLogger.log('RENEWAL_PREDICTION_JOB_STARTED', {}, 'RenewalPredictionJob');
      
      // Récupérer les contrats actifs
      const response = await apiClient.get('/policies', {
        params: { status: 'ACTIVE', limit: 1000 }
      });
      
      const policies = (response as any).data?.data || [];
      let processed = 0;
      
      for (const policy of policies) {
        try {
          const prediction = await apiClient.post(`/policies/${policy.id}/predict-renewal`);
          EventBus.emit('RENEWAL_PREDICTED', {
            policy_id: policy.id,
            renewal_probability: (prediction as any).renewal_probability,
            risk_level: (prediction as any).risk_level,
          });
          processed++;
        } catch (error) {
          console.error(`Failed to predict renewal for policy ${policy.id}:`, error);
        }
      }
      
      StandardEventLogger.log('RENEWAL_PREDICTION_JOB_COMPLETED', {
        total: policies.length,
        processed,
      }, 'RenewalPredictionJob');
      
    } catch (error) {
      console.error('Renewal prediction job failed:', error);
      StandardEventLogger.log('RENEWAL_PREDICTION_JOB_FAILED', { error }, 'RenewalPredictionJob');
    } finally {
      this.isRunning = false;
    }
  }

  getStatus(): { isRunning: boolean; config: RenewalPredictionJobConfig } {
    return { isRunning: this.isRunning, config: this.config };
  }
}

export const renewalPredictionJob = new RenewalPredictionJob();
export default renewalPredictionJob;