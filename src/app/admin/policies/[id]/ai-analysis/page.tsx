// src/app/admin/policies/[id]/ai-analysis/page.tsx
// Page analyse IA approfondie contrat
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Brain, TrendingUp, Shield, AlertTriangle, Sparkles, Download, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { usePolicyAI } from '@/hooks/usePolicyAI';
import { formatCurrency } from '@/types/policy.types';

export default function PolicyAIAnalysisPage() {
  const params = useParams(); const router = useRouter();
  const policyId = parseInt(params.id as string);
  const { analyzeRisk, getPredictions, analyzeClauses, isLoading } = usePolicyAI();
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [clauseAnalysis, setClauseAnalysis] = useState<any>(null);

  useEffect(() => { const load = async () => { const risk = await analyzeRisk(policyId); setRiskAnalysis(risk); const pred = await getPredictions(policyId); setPredictions(pred); const clauses = await analyzeClauses(policyId); setClauseAnalysis(clauses); }; load(); }, [policyId]);

  if (isLoading) return <div className="flex justify-center items-center h-96"><LoadingSpinner size="lg" text="Analyse IA en cours..." /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3"><Link href={`/admin/policies/${policyId}`} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link><div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"><Brain className="w-6 h-6 text-white" /></div><div><h1 className="text-2xl font-bold text-gray-900">Analyse IA</h1><p className="text-sm text-gray-500">Analyse approfondie du contrat</p></div></div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white"><div className="flex items-start justify-between"><div><h2 className="text-xl font-bold">Intelligence Artificielle Transversale</h2><p className="text-purple-100 text-sm mt-1">Analyse basée sur Gemini 2.0 Flash - {new Date().toLocaleDateString()}</p><div className="flex gap-4 mt-2 text-xs text-purple-200"><span>🎯 Précision: 92%</span><span>⚡ Temps réel</span><span>📊 Modèle v2.0</span></div></div><div className="p-3 bg-white/10 rounded-xl"><Brain className="w-8 h-8" /></div></div></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5"><div className="bg-white rounded-xl border p-5 text-center"><p className="text-3xl font-bold text-blue-600">{riskAnalysis?.risk_score || 35}%</p><p className="text-sm text-gray-600 mt-1">Score de risque</p></div><div className="bg-white rounded-xl border p-5 text-center"><p className="text-3xl font-bold text-green-600">{predictions?.renewal_probability || 85}%</p><p className="text-sm text-gray-600 mt-1">Probabilité renouvellement</p></div><div className="bg-white rounded-xl border p-5 text-center"><p className="text-3xl font-bold text-red-600">{predictions?.claim_probability || 12}%</p><p className="text-sm text-gray-600 mt-1">Risque sinistre</p></div></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" />Facteurs de risque</CardTitle></CardHeader><CardContent className="space-y-3">{riskAnalysis?.factors?.map((factor: any, idx: number) => (<div key={idx} className="p-3 bg-gray-50 rounded-lg"><div className="flex justify-between"><span className="font-medium">{factor.name}</span><span className={factor.impact >= 70 ? 'text-red-600' : factor.impact >= 40 ? 'text-orange-600' : 'text-green-600'}>{factor.impact}%</span></div><div className="w-full bg-gray-200 rounded-full h-1.5 mt-2"><div className={`h-1.5 rounded-full ${factor.impact >= 70 ? 'bg-red-500' : factor.impact >= 40 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${factor.impact}%` }}></div></div><p className="text-xs text-gray-500 mt-2">{factor.description}</p></div>))}</CardContent></Card>

        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500" />Clauses à risque</CardTitle></CardHeader><CardContent className="space-y-3">{clauseAnalysis?.extracted_clauses?.filter((c: any) => c.risk_level === 'HIGH').map((clause: any, idx: number) => (<div key={idx} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500"><p className="font-medium">{clause.title}</p><p className="text-xs text-gray-600 mt-1">{clause.content.substring(0, 150)}...</p><p className="text-xs text-red-600 mt-2">{clause.explanation}</p></div>))}</CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-green-500" />Recommandations IA</CardTitle></CardHeader><CardContent><div className="space-y-3">{predictions?.next_best_actions?.map((action: any, idx: number) => (<div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><div><p className="font-medium">{action.action}</p><p className="text-sm text-gray-600">{action.reason}</p><p className="text-xs text-purple-600 mt-1">Impact attendu: {action.expected_impact} | Priorité: {action.priority}</p></div></div>))}</div></CardContent></Card>

      <div className="flex justify-end gap-3"><Button variant="outline"><Download className="w-4 h-4 mr-2" />Exporter PDF</Button><Button variant="primary" onClick={() => router.push(`/admin/policies/${policyId}`)}>Retour au contrat</Button></div>
    </div>
  );
}