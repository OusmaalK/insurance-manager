// src/app/(broker)/companies/[id]/page.tsx
// Détail entreprise (Courtier)
// <180 lignes

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useCompanies } from '@/hooks/useCompanies';
import { usePolicies } from '@/hooks/usePolicies';
import { useClaims } from '@/hooks/useClaims';
import { useIA } from '@/hooks/useIA';

// Icônes
import { 
  ArrowLeft, Building2, Mail, Phone, MapPin, 
  FileText, AlertTriangle, TrendingUp, Shield, 
  RefreshCw, Edit, Trash2, Calendar, DollarSign,
  Users, Briefcase, CheckCircle, XCircle
} from 'lucide-react';

export default function BrokerCompanyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const companyId = Number(params.id);

  const { getCompany, analyzeRisk, deleteCompany } = useCompanies();
  const { getPoliciesByCompany, predictRenewal } = usePolicies();
  const { getClaimsByCompanyId } = useClaims();
  const { analyzeClaimFraud } = useIA();

  const [company, setCompany] = useState<any>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  const [renewalPredictions, setRenewalPredictions] = useState<Map<number, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'policies' | 'claims'>('info');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      const companyData = await getCompany(companyId);
      if (companyData) setCompany(companyData);
      
      const policiesData = await getPoliciesByCompany(companyId);
      if (policiesData) setPolicies(policiesData);
      
      const claimsData = await getClaimsByCompanyId(companyId);
      if (claimsData) setClaims(claimsData);
      
      const risk = await analyzeRisk(companyId);
      if (risk) setRiskAnalysis(risk);
      
      const predictions = new Map();
      for (const policy of policiesData || []) {
        const prediction = await predictRenewal(policy.id);
        if (prediction) predictions.set(policy.id, prediction);
      }
      setRenewalPredictions(predictions);
      
      setIsLoading(false);
    };
    
    if (companyId) loadData();
  }, [companyId]);

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-700',
      INACTIVE: 'bg-gray-100 text-gray-700',
      SUSPENDED: 'bg-red-100 text-red-700'
    };
    return styles[status as keyof typeof styles] || styles.INACTIVE;
  };

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Chargement de l'entreprise..." />
        </div>
      </BrokerLayout>
    );
  }

  if (!company) {
    return (
      <BrokerLayout>
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Entreprise non trouvée</p>
          <Button onClick={() => router.push('/broker/companies')} className="mt-4">Retour</Button>
        </div>
      </BrokerLayout>
    );
  }

  const daysLeft = policies.length > 0 ? Math.min(...policies.map(p => {
    const days = Math.ceil((new Date(p.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return days > 0 ? days : 999;
  })) : null;

  return (
    <BrokerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/broker/companies')} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-500">SIRET: {company.siret}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="primary" size="sm" onClick={() => router.push(`/broker/policies/new?companyId=${company.id}`)}>
              <FileText className="w-4 h-4 mr-2" />
              Nouveau contrat
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Mail className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium">{company.email}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Phone className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Téléphone</p><p className="text-sm font-medium">{company.phone}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Localisation</p><p className="text-sm font-medium">{company.city}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Shield className={`w-5 h-5 ${company.risk_score >= 70 ? 'text-red-600' : company.risk_score >= 40 ? 'text-orange-600' : 'text-green-600'}`} /><div><p className="text-xs text-gray-500">Score risque IA</p><p className={`text-xl font-bold ${company.risk_score >= 70 ? 'text-red-600' : company.risk_score >= 40 ? 'text-orange-600' : 'text-green-600'}`}>{company.risk_score || 0}</p></div></div></CardContent></Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-3"><div className="text-center"><Briefcase className="w-6 h-6 text-gray-400 mx-auto mb-1" /><p className="text-xs text-gray-500">Activité</p><p className="text-sm font-medium truncate">{company.activity_sector || '-'}</p></div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-center"><Users className="w-6 h-6 text-gray-400 mx-auto mb-1" /><p className="text-xs text-gray-500">Employés</p><p className="text-sm font-medium">{company.employee_count || '-'}</p></div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-center"><DollarSign className="w-6 h-6 text-gray-400 mx-auto mb-1" /><p className="text-xs text-gray-500">CA annuel</p><p className="text-sm font-medium">{company.annual_revenue?.toLocaleString() || '-'} €</p></div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="text-center"><Calendar className="w-6 h-6 text-gray-400 mx-auto mb-1" /><p className="text-xs text-gray-500">Créée le</p><p className="text-sm font-medium">{new Date(company.created_at).toLocaleDateString()}</p></div></CardContent></Card>
        </div>

        <div className="border-b">
          <div className="flex gap-6">
            <button onClick={() => setActiveTab('info')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Informations</button>
            <button onClick={() => setActiveTab('policies')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'policies' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Contrats ({policies.length})</button>
            <button onClick={() => setActiveTab('claims')} className={`pb-2 px-1 text-sm font-medium ${activeTab === 'claims' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Sinistres ({claims.length})</button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle>Informations générales</CardTitle></CardHeader><CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Nom</span><span className="font-medium">{company.name}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">SIRET</span><span className="font-medium">{company.siret}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Email</span><span className="font-medium">{company.email}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Téléphone</span><span className="font-medium">{company.phone}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Adresse</span><span className="font-medium">{company.address}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Code postal</span><span className="font-medium">{company.postal_code}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">Ville</span><span className="font-medium">{company.city}</span></div>
                <div className="flex justify-between py-2"><span className="text-gray-500">Statut</span><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(company.status)}`}>{company.status}</span></div>
              </CardContent></Card>

              {riskAnalysis && (<Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-600" />Analyse IA du risque</CardTitle></CardHeader><CardContent><div className="flex justify-between items-center mb-3"><span>Niveau de risque</span><span className={`px-2 py-1 rounded text-sm ${riskAnalysis.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700' : riskAnalysis.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-700' : riskAnalysis.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{riskAnalysis.risk_level}</span></div>
              <div><p className="text-sm font-medium mb-2">Facteurs de risque</p>{riskAnalysis.factors?.map((f: any, i: number) => (<div key={i} className="mb-2"><div className="flex justify-between text-sm"><span>{f.name}</span><span>{f.impact}%</span></div><div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-yellow-500 rounded-full h-1.5" style={{ width: `${f.impact}%` }} /></div></div>))}</div>
              {riskAnalysis.recommendations?.length > 0 && (<div className="mt-3 p-3 bg-blue-50 rounded-lg"><p className="text-sm font-medium text-blue-800">Recommandations IA</p><ul className="text-sm text-blue-700 mt-1">{riskAnalysis.recommendations.map((r: string, i: number) => (<li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5" /><span>{r}</span></li>))}</ul></div>)}
              </CardContent></Card>)}
            </div>
          )}

          {activeTab === 'policies' && (<div className="space-y-4">{policies.length === 0 ? (<Card><CardContent className="text-center py-8"><FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">Aucun contrat</p><Button variant="primary" size="sm" className="mt-3" onClick={() => router.push(`/broker/policies/new?companyId=${company.id}`)}>Ajouter un contrat</Button></CardContent></Card>) : policies.map(p => { const prediction = renewalPredictions.get(p.id); const daysLeftPolicy = Math.ceil((new Date(p.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)); return (<Card key={p.id} className="hover:shadow-md transition-shadow"><CardHeader><div className="flex justify-between items-start"><div><CardTitle>{p.policy_number}</CardTitle><p className="text-sm text-gray-500">{p.insurer}</p></div><span className={`px-2 py-1 text-xs rounded-full ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : p.status === 'EXPIRED' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span></div></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"><div><p className="text-xs text-gray-500">Prime</p><p className="font-medium">{p.premium_amount.toLocaleString()} €</p></div><div><p className="text-xs text-gray-500">Franchise</p><p className="font-medium">{p.deductible.toLocaleString()} €</p></div><div><p className="text-xs text-gray-500">Début</p><p className="font-medium">{new Date(p.start_date).toLocaleDateString()}</p></div><div><p className="text-xs text-gray-500">Fin</p><p className={`font-medium ${daysLeftPolicy < 30 ? 'text-red-600' : ''}`}>{new Date(p.end_date).toLocaleDateString()} {daysLeftPolicy < 30 && `(${daysLeftPolicy}j)`}</p></div></div>{prediction && (<div className={`p-3 rounded-lg ${prediction.renewal_probability >= 70 ? 'bg-green-50' : prediction.renewal_probability >= 40 ? 'bg-yellow-50' : 'bg-red-50'}`}><div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">Prédiction renouvellement IA</span><span className={`text-sm font-bold ${prediction.renewal_probability >= 70 ? 'text-green-700' : prediction.renewal_probability >= 40 ? 'text-yellow-700' : 'text-red-700'}`}>{prediction.renewal_probability}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className={`rounded-full h-2 ${prediction.renewal_probability >= 70 ? 'bg-green-500' : prediction.renewal_probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${prediction.renewal_probability}%` }} /></div>{prediction.suggested_action && <p className="text-xs mt-2 text-gray-600">💡 {prediction.suggested_action}</p>}</div>)}</CardContent></Card>)})}</div>)}

          {activeTab === 'claims' && (<div className="space-y-4">{claims.length === 0 ? (<Card><CardContent className="text-center py-8"><AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">Aucun sinistre</p><Button variant="primary" size="sm" className="mt-3" onClick={() => router.push(`/broker/claims/new?companyId=${company.id}`)}>Déclarer un sinistre</Button></CardContent></Card>) : claims.map(c => (<Card key={c.id}><CardHeader><div className="flex justify-between"><div><CardTitle>{c.claim_number}</CardTitle><p className="text-sm text-gray-500">{c.type}</p></div><span className={`px-2 py-1 text-xs rounded-full ${c.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : c.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span></div></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"><div><p className="text-xs text-gray-500">Montant</p><p className="font-medium">{c.amount.toLocaleString()} €</p></div><div><p className="text-xs text-gray-500">Approuvé</p><p className="font-medium">{c.approved_amount?.toLocaleString() || '-'} €</p></div><div><p className="text-xs text-gray-500">Date incident</p><p className="font-medium">{new Date(c.incident_date).toLocaleDateString()}</p></div><div><p className="text-xs text-gray-500">Date création</p><p className="font-medium">{new Date(c.created_at).toLocaleDateString()}</p></div></div>{c.fraud_score > 0 && (<div className={`p-3 rounded-lg ${c.fraud_score >= 70 ? 'bg-red-50' : c.fraud_score >= 40 ? 'bg-orange-50' : 'bg-green-50'}`}><div className="flex justify-between items-center"><span className="text-sm font-medium">Score fraude IA</span><span className={`text-sm font-bold ${c.fraud_score >= 70 ? 'text-red-700' : c.fraud_score >= 40 ? 'text-orange-700' : 'text-green-700'}`}>{c.fraud_score}</span></div><div className="w-full bg-gray-200 rounded-full h-2 mt-2"><div className={`rounded-full h-2 ${c.fraud_score >= 70 ? 'bg-red-500' : c.fraud_score >= 40 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${c.fraud_score}%` }} /></div></div>)}</CardContent></Card>))}</div>)}
        </div>
      </div>
    </BrokerLayout>
  );
}