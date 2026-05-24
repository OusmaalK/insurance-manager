// src/app/admin/claims/[id]/page.tsx
// Page détail sinistre avec IA
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, AlertTriangle, Building2, Calendar, Euro, 
  FileText, Shield, Brain, Sparkles, Eye, Edit, Trash2,
  CheckCircle, XCircle, Clock, Download, RefreshCw,
  TrendingUp, AlertCircle
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useClaims } from '@/hooks/useClaims';
import { useClaimAI } from '@/hooks/useClaimAI';
import { CLAIM_STATUS, formatCurrency, formatDate, getFraudColor, getFraudLabel } from '@/types/claim.types';

// Composant InfoRow
const InfoRow = ({ label, value, icon: Icon }: any) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100">
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
    <span className="font-medium text-gray-900">{value || 'Non renseigné'}</span>
  </div>
);

// Composant FraudeScore
const FraudScoreCard = ({ analysis }: { analysis: any }) => {
  const score = analysis?.fraud_score || 0;
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Analyse Anti-Fraude IA</h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFraudColor(score)}`}>
            {getFraudLabel(score)} ({score}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div className={`h-2 rounded-full ${score >= 80 ? 'bg-red-500' : score >= 60 ? 'bg-orange-500' : score >= 40 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${score}%` }} />
        </div>
        {analysis?.suspicious_factors?.map((factor: any, idx: number) => (
          <div key={idx} className="mt-2 p-2 bg-white rounded-lg">
            <p className="text-sm font-medium">{factor.name}</p>
            <p className="text-xs text-gray-600">{factor.description}</p>
          </div>
        ))}
        <p className="text-sm font-medium mt-3 text-red-700">Action recommandée: {analysis?.recommended_action}</p>
      </CardContent>
    </Card>
  );
};

export default function ClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const claimId = parseInt(params.id as string);
  const { getClaim, updateStatus, isLoading: claimLoading } = useClaims();
  const { detectFraud, predictAmount, isLoading: aiLoading } = useClaimAI();
  const [claim, setClaim] = useState<any>(null);
  const [fraudAnalysis, setFraudAnalysis] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      const claimData = await getClaim(claimId);
      setClaim(claimData);
      if (claimData) {
        const [fraud, pred] = await Promise.all([
          detectFraud(claimId),
          predictAmount(claimId)
        ]);
        setFraudAnalysis(fraud);
        setPredictions(pred);
      }
    };
    load();
  }, [claimId, getClaim, detectFraud, predictAmount]);

  const handleStatusUpdate = async (status: string) => {
    await updateStatus(claimId, status as any);
    const updated = await getClaim(claimId);
    setClaim(updated);
  };

  if (claimLoading || aiLoading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner size="lg" text="Chargement..." /></div>;
  }

  if (!claim) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-gray-600">Sinistre non trouvé</p>
        <Button variant="primary" className="mt-4" onClick={() => router.push('/admin/claims')}>Retour</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/claims" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{claim.title}</h1>
            <p className="text-sm text-gray-500">N° {claim.claim_number}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={claim.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(CLAIM_STATUS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" />Modifier</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue générale</TabsTrigger>
          <TabsTrigger value="ia">🤖 IA Anti-Fraude</TabsTrigger>
          <TabsTrigger value="documents">📎 Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card><CardHeader><CardTitle>Informations du sinistre</CardTitle></CardHeader><CardContent>
                <InfoRow label="Contrat" value={claim.policy_name} icon={FileText} />
                <InfoRow label="Entreprise" value={claim.company_name} icon={Building2} />
                <InfoRow label="Date incident" value={formatDate(claim.incident_date)} icon={Calendar} />
                <InfoRow label="Date déclaration" value={formatDate(claim.declaration_date)} icon={Calendar} />
                <InfoRow label="Montant estimé" value={formatCurrency(claim.estimated_amount)} icon={Euro} />
                <InfoRow label="Description" value={claim.description} icon={FileText} />
              </CardContent></Card>
            </div>
            <div className="space-y-6">
              <FraudScoreCard analysis={fraudAnalysis} />
              {predictions && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-500" />Prédiction IA</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div><p className="text-sm text-gray-500">Montant prédit</p><p className="text-2xl font-bold text-blue-600">{formatCurrency(predictions.predicted_amount)}</p></div>
                    <div><p className="text-sm text-gray-500">Confiance</p><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${predictions.confidence_score}%` }} /></div></div>
                    <div><p className="text-sm text-gray-500">Délai estimation</p><p className="font-medium">{predictions.estimated_processing_days} jours</p></div>
                    <div><p className="text-sm text-gray-500">Probabilité approbation</p><p className="font-medium">{predictions.approval_probability}%</p></div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ia">
          <FraudScoreCard analysis={fraudAnalysis} />
        </TabsContent>

        <TabsContent value="documents">
          <Card><CardContent className="p-6 text-center"><FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">Aucun document joint</p><Button variant="outline" size="sm" className="mt-2">Ajouter des documents</Button></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}