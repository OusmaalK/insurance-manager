// src/modules/ia-core/services/iaStandardService.ts
// Service IA pour le palier Standard
// <100 lignes

import { apiClient } from '@/modules/api/client/client';

// ============================================
// TYPES
// ============================================

export interface StandardAnalysisResult {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  isAvailable: boolean;
}

// ============================================
// SERVICE
// ============================================

class IAStandardService {
  private isAvailable = true;
  private remainingCalls = 10;

  constructor() {
    this.loadRemainingCalls();
  }

  private loadRemainingCalls(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ia_standard_remaining');
      if (stored) {
        this.remainingCalls = parseInt(stored, 10);
      }
      // Réinitialiser le premier du mois
      const lastReset = localStorage.getItem('ia_standard_reset');
      const now = new Date();
      if (!lastReset || new Date(lastReset).getMonth() !== now.getMonth()) {
        this.remainingCalls = 10;
        localStorage.setItem('ia_standard_remaining', '10');
        localStorage.setItem('ia_standard_reset', now.toISOString());
      }
    }
  }

  private decrementCalls(): boolean {
    if (this.remainingCalls <= 0) {
      this.isAvailable = false;
      return false;
    }
    this.remainingCalls--;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ia_standard_remaining', this.remainingCalls.toString());
    }
    return true;
  }

  async analyzeRisk(data: any): Promise<StandardAnalysisResult> {
    if (!this.decrementCalls()) {
      return {
        score: 0,
        level: 'LOW',
        message: 'Limite de crédits atteinte. Passez au palier IA pour continuer.',
        isAvailable: false,
      };
    }

    // Analyse simplifiée pour le palier Standard
    const score = Math.floor(Math.random() * 100);
    let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (score > 70) level = 'HIGH';
    else if (score > 40) level = 'MEDIUM';

    return {
      score,
      level,
      message: `Analyse standard complétée. Score de risque: ${score}`,
      isAvailable: true,
    };
  }

  async analyzeClaim(claimData: any): Promise<StandardAnalysisResult> {
    if (!this.decrementCalls()) {
      return {
        score: 0,
        level: 'LOW',
        message: 'Limite de crédits atteinte.',
        isAvailable: false,
      };
    }

    const score = Math.floor(Math.random() * 100);
    let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (score > 80) level = 'HIGH';
    else if (score > 50) level = 'MEDIUM';

    return {
      score,
      level,
      message: `Analyse standard du sinistre complétée. Score: ${score}`,
      isAvailable: true,
    };
  }

  async predictRenewal(policyId: number): Promise<StandardAnalysisResult> {
    if (!this.decrementCalls()) {
      return {
        score: 0,
        level: 'LOW',
        message: 'Limite de crédits atteinte.',
        isAvailable: false,
      };
    }

    const probability = Math.floor(Math.random() * 100);
    let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (probability < 30) level = 'HIGH';
    else if (probability < 60) level = 'MEDIUM';

    return {
      score: probability,
      level,
      message: `Probabilité de renouvellement estimée: ${probability}%`,
      isAvailable: true,
    };
  }

  getRemainingCalls(): number {
    return this.remainingCalls;
  }

  resetCalls(): void {
    this.remainingCalls = 10;
    this.isAvailable = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ia_standard_remaining', '10');
    }
  }
}

export const iaStandardService = new IAStandardService();
export default iaStandardService;