// src/modules/telemetry/collectors/costCollector.ts
// Collecteur de coûts IA
// <80 lignes

// ============================================
// TYPES
// ============================================

export interface CostEntry {
    id: string;
    userId: number;
    userRole: string;
    endpoint: string;
    tokensUsed: number;
    cost: number;
    timestamp: string;
    model: string;
  }
  
  export interface CostSummary {
    totalCost: number;
    totalTokens: number;
    averageCostPerCall: number;
    callsCount: number;
    periodStart: string;
    periodEnd: string;
  }
  
  // ============================================
  // CONFIGURATION
  // ============================================
  
  const COST_PER_TOKEN = 0.0001; // € par token
  const STORAGE_KEY = 'ia_cost_entries';
  const MAX_ENTRIES = 1000;
  
  // ============================================
  // COLLECTEUR
  // ============================================
  
  class CostCollector {
    private entries: CostEntry[] = [];
  
    constructor() {
      this.loadFromStorage();
    }
  
    private loadFromStorage(): void {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            this.entries = JSON.parse(stored);
          } catch (error) {
            console.error('Failed to load cost entries', error);
            this.entries = [];
          }
        }
      }
    }
  
    private saveToStorage(): void {
      if (typeof window !== 'undefined') {
        const toStore = this.entries.slice(-MAX_ENTRIES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      }
    }
  
    calculateCost(tokensUsed: number): number {
      return tokensUsed * COST_PER_TOKEN;
    }
  
    addEntry(entry: Omit<CostEntry, 'id' | 'cost'>): CostEntry {
      const cost = this.calculateCost(entry.tokensUsed);
      const newEntry: CostEntry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        cost,
      };
      this.entries.push(newEntry);
      this.saveToStorage();
      return newEntry;
    }
  
    getEntries(filters?: { userId?: number; startDate?: string; endDate?: string }): CostEntry[] {
      let filtered = [...this.entries];
      
      if (filters?.userId) {
        filtered = filtered.filter(e => e.userId === filters.userId);
      }
      if (filters?.startDate) {
        filtered = filtered.filter(e => e.timestamp >= filters.startDate!);
      }
      if (filters?.endDate) {
        filtered = filtered.filter(e => e.timestamp <= filters.endDate!);
      }
      
      return filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
  
    getSummary(userId?: number, periodDays: number = 30): CostSummary {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);
      const startStr = startDate.toISOString();
      
      let filtered = this.entries.filter(e => e.timestamp >= startStr);
      if (userId) {
        filtered = filtered.filter(e => e.userId === userId);
      }
      
      const totalCost = filtered.reduce((sum, e) => sum + e.cost, 0);
      const totalTokens = filtered.reduce((sum, e) => sum + e.tokensUsed, 0);
      const callsCount = filtered.length;
      
      return {
        totalCost,
        totalTokens,
        averageCostPerCall: callsCount > 0 ? totalCost / callsCount : 0,
        callsCount,
        periodStart: startStr,
        periodEnd: new Date().toISOString(),
      };
    }
  
    getCostByEndpoint(userId?: number): Record<string, number> {
      let filtered = this.entries;
      if (userId) {
        filtered = filtered.filter(e => e.userId === userId);
      }
      
      const byEndpoint: Record<string, number> = {};
      filtered.forEach(entry => {
        byEndpoint[entry.endpoint] = (byEndpoint[entry.endpoint] || 0) + entry.cost;
      });
      
      return byEndpoint;
    }
  
    clearEntries(): void {
      this.entries = [];
      this.saveToStorage();
    }
  }
  
  export const costCollector = new CostCollector();
  export default costCollector;