// src/app/admin/reports/ia/page.tsx
// Page des rapports IA
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Brain, TrendingUp, Shield, AlertTriangle, 
  Sparkles, Eye, Download, Calendar, 
  Target, Award, Zap, BarChart3, PieChart
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent } from '@/shared/ui/Card';
import { useAIReports } from '@/hooks/useAIReports';
import { formatDateTime } from '@/types/report.types';

// Métriques IA
const AIMetricsCards = () => {
  const metrics = [
    { title: 'Score global', value: '94%', icon: Target, color: 'bg-green-500', trend: '+12%' },
    { title: 'Fraude détectée', value: '18', icon: Shield, color: 'bg-red-500', trend: '+23%' },
    { title: 'Précision prédictions', value: '92%', icon: TrendingUp, color: 'bg-blue-500', trend: '+5%' },
    { title: 'Rapports générés', value: '124', icon: Brain, color: 'bg-purple-500', trend: '+34%' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className={`${metric.color} p-2.5 rounded-xl`}>
              <metric.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{metric.trend}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          <p className="text-sm text-gray-500 mt-1">{metric.title}</p>
        </div>
      ))}
    </div>
  );
};

// Carte rapport IA
const AIReportCard = ({ report, onClick }: { report: any; onClick: () => void }) => (
  <div 
    className="bg-white rounded-xl border p-4 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
    onClick={onClick}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-gray-900">{report.title}</h3>
      </div>
      <span className="text-xs text-gray-400">{formatDateTime(report.generatedAt)}</span>
    </div>
    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{report.summary}</p>
    <div className="flex items-center justify-between mt-3 pt-2 border-t">
      <div className="flex gap-1">
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
          {report.insights?.length || 0} insights
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
          {report.recommendations?.length || 0} recommandations
        </span>
      </div>
      <Button variant="ghost" size="sm">
        Voir <Eye className="w-3 h-3 ml-1" />
      </Button>
    </div>
  </div>
);

export default function AIReportsPage() {
  const router = useRouter();
  const { aiReports, fetchAIReports, isLoading } = useAIReports();

  useEffect(() => {
    fetchAIReports();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Rapports IA
          </h1>
          <p className="text-sm text-gray-500 mt-1">Rapports intelligents avec analyses prédictives</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/admin/reports/new')}>
          <Sparkles className="w-4 h-4 mr-2" />
          Générer rapport IA
        </Button>
      </div>

      {/* Métriques IA */}
      <AIMetricsCards />

      {/* Bannière */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Analyse IA avancée</h3>
            <p className="text-purple-100 text-sm mt-1">
              Les rapports IA utilisent Gemini 2.0 pour générer des insights, 
              détecter des tendances et proposer des recommandations personnalisées.
            </p>
          </div>
        </div>
      </div>

      {/* Liste des rapports IA */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Chargement des rapports...</div>
      ) : aiReports.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun rapport IA généré</p>
          <Button variant="primary" className="mt-4" onClick={() => router.push('/admin/reports/new')}>
            Générer votre premier rapport IA
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {aiReports.map((report) => (
            <AIReportCard 
              key={report.id} 
              report={report} 
              onClick={() => router.push(`/admin/reports/${report.id}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}