// src/modules/telemetry/collectors/latencyCollector.ts
// Collecteur de latence IA
// <80 lignes

// ============================================
// TYPES
// ============================================

export interface LatencyEntry {
    id: string;
    userId: number;
    endpoint: string;
    duration: number; // ms
    success: boolean;
    timestamp: string;
    error?: string;
  }
  
  export interface LatencySummary {
    averageLatency: number;
    p95Latency: number;
    p99Latency: number;
    minLatency: number;
    maxLatency: number;
    totalCalls: number;
    successRate: number;
    periodStart: string;
    periodEnd: string;
  }
  
  // ============================================
  // CONFIGURATION
  // ============================================
  
  const STORAGE_KEY = 'ia_latency_entries';
  const MAX_ENTRIES = 1000;
  
  // ============================================
  // COLLECTEUR
  // ============================================
  
  class LatencyCollector {
    private entries: LatencyEntry[] = [];
  
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
            console.error('Failed to load latency entries', error);
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
  
    private calculatePercentile(sortedDurations: number[], percentile: number): number {
      if (sortedDurations.length === 0) return 0;
      const index = Math.ceil((percentile / 100) * sortedDurations.length) - 1;
      return sortedDurations[Math.max(0, index)];
    }
  
    addEntry(entry: Omit<LatencyEntry, 'id'>): LatencyEntry {
      const newEntry: LatencyEntry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      this.entries.push(newEntry);
      this.saveToStorage();
      return newEntry;
    }
  
    getEntries(filters?: { userId?: number; endpoint?: string; startDate?: string; endDate?: string }): LatencyEntry[] {
      let filtered = [...this.entries];
      
      if (filters?.userId) {
        filtered = filtered.filter(e => e.userId === filters.userId);
      }
      if (filters?.endpoint) {
        filtered = filtered.filter(e => e.endpoint === filters.endpoint);
      }
      if (filters?.startDate) {
        filtered = filtered.filter(e => e.timestamp >= filters.startDate!);
      }
      if (filters?.endDate) {
        filtered = filtered.filter(e => e.timestamp <= filters.endDate!);
      }
      
      return filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
  
    getSummary(userId?: number, periodDays: number = 30): LatencySummary {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);
      const startStr = startDate.toISOString();
      
      let filtered = this.entries.filter(e => e.timestamp >= startStr);
      if (userId) {
        filtered = filtered.filter(e => e.userId === userId);
      }
      
      const durations = filtered.map(e => e.duration).sort((a, b) => a - b);
      const successCount = filtered.filter(e => e.success).length;
      
      return {
        averageLatency: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
        p95Latency: this.calculatePercentile(durations, 95),
        p99Latency: this.calculatePercentile(durations, 99),
        minLatency: durations.length > 0 ? durations[0] : 0,
        maxLatency: durations.length > 0 ? durations[durations.length - 1] : 0,
        totalCalls: filtered.length,
        successRate: filtered.length > 0 ? (successCount / filtered.length) * 100 : 100,
        periodStart: startStr,
        periodEnd: new Date().toISOString(),
      };
    }
  
    getAverageLatencyByEndpoint(userId?: number): Record<string, number> {
      let filtered = this.entries.filter(e => e.success);
      if (userId) {
        filtered = filtered.filter(e => e.userId === userId);
      }
      
      const byEndpoint: Record<string, { sum: number; count: number }> = {};
      filtered.forEach(entry => {
        if (!byEndpoint[entry.endpoint]) {
          byEndpoint[entry.endpoint] = { sum: 0, count: 0 };
        }
        byEndpoint[entry.endpoint].sum += entry.duration;
        byEndpoint[entry.endpoint].count++;
      });
      
      const result: Record<string, number> = {};
      Object.entries(byEndpoint).forEach(([endpoint, data]) => {
        result[endpoint] = data.sum / data.count;
      });
      
      return result;
    }
  
    clearEntries(): void {
      this.entries = [];
      this.saveToStorage();
    }
  }
  
  export const latencyCollector = new LatencyCollector();
  export default latencyCollector;