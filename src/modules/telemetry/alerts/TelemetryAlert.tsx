// src/modules/telemetry/alerts/TelemetryAlert.tsx
// Alertes de télémétrie pour l'administrateur
// <110 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { AlertTriangle, Bell, CheckCircle, XCircle, Settings, RefreshCw } from 'lucide-react';
import { costCollector } from '../collectors/costCollector';
import { latencyCollector } from '../collectors/latencyCollector';

// ============================================
// TYPES
// ============================================

interface Alert {
  id: string;
  type: 'cost' | 'latency' | 'error_rate';
  severity: 'warning' | 'critical' | 'info';
  message: string;
  value: number;
  threshold: number;
  timestamp: string;
  resolved: boolean;
}

// ============================================
// CONFIGURATION
// ============================================

const THRESHOLDS = {
  maxDailyCost: 10, // €
  maxLatency: 3000, // ms
  maxErrorRate: 10, // %
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const TelemetryAlert = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAlerts();
    const interval = setInterval(checkAlerts, 5 * 60 * 1000); // Toutes les 5 minutes
    return () => clearInterval(interval);
  }, []);

  const checkAlerts = () => {
    setIsLoading(true);
    
    const newAlerts: Alert[] = [];
    
    // Vérifier les coûts
    const dailyCost = costCollector.getSummary(undefined, 1);
    if (dailyCost.totalCost > THRESHOLDS.maxDailyCost) {
      newAlerts.push({
        id: `cost-${Date.now()}`,
        type: 'cost',
        severity: dailyCost.totalCost > THRESHOLDS.maxDailyCost * 1.5 ? 'critical' : 'warning',
        message: `Coût journalier élevé: ${dailyCost.totalCost.toFixed(2)} €`,
        value: dailyCost.totalCost,
        threshold: THRESHOLDS.maxDailyCost,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    }
    
    // Vérifier la latence
    const latencySummary = latencyCollector.getSummary(undefined, 1);
    if (latencySummary.averageLatency > THRESHOLDS.maxLatency) {
      newAlerts.push({
        id: `latency-${Date.now()}`,
        type: 'latency',
        severity: latencySummary.averageLatency > THRESHOLDS.maxLatency * 1.5 ? 'critical' : 'warning',
        message: `Latence moyenne élevée: ${latencySummary.averageLatency.toFixed(0)} ms`,
        value: latencySummary.averageLatency,
        threshold: THRESHOLDS.maxLatency,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    }
    
    // Vérifier le taux d'erreur
    if (latencySummary.successRate < (100 - THRESHOLDS.maxErrorRate)) {
      const errorRate = 100 - latencySummary.successRate;
      newAlerts.push({
        id: `error-${Date.now()}`,
        type: 'error_rate',
        severity: errorRate > THRESHOLDS.maxErrorRate * 1.5 ? 'critical' : 'warning',
        message: `Taux d'erreur élevé: ${errorRate.toFixed(1)}%`,
        value: errorRate,
        threshold: THRESHOLDS.maxErrorRate,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
    }
    
    setAlerts(prev => [...newAlerts, ...prev.filter(a => !a.resolved)].slice(0, 20));
    setIsLoading(false);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const activeAlerts = alerts.filter(a => !a.resolved);
  const hasActiveAlerts = activeAlerts.length > 0;

  if (!hasActiveAlerts && !isLoading) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Système IA opérationnel</p>
              <p className="text-sm text-green-600">Aucune alerte à signaler</p>
            </div>
            <Button onClick={checkAlerts} variant="outline" size="sm" className="ml-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Vérifier
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {activeAlerts.map((alert) => (
        <Card key={alert.id} className={`${alert.severity === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getSeverityIcon(alert.severity)}
                <div>
                  <p className={`font-medium ${alert.severity === 'critical' ? 'text-red-800' : 'text-yellow-800'}`}>
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Seuil: {alert.threshold} | Actuel: {alert.value.toFixed(1)} | {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <Button onClick={() => resolveAlert(alert.id)} variant="outline" size="sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Résoudre
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TelemetryAlert;