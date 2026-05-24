// src/modules/events/jobs/fraud-score-update.job.ts
// Job de mise à jour des scores de fraude
// <80 lignes

import { apiClient } from '@/modules/api/client/client';
import { EventBus } from '../EventBus';
import { StandardEventLogger } from '../StandardEventLogger';

class FraudScoreUpdateJob {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  async start(): Promise<void> {
    if (this.intervalId) return;
    
    // Exécution toutes les 6 heures
    this.intervalId = setInterval(() => {
      this.execute();
    }, 6 * 60 * 60 * 1000);
    
    // Exécution immédiate
    this.execute();
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
      StandardEventLogger.log('FRAUD_SCORE_UPDATE_JOB_STARTED', {}, 'FraudScoreUpdateJob');
      
      // Récupérer les sinistres non analysés
      const response = await apiClient.get('/claims', {
        params: { status: 'PENDING', limit: 100 }
      });
      
      const claims = (response as any).data?.data || [];
      let updated = 0;
      
      for (const claim of claims) {
        try {
          const fraudAnalysis = await apiClient.post(`/claims/ai/analyze-fraud/${claim.id}`);
          const fraudScore = (fraudAnalysis as any).fraud_score;
          
          await apiClient.patch(`/claims/${claim.id}`, { fraud_score: fraudScore });
          
          if (fraudScore && fraudScore > 70) {
            EventBus.emit('CLAIM_FRAUD_ALERT', {
              claim_id: claim.id,
              fraud_score: fraudScore,
              risk_level: (fraudAnalysis as any).risk_level,
            });
          }
          
          updated++;
        } catch (error) {
          console.error(`Failed to update fraud score for claim ${claim.id}:`, error);
        }
      }
      
      StandardEventLogger.log('FRAUD_SCORE_UPDATE_JOB_COMPLETED', {
        total: claims.length,
        updated,
      }, 'FraudScoreUpdateJob');
      
    } catch (error) {
      console.error('Fraud score update job failed:', error);
      StandardEventLogger.log('FRAUD_SCORE_UPDATE_JOB_FAILED', { error }, 'FraudScoreUpdateJob');
    } finally {
      this.isRunning = false;
    }
  }

  getStatus(): { isRunning: boolean } {
    return { isRunning: this.isRunning };
  }
}

export const fraudScoreUpdateJob = new FraudScoreUpdateJob();
export default fraudScoreUpdateJob;