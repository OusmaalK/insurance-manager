// src/app/(broker)/claims/[id]/page.tsx
// Détail sinistre (Courtier)
// <180 lignes

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useClaims } from '@/hooks/useClaims';
import { useIA } from '@/hooks/useIA';
import { useCompanies } from '@/hooks/useCompanies';

// Icônes
import { ArrowLeft, AlertTriangle, Shield, FileText, Calendar, DollarSign, User, CheckCircle, XCircle, Clock, RefreshCw, TrendingUp, Brain } from 'lucide-react';

export default function BrokerClaimDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const claimId = Number(params.id);
  const { getClaim, analyzeFraud, analyzeRisk, predictAmount } = useClaims();
  const { getCompany } = useCompanies();

  const [claim, setClaim] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [fraudAnalysis, setFraudAnalysis] = useState<any>(null);
  const [amountPrediction, setAmountPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'analysis'>('info');

  useEffect(() => {
    loadData();
  }, [claimId]);

  const loadData = async () => {
    setIsLoading(true);
    const claimData = await getClaim(claimId);
    if (claimData) {
      setClaim(claimData);
      const clientData = await getCompany(claimData.company_id);
      if (clientData) setClient(clientData);
    }
    setIsLoading(false);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const [fraud, amount] = await Promise.all([analyzeFraud(claimId), predictAmount(claimId)]);
    if (fraud) setFraudAnalysis(fraud);
    if (amount) setAmountPrediction(amount);
    setIsAnalyzing(false);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      IN_REVIEW: 'bg-blue-100 text-blue-700'
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Chargement du sinistre..." />
        </div>
      </BrokerLayout>
    );
  }

  if (!claim) {
    return (
      <BrokerLayout>
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Sinistre non trouvé</p>
          <Button onClick={() => router.push('/broker/claims')} className="mt-4">Retour</Button>
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/broker/claims')} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{claim.claim_number}</h1>
            <p className="text-gray-500">{claim.type}</p>
          </div>
          <div className="ml-auto">
            <Button onClick={handleAnalyze} disabled={isAnalyzing} variant="primary" size="sm">
              {isAnalyzing ? <LoadingSpinner size="sm" /> : <Brain className="w-4 h-4 mr-2" />}
              {isAnalyzing ? 'Analyse en cours...' : 'Analyser avec IA'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><DollarSign className="w-5 h-5 text-green-600" /><div><p className="text-xs text-gray-500">Montant</p><p className="text-xl font-bold">{claim.amount?.toLocaleString()} €</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-blue-600" /><div><p className="text-xs text-gray-500">Date incident</p><p className="text-xl font-bold">{new Date(claim.incident_date).toLocaleDateString()}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Shield className="w-5 h-5 text-purple-600" /><div><p className="text-xs text-gray-500">Score fraude</p><p className={`text-xl font-bold ${claim.fraud_score >= 70 ? 'text-red-600' : claim.fraud_score >= 40 ? 'text-orange-600' : 'text-green-600'}`}>{claim.fraud_score || 0}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><User className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Client</p><p className="text-xl font-bold truncate">{client?.name || `#${claim.company_id}`}</p></div></div></CardContent></Card>
        </div>

        <div className="border-b">
          <div className="flex gap-6">
            <button onClick={() => setActiveTab('info')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Informations</button>
            <button onClick={() => setActiveTab('analysis')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'analysis' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Analyse IA</button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle>Informations sinistre</CardTitle></CardHeader><CardContent className="space-y-2">
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Numéro</span><span className="font-medium">{claim.claim_number}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Type</span><span className="font-medium">{claim.type}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Statut</span><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(claim.status)}`}>{claim.status}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Montant approuvé</span><span className="font-medium">{claim.approved_amount?.toLocaleString() || '-'} €</span></div>
                <div className="flex justify-between py-2"><span className="text-gray-500">Description</span><p className="text-sm mt-1">{claim.description || '-'}</p></div>
              </CardContent></Card>

              {client && (<Card><CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-blue-600" />Client associé</CardTitle></CardHeader><CardContent className="space-y-2">
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Nom</span><span className="font-medium">{client.name}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Email</span><span className="font-medium">{client.email}</span></div>
                <div className="flex justify-between py-2"><span className="text-gray-500">Score risque</span><span className={`font-medium ${client.risk_score >= 70 ? 'text-red-600' : client.risk_score >= 40 ? 'text-orange-600' : 'text-green-600'}`}>{client.risk_score}</span></div>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => router.push(`/broker/clients/${client.id}`)}>Voir le client</Button>
              </CardContent></Card>)}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-4">
              {!fraudAnalysis && !amountPrediction && !isAnalyzing ? (
                <Card><CardContent className="text-center py-12"><Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">Analyse IA non disponible</p><Button onClick={handleAnalyze} variant="primary" className="mt-3">Lancer l'analyse</Button></CardContent></Card>
              ) : (
                <>
                  {fraudAnalysis && (<Card><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-red-600" />Analyse Fraude IA</CardTitle></CardHeader><CardContent><div className="flex justify-between items-center mb-3"><span>Niveau risque</span><span className={`px-2 py-1 rounded text-sm font-medium ${fraudAnalysis.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700' : fraudAnalysis.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-700' : fraudAnalysis.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{fraudAnalysis.risk_level}</span></div>
                  <div className="flex justify-between items-center mb-3"><span>Score confiance</span><span className="font-medium">{(fraudAnalysis.confidence * 100).toFixed(1)}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-purple-600 rounded-full h-2" style={{ width: `${fraudAnalysis.confidence * 100}%` }} /></div>
                  {fraudAnalysis.indicators?.length > 0 && (<div className="mt-3"><p className="text-sm font-medium">Indicateurs</p>{fraudAnalysis.indicators.map((i: any, idx: number) => (<div key={idx} className="flex justify-between text-sm py-1"><span>{i.name}</span><span className={i.score >= 70 ? 'text-red-600' : i.score >= 40 ? 'text-orange-600' : 'text-green-600'}>{i.score}%</span></div>))}</div>)}
                  </CardContent></Card>)}

                  {amountPrediction && (<Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" />Prédiction Montant IA</CardTitle></CardHeader><CardContent><div className="flex justify-between items-center mb-3"><span>Montant estimé</span><span className="text-xl font-bold text-green-600">{amountPrediction.predicted_amount.toLocaleString()} €</span></div>
                  <div className="flex justify-between items-center mb-3"><span>Confiance</span><span className="font-medium">{(amountPrediction.confidence * 100).toFixed(1)}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 rounded-full h-2" style={{ width: `${amountPrediction.confidence * 100}%` }} /></div>
                  {amountPrediction.factors?.length > 0 && (<div className="mt-3"><p className="text-sm font-medium">Facteurs</p>{amountPrediction.factors.map((f: string, idx: number) => (<p key={idx} className="text-sm text-gray-600">• {f}</p>))}</div>)}
                  </CardContent></Card>)}
                </>
              )}
            </div>
          )}
        </div>

        {claim.status === 'PENDING' && (
          <div className="flex justify-end gap-3">
            <Button variant="danger" size="sm"><XCircle className="w-4 h-4 mr-2" />Rejeter</Button>
            <Button variant="success" size="sm"><CheckCircle className="w-4 h-4 mr-2" />Approuver</Button>
          </div>
        )}
      </div>
    </BrokerLayout>
  );
}