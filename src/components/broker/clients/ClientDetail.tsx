// src/components/broker/clients/ClientDetail.tsx
// Détail client (Courtier) - Version corrigée
// <180 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useCompanies } from '@/hooks/useCompanies';
import { usePolicies } from '@/hooks/usePolicies';
import { useClaims } from '@/hooks/useClaims';
import { useIA } from '@/hooks/useIA';

// Icônes
import { Building2, Mail, Phone, MapPin, FileText, AlertTriangle, TrendingUp, Shield, Calendar, DollarSign, Users, Briefcase, CheckCircle } from 'lucide-react';

interface ClientDetailProps {
  clientId: number;
  onBack?: () => void;
}

export const ClientDetail = ({ clientId, onBack }: ClientDetailProps) => {
  const router = useRouter();
  const { getCompany, analyzeRisk } = useCompanies();
  const { getPoliciesByCompany, predictRenewal } = usePolicies();
  const { getClaimsByCompanyId } = useClaims();

  const [client, setClient] = useState<any>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  const [renewalPredictions, setRenewalPredictions] = useState<Map<number, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'policies' | 'claims'>('info');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const clientData = await getCompany(clientId);
      if (clientData) setClient(clientData);
      const policiesData = await getPoliciesByCompany(clientId);
      if (policiesData) setPolicies(policiesData);
      const claimsData = await getClaimsByCompanyId(clientId);
      if (claimsData) setClaims(claimsData);
      const risk = await analyzeRisk(clientId);
      if (risk) setRiskAnalysis(risk);
      const predictions = new Map();
      for (const policy of policiesData || []) {
        const prediction = await predictRenewal(policy.id);
        if (prediction) predictions.set(policy.id, prediction);
      }
      setRenewalPredictions(predictions);
      setIsLoading(false);
    };
    if (clientId) loadData();
  }, [clientId]);

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-8">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p>Client non trouvé</p>
        <Button onClick={onBack}>Retour</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100">
            ← Retour
          </button>
        )}
        <div>
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <p className="text-gray-500">SIRET: {client.siret}</p>
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={() => router.push(`/broker/clients/${client.id}/risk-analysis`)}>
            Analyser risque IA
          </Button>
        </div>
      </div>

      {/* Cartes d'information */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm">{client.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Téléphone</p>
                <p className="text-sm">{client.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Ville</p>
                <p className="text-sm">{client.city}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${getRiskColor(client.risk_score)}`} />
              <div>
                <p className="text-xs text-gray-500">Score risque</p>
                <p className={`text-xl font-bold ${getRiskColor(client.risk_score)}`}>
                  {client.risk_score || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <div className="border-b">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2 text-sm font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`pb-2 text-sm font-medium ${activeTab === 'policies' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Contrats ({policies.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`pb-2 text-sm font-medium ${activeTab === 'claims' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Sinistres ({claims.length})
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-4">
        {/* Onglet Informations */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Nom</span>
                  <span className="font-medium">{client.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">SIRET</span>
                  <span className="font-medium">{client.siret}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{client.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Téléphone</span>
                  <span className="font-medium">{client.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Adresse</span>
                  <span className="font-medium">{client.address}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Ville</span>
                  <span className="font-medium">{client.city}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Secteur</span>
                  <span className="font-medium">{client.activity_sector || '-'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Analyse IA */}
            {riskAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Analyse IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-3">
                    <span>Niveau</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      riskAnalysis.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      riskAnalysis.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                      riskAnalysis.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {riskAnalysis.risk_level}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Facteurs</p>
                    {riskAnalysis.factors?.map((f: any, i: number) => (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between text-sm">
                          <span>{f.name}</span>
                          <span>{f.impact}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-yellow-500 rounded-full h-1.5" style={{ width: `${f.impact}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {riskAnalysis.recommendations?.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Recommandations</p>
                      <ul className="text-sm text-blue-700 mt-1">
                        {riskAnalysis.recommendations.map((r: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Onglet Contrats */}
        {activeTab === 'policies' && (
          <div className="space-y-3">
            {policies.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Aucun contrat</p>
                  <Button variant="primary" size="sm" onClick={() => router.push(`/broker/policies/new?companyId=${client.id}`)}>
                    Ajouter un contrat
                  </Button>
                </CardContent>
              </Card>
            ) : (
              policies.map(p => {
                const prediction = renewalPredictions.get(p.id);
                const daysLeft = Math.ceil((new Date(p.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                return (
                  <Card key={p.id}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle>{p.policy_number}</CardTitle>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {p.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Prime</p>
                          <p className="font-medium">{p.premium_amount.toLocaleString()} €</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Échéance</p>
                          <p className={`font-medium ${daysLeft < 30 ? 'text-red-600' : ''}`}>
                            {new Date(p.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {prediction && (
                        <div className={`mt-2 p-2 rounded ${prediction.renewal_probability >= 70 ? 'bg-green-50' : prediction.renewal_probability >= 40 ? 'bg-yellow-50' : 'bg-red-50'}`}>
                          <div className="flex justify-between">
                            <span className="text-sm">Renouvellement IA</span>
                            <span className="text-sm font-bold">{prediction.renewal_probability}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className={`rounded-full h-1.5 ${prediction.renewal_probability >= 70 ? 'bg-green-500' : prediction.renewal_probability >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${prediction.renewal_probability}%` }} />
                          </div>
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => router.push(`/broker/policies/${p.id}`)}>
                        Détails
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Onglet Sinistres */}
        {activeTab === 'claims' && (
          <div className="space-y-3">
            {claims.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Aucun sinistre</p>
                </CardContent>
              </Card>
            ) : (
              claims.map(c => (
                <Card key={c.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{c.claim_number}</CardTitle>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${c.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : c.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {c.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Montant</p>
                        <p className="font-medium">{c.amount.toLocaleString()} €</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium">{new Date(c.incident_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {c.fraud_score > 0 && (
                      <div className={`mt-2 p-2 rounded ${c.fraud_score >= 70 ? 'bg-red-50' : c.fraud_score >= 40 ? 'bg-orange-50' : 'bg-green-50'}`}>
                        <div className="flex justify-between">
                          <span className="text-sm">Score fraude IA</span>
                          <span className="text-sm font-bold">{c.fraud_score}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className={`rounded-full h-1.5 ${c.fraud_score >= 70 ? 'bg-red-500' : c.fraud_score >= 40 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${c.fraud_score}%` }} />
                        </div>
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => router.push(`/broker/claims/${c.id}`)}>
                      Détails
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;