// src/modules/events/EventBus.ts
// Bus d'événements pour la communication entre composants
// <100 lignes

type EventCallback = (data?: any) => void;

interface EventSubscription {
  id: string;
  callback: EventCallback;
  once: boolean;
}

class EventBusClass {
  private events: Map<string, EventSubscription[]> = new Map();
  private nextId = 0;

  // S'abonner à un événement
  on(event: string, callback: EventCallback): string {
    const id = `${event}_${this.nextId++}`;
    const subscription: EventSubscription = { id, callback, once: false };
    
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(subscription);
    
    return id;
  }

  // S'abonner une seule fois
  once(event: string, callback: EventCallback): string {
    const id = `${event}_${this.nextId++}`;
    const subscription: EventSubscription = { id, callback, once: true };
    
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(subscription);
    
    return id;
  }

  // Émettre un événement
  emit(event: string, data?: any): void {
    const subscriptions = this.events.get(event);
    if (!subscriptions) return;
    
    const toRemove: string[] = [];
    
    for (const sub of subscriptions) {
      sub.callback(data);
      if (sub.once) {
        toRemove.push(sub.id);
      }
    }
    
    // Nettoyer les abonnements "once"
    if (toRemove.length > 0) {
      this.events.set(
        event,
        subscriptions.filter(sub => !toRemove.includes(sub.id))
      );
    }
  }

  // Se désabonner
  off(event: string, id?: string): void {
    if (!id) {
      this.events.delete(event);
      return;
    }
    
    const subscriptions = this.events.get(event);
    if (subscriptions) {
      this.events.set(
        event,
        subscriptions.filter(sub => sub.id !== id)
      );
    }
  }

  // Supprimer tous les abonnements
  clear(): void {
    this.events.clear();
  }

  // Obtenir le nombre d'abonnements pour un événement
  listenerCount(event: string): number {
    return this.events.get(event)?.length || 0;
  }
}

export const EventBus = new EventBusClass();
export default EventBus;