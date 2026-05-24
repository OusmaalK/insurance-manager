// src/middleware/ia-cost-tracker.ts
// Middleware de tracking des coûts IA
// <100 lignes

import { NextRequest, NextResponse } from 'next/server';

interface CostEntry {
  id: string;
  userId: number;
  endpoint: string;
  tokensUsed: number;
  cost: number;
  timestamp: string;
}

const COST_PER_TOKEN = 0.0001; // €
const STORAGE_KEY = 'ia_cost_entries';
const MAX_ENTRIES = 1000;

class IACostTracker {
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

  getTotalCost(userId?: number, periodDays: number = 30): number {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);
    
    let filtered = this.entries.filter(e => new Date(e.timestamp) >= startDate);
    if (userId) {
      filtered = filtered.filter(e => e.userId === userId);
    }
    
    return filtered.reduce((sum, e) => sum + e.cost, 0);
  }

  getUserCosts(userId: number, periodDays: number = 30): CostEntry[] {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);
    
    return this.entries
      .filter(e => e.userId === userId && new Date(e.timestamp) >= startDate)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
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

export const iaCostTracker = new IACostTracker();
export default iaCostTracker;