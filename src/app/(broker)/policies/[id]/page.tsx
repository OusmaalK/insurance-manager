// src/app/(broker)/policies/[id]/page.tsx
// Détail contrat (Courtier)
// <170 lignes

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { usePolicies } from '@/hooks/usePolicies';
import { useIA } from '@/hooks/useIA';
import { useCompanies } from '@/hooks/useCompanies';

// Icônes
import { ArrowLeft, FileText, Calendar, DollarSign, Building2, TrendingUp, Shield, RefreshCw, AlertTriangle, User, Phone, Mail, Scale, Send } from 'lucide-react';

export default function BrokerPolicyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const policyId = Number(params.id);
  const { getPolicy, predictRenewal } = usePolicies();
  const { predictPolicyRenewal } = useIA();
  const { getCompany } = useCompanies();

  const [policy, setPolicy] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [renewalPrediction, setRenewalPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'analysis' | 'recommendations'>('info');

  useEffect(() => {
    loadData();
  }, [policyId]);

  const loadData = async () => {
    setIsLoading(true);
    const policyData = await getPolicy(policyId);
    if (policyData) {
      setPolicy(policyData);
      const clientData = await getCompany(policyData.company_id);
      if (clientData) setClient(clientData);
    }
    setIsLoading(false);
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    const prediction = await predictPolicyRenewal(policyId);
    if (prediction) setRenewalPrediction(prediction);
    setIsPredicting(false);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-700',
      EXPIRED: 'bg-gray-100 text-gray-700',
      CANCELLED: 'bg-red-100 text-red-700',
      PENDING: 'bg-yellow-100 text-yellow-700'
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Chargement du contrat..." />
        </div>
      </BrokerLayout>
    );
  }

  if (!policy) {
    return (
      <BrokerLayout>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Contrat non trouvé</p>
          <Button onClick={() => router.push('/broker/policies')} className="mt-4">Retour</Button>
        </div>
      </BrokerLayout>
    );
  }

  const daysLeft = Math.ceil((new Date(policy.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <BrokerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/broker/policies')} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{policy.policy_number}</h1>
            <p className="text-gray-500">{policy.insurer}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button onClick={handlePredict} variant="outline" size="sm" disabled={isPredicting}>
              {isPredicting ? <LoadingSpinner size="sm" /> : <TrendingUp className="w-4 h-4 mr-2" />}
              {isPredicting ? 'Prédiction...' : 'Prédire renouvellement'}
            </Button>
            <Button variant="primary" size="sm" onClick={() => router.push(`/broker/policies/${policyId}/contract-analysis`)}>
              <Scale className="w-4 h-4 mr-2" />
              Analyser
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><DollarSign className="w-5 h-5 text-green-600" /><div><p className="text-xs text-gray-500">Prime</p><p className="text-xl font-bold">{policy.premium_amount?.toLocaleString()} €</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-red-600" /><div><p className="text-xs text-gray-500">Échéance</p><p className={`text-xl font-bold ${daysLeft < 30 ? 'text-red-600' : ''}`}>{new Date(policy.end_date).toLocaleDateString()}<span className="text-sm ml-1">({daysLeft}j)</span></p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Shield className="w-5 h-5 text-blue-600" /><div><p className="text-xs text-gray-500">Couverture</p><p className="text-xl font-bold">{policy.coverage_limit?.toLocaleString()} €</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-purple-600" /><div><p className="text-xs text-gray-500">Client</p><p className="text-xl font-bold truncate">{client?.name || `#${policy.company_id}`}</p></div></div></CardContent></Card>
        </div>

        <div className="border-b">
          <div className="flex gap-6">
            <button onClick={() => setActiveTab('info')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Informations</button>
            <button onClick={() => setActiveTab('analysis')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'analysis' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Analyse IA</button>
            <button onClick={() => setActiveTab('recommendations')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'recommendations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Recommandations</button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle>Détails du contrat</CardTitle></CardHeader><CardContent className="space-y-2">
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Numéro</span><span className="font-medium">{policy.policy_number}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Type</span><span className="font-medium">{policy.type}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Statut</span><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(policy.status)}`}>{policy.status}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Assureur</span><span className="font-medium">{policy.insurer}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Franchise</span><span className="font-medium">{policy.deductible?.toLocaleString()} €</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Date début</span><span className="font-medium">{new Date(policy.start_date).toLocaleDateString()}</span></div>
                <div className="flex justify-between py-2"><span className="text-gray-500">Date fin</span><span className={`font-medium ${daysLeft < 30 ? 'text-red-600' : ''}`}>{new Date(policy.end_date).toLocaleDateString()}</span></div>
              </CardContent></Card>

              {client && (<Card><CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-blue-600" />Client associé</CardTitle></CardHeader><CardContent className="space-y-2">
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Nom</span><span className="font-medium">{client.name}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Email</span><span className="font-medium">{client.email}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Téléphone</span><span className="font-medium">{client.phone}</span></div>
                <div className="flex justify-between py-2"><span className="text-gray-500">Score risque</span><span className={`font-medium ${client.risk_score >= 70 ? 'text-red-600' : client.risk_score >= 40 ? 'text-orange-600' : 'text-green-600'}`}>{client.risk_score}</span></div>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => router.push(`/broker/clients/${client.id}`)}>Voir le client</Button>
              </CardContent></Card>)}
            </div>
          )}

          {activeTab === 'analysis' && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-600" />Analyse IA du contrat</CardTitle></CardHeader>
              <CardContent>
                {!renewalPrediction ? (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Analyse non disponible</p>
                    <Button onClick={handlePredict} variant="primary" className="mt-3">Lancer l'analyse IA</Button>
                  </div>
                ) : (
                  <div className={`p-4 rounded-lg ${renewalPrediction.renewal_probability >= 70 ? 'bg-green-50' : renewalPrediction.renewal_probability >= 40 ? 'bg-yellow-50' : 'bg-red-50'}`}>
                    <div className="flex justify-between items-center mb-3"><span className="text-gray-700">Probabilité renouvellement</span><span className="text-2xl font-bold">{renewalPrediction.renewal_probability}%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4"><div className={`rounded-full h-2 ${renewalPrediction.renewal_probability >= 70 ? 'bg-green-500' : renewalPrediction.renewal_probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${renewalPrediction.renewal_probability}%` }} /></div>
                    {renewalPrediction.reasons?.length > 0 && (<div className="mt-3"><p className="text-sm font-medium">Facteurs clés</p>{renewalPrediction.reasons.map((r: string, i: number) => (<div key={i} className="flex items-start gap-2 text-sm mt-1"><AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" /><span>{r}</span></div>))}</div>)}
                    {renewalPrediction.suggested_action && (<div className="mt-3 p-3 bg-blue-50 rounded-lg"><p className="text-sm font-medium text-blue-800">Action suggérée</p><p className="text-sm text-blue-700 mt-1">{renewalPrediction.suggested_action}</p></div>)}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'recommendations' && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Send className="w-5 h-5 text-green-600" />Recommandations personnalisées</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg"><h3 className="font-medium">Extension garantie</h3><p className="text-sm text-gray-600">Protection renforcée pour le conducteur principal</p><Button variant="outline" size="sm" className="mt-2">Proposer</Button></div>
                  <div className="p-3 border rounded-lg"><h3 className="font-medium">Option véhicule de remplacement</h3><p className="text-sm text-gray-600">Véhicule de prêt en cas de sinistre</p><Button variant="outline" size="sm" className="mt-2">Proposer</Button></div>
                  <div className="p-3 border rounded-lg"><h3 className="font-medium">Franchise ajustable</h3><p className="text-sm text-gray-600">Économie potentielle de 150€/an</p><Button variant="outline" size="sm" className="mt-2">Proposer</Button></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-2" />Télécharger contrat</Button>
          <Button variant="primary" size="sm" onClick={() => router.push(`/broker/clients/${policy.company_id}`)}>Contacter le client</Button>
        </div>
      </div>
    </BrokerLayout>
  );
}