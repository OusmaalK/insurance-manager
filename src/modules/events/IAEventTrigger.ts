// src/modules/events/IAEventTrigger.ts
// Déclencheur d'événements IA
// <100 lignes

import EventBus from './EventBus';
import { StandardEventLogger } from './StandardEventLogger';

interface TriggerConfig {
  event: string;
  condition: (data: any) => boolean;
  action: string;
  actionData?: (data: any) => any;
  debounceMs?: number;
}

class IAEventTriggerClass {
  private triggers: Map<string, TriggerConfig[]> = new Map();
  private lastTriggerTime: Map<string, number> = new Map();

  constructor() {
    this.setupDefaultTriggers();
  }

  private setupDefaultTriggers(): void {
    // Trigger pour fraude détectée
    this.addTrigger({
      event: 'CLAIM_CREATED',
      condition: (data) => data.fraud_score && data.fraud_score > 70,
      action: 'IA_FRAUD_DETECTED',
      actionData: (data) => ({ claimId: data.id, fraudScore: data.fraud_score }),
    });

    // Trigger pour renouvellement à risque
    this.addTrigger({
      event: 'RENEWAL_PREDICTED',
      condition: (data) => data.renewal_probability < 40,
      action: 'RENEWAL_RISK_ALERT',
      actionData: (data) => ({ policyId: data.policy_id, probability: data.renewal_probability }),
    });

    // Trigger pour rapport généré
    this.addTrigger({
      event: 'REPORT_GENERATED',
      condition: () => true,
      action: 'REPORT_READY_NOTIFICATION',
      actionData: (data) => ({ reportId: data.id, type: data.type }),
    });
  }

  addTrigger(config: TriggerConfig): void {
    if (!this.triggers.has(config.event)) {
      this.triggers.set(config.event, []);
    }
    this.triggers.get(config.event)!.push(config);
    
    // S'abonner à l'événement
    EventBus.on(config.event, (data) => {
      this.evaluateTriggers(config.event, data);
    });
  }

  private evaluateTriggers(event: string, data: any): void {
    const triggers = this.triggers.get(event);
    if (!triggers) return;

    const now = Date.now();

    for (const trigger of triggers) {
      // Vérifier le debounce
      const lastTime = this.lastTriggerTime.get(`${event}_${trigger.action}`);
      if (trigger.debounceMs && lastTime && (now - lastTime) < trigger.debounceMs) {
        continue;
      }

      // Vérifier la condition
      if (trigger.condition(data)) {
        const actionData = trigger.actionData ? trigger.actionData(data) : data;
        
        // Émettre l'action
        EventBus.emit(trigger.action, actionData);
        
        // Logger
        StandardEventLogger.log(trigger.action, actionData, 'IAEventTrigger');
        
        // Mettre à jour le dernier déclenchement
        this.lastTriggerTime.set(`${event}_${trigger.action}`, now);
      }
    }
  }

  removeTrigger(event: string, action: string): void {
    const triggers = this.triggers.get(event);
    if (triggers) {
      this.triggers.set(
        event,
        triggers.filter(t => t.action !== action)
      );
    }
  }

  removeAllTriggers(event?: string): void {
    if (event) {
      this.triggers.delete(event);
    } else {
      this.triggers.clear();
    }
  }

  getTriggers(): Map<string, TriggerConfig[]> {
    return this.triggers;
  }
}

export const IAEventTrigger = new IAEventTriggerClass();
export default IAEventTrigger;