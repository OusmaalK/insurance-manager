// src/middleware/telemetryCollector.middleware.ts
// Collecte de télémétrie pour les appels IA
// <110 lignes

import { NextRequest, NextResponse } from 'next/server';

// ============================================
// TYPES
// ============================================

interface TelemetryData {
  requestId: string;
  path: string;
  method: string;
  userId?: number;
  startTime: number;
  endTime?: number;
  duration?: number;
  statusCode: number;
  iaUsed: boolean;
  iaCost?: number;
  iaTokens?: number;
  error?: string;
}

// ============================================
// CONFIGURATION
// ============================================

const IA_PATHS = [
  '/api/claims/ai/',
  '/api/companies/ai/',
  '/api/policies/ai/',
  '/api/ai/assistant',
  '/api/insights',
  '/api/reports/ia',
  '/api/calendar/ai',
];

const ESTIMATED_COST_PER_TOKEN = 0.0001; // €

// ============================================
// STOCKAGE TEMPORAIRE
// ============================================

const telemetryStore = new Map<string, TelemetryData>();

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const isIAPath = (pathname: string): boolean => {
  return IA_PATHS.some(path => pathname.startsWith(path));
};

const estimateCost = (tokens: number): number => {
  return tokens * ESTIMATED_COST_PER_TOKEN;
};

// ============================================
// MIDDLEWARE PRINCIPAL
// ============================================

export const telemetryCollector = async (
  request: NextRequest,
  response: NextResponse
): Promise<void> => {
  const pathname = request.nextUrl.pathname;
  const iaUsed = isIAPath(pathname);
  
  // Ne collecter que les appels IA ou les erreurs
  if (!iaUsed && response.status < 400) {
    return;
  }
  
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  const telemetry: TelemetryData = {
    requestId,
    path: pathname,
    method: request.method,
    startTime,
    statusCode: response.status,
    iaUsed,
  };
  
  // Récupérer l'utilisateur
  const token = request.cookies.get('access_token')?.value;
  if (token) {
    // En production, décoder le JWT
    telemetry.userId = 1; // Temporaire
  }
  
  // Simuler des métriques IA
  if (iaUsed && response.status === 200) {
    telemetry.iaTokens = Math.floor(Math.random() * 500) + 100;
    telemetry.iaCost = estimateCost(telemetry.iaTokens);
  }
  
  telemetry.endTime = Date.now();
  telemetry.duration = telemetry.endTime - telemetry.startTime;
  
  // Stocker en mémoire
  telemetryStore.set(requestId, telemetry);
  
  // En production, envoyer à un service de télémétrie
  console.log(`[Telemetry] ${request.method} ${pathname} - ${telemetry.duration}ms - IA: ${iaUsed}`);
  
  // Nettoyer les anciennes entrées (garder 1000 dernières)
  if (telemetryStore.size > 1000) {
    const oldestKey = Array.from(telemetryStore.keys())[0];
    telemetryStore.delete(oldestKey);
  }
};

// ============================================
// API DE TÉLÉMÉTRIE
// ============================================

export const getTelemetryStats = (): {
  totalRequests: number;
  iaRequests: number;
  averageDuration: number;
  totalCost: number;
} => {
  const entries = Array.from(telemetryStore.values());
  const iaEntries = entries.filter(e => e.iaUsed);
  
  const totalDuration = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
  const totalCost = iaEntries.reduce((sum, e) => sum + (e.iaCost || 0), 0);
  
  return {
    totalRequests: entries.length,
    iaRequests: iaEntries.length,
    averageDuration: entries.length > 0 ? totalDuration / entries.length : 0,
    totalCost,
  };
};

export const getRecentTelemetry = (limit: number = 100): TelemetryData[] => {
  return Array.from(telemetryStore.values())
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, limit);
};

export default telemetryCollector;