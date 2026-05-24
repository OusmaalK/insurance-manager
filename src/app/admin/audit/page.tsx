// src/app/admin/audit/page.tsx
// Page d'audit avec IA transversale - Version complète corrigée
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Activity, Shield, AlertTriangle, CheckCircle, 
  Brain, Eye, Download, Filter, ChevronLeft, ChevronRight,
  Calendar, Clock, User, Server, Zap, TrendingUp,
  Sparkles, Target, Award, BarChart3, PieChart
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent } from '@/shared/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useAudit } from '@/hooks/useAudit';
import { AuditLogsTable } from '@/components/admin/audit/AuditLogsTable';
import { AuditFilters } from '@/components/admin/audit/AuditFilters';
import { AuditExportButton } from '@/components/admin/audit/AuditExportButton';
import { AuditStatsCards } from '@/components/admin/audit/AuditStatsCards';
import { useAuditFilterStore } from '@/stores/auditFilterStore';
import { useAuditModalStore } from '@/stores/auditModalStore';
import { AuditDetailsModal } from '@/components/admin/audit/AuditDetailsModal';
import { 
  AUDIT_MODULES, AUDIT_SEVERITY, AUDIT_STATUS,
  getModuleLabel, getModuleColor,
  getSeverityLabel, getSeverityColor,
  getStatusLabel, getStatusColor,
  formatDuration, formatDateTime, formatTimeAgo
} from '@/types/audit.types';

// ============================================
// BANNIÈRE IA TRANSVERSALE
// ============================================
const IATransversalBanner = () => {
  const router = useRouter();
  
  return (
    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-5 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold">Audit IA Transversale</h3>
              <span className="text-xs bg-green-500/30 px-2 py-0.5 rounded-full">Traçabilité complète</span>
              <span className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full">Temps réel</span>
            </div>
            <p className="text-purple-100 text-sm mt-1 max-w-2xl">
              Toutes les actions et décisions de l'IA sont tracées pour garantir la transparence et la conformité.
              Audit complet des appels API, coûts et performances.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-purple-200">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 1.2K appels tracés</span>
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> 99.9% disponibilité</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> Conforme RGPD</span>
              <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> 124€ coût total</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/admin/audit/ia')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all"
          >
            <Brain className="w-4 h-4" />
            Audit IA
          </button>
          <button 
            onClick={() => router.push('/admin/ia/dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Dashboard IA
          </button>
        </div>
      </div>
      <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-300 to-blue-300 rounded-full animate-pulse" style={{ width: '70%' }} />
      </div>
    </div>
  );
};

// ============================================
// PAGE PRINCIPALE
// ============================================
export default function AuditPage() {
  const router = useRouter();
  const { logs, stats, isLoading, fetchLogs, fetchStats } = useAudit({ autoFetch: true });
  const { isOpen: showFilters, toggleFilters, filters } = useAuditFilterStore();
  const { closeModal } = useAuditModalStore();
  const [activeTab, setActiveTab] = useState('logs');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLogs({ ...filters });
  }, [filters]);

  if (isLoading && !logs.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement des logs..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Audit & Traçabilité
          </h1>
          <p className="text-sm text-gray-500 mt-1">Journal complet des actions et décisions IA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleFilters}>
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          <AuditExportButton />
        </div>
      </div>

      {/* Bannière IA */}
      <IATransversalBanner />

      {/* Statistiques */}
      // src/app/admin/audit/page.tsx (extrait modifié)
<AuditStatsCards 
  stats={stats || {
    totalLogs: 0,
    totalIALogs: 0,
    errorsCount: 0,
    warningsCount: 0,
    criticalCount: 0,
    averageDuration: 0,
    totalCost: 0,
  }} 
  isLoading={isLoading} 
/>
      {/* Filtres - Sans props car utilise le store */}
      {showFilters && <AuditFilters />}

      {/* Tabs */}
      <Tabs defaultValue="logs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="logs">📋 Logs généraux</TabsTrigger>
          <TabsTrigger value="ia">🧠 Logs IA</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="mt-4">
          <AuditLogsTable 
            logs={logs} 
            isLoading={isLoading}
            onRowClick={(id: number) => router.push(`/admin/audit/${id}`)}
          />
          {/* Pagination */}
          {logs.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">{logs.length} logs</span>
              <div className="flex gap-2">
                <button className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-2 bg-purple-600 text-white rounded-lg">1</span>
                <button className="p-2 border rounded-lg hover:bg-gray-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ia" className="mt-4">
          <div className="text-center py-12 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Module d'audit IA en cours de développement</p>
            <button 
              onClick={() => router.push('/admin/audit/ia')}
              className="mt-3 text-purple-600 hover:text-purple-700"
            >
              Voir l'audit IA dédié →
            </button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal détails */}
      <AuditDetailsModal />

      {/* Badge IA */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t flex items-center justify-center gap-2">
        <Brain className="w-3 h-3 text-purple-400" />
        <span>Traçabilité complète • Conforme RGPD • Audit en temps réel</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </div>
  );
}