// src/app/admin/policies/[id]/page.tsx - Mise à jour avec les nouveaux composants
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, FileText, Building2, Calendar, Euro, 
  TrendingUp, Shield, AlertTriangle, Brain,
  Edit, Trash2
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { usePolicies } from '@/hooks/usePolicies';
import { PolicyAIAnalysisWidget } from '@/components/admin/policies/PolicyAIAnalysisWidget';
import { PolicyClauseExtractor } from '@/components/admin/policies/PolicyClauseExtractor';
import { POLICY_TYPES, POLICY_STATUS, formatCurrency, formatDate } from '@/types/policy.types';

// Helpers sécurisés
const getPolicyTypeLabel = (type: string): string => {
  const validType = type as keyof typeof POLICY_TYPES;
  return POLICY_TYPES[validType]?.label || type;
};

const getPolicyStatusLabel = (status: string): string => {
  const validStatus = status as keyof typeof POLICY_STATUS;
  return POLICY_STATUS[validStatus]?.label || status;
};

const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string | number | undefined; icon: any }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100">
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
    <span className="font-medium text-gray-900">{value || 'Non renseigné'}</span>
  </div>
);

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const policyId = parseInt(params.id as string);
  const { getPolicy, isLoading: policyLoading } = usePolicies();
  const [policy, setPolicy] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      const policyData = await getPolicy(policyId);
      setPolicy(policyData);
    };
    load();
  }, [policyId, getPolicy]);

  if (policyLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement..." />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-gray-600">Contrat non trouvé</p>
        <Button variant="primary" className="mt-4" onClick={() => router.push('/admin/policies')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/policies" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{policy.name}</h1>
            <p className="text-sm text-gray-500">N° {policy.policy_number}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" /> Modifier
          </Button>
          <Button variant="danger" size="sm">
            <Trash2 className="w-4 h-4 mr-2" /> Supprimer
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue générale</TabsTrigger>
          <TabsTrigger value="ia">🤖 IA Transversale</TabsTrigger>
          <TabsTrigger value="clauses">📋 Analyse clauses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <InfoRow label="Entreprise" value={policy.company_name} icon={Building2} />
                  <InfoRow label="Type" value={getPolicyTypeLabel(policy.type)} icon={FileText} />
                  <InfoRow label="Prime annuelle" value={formatCurrency(policy.premium_amount)} icon={Euro} />
                  <InfoRow label="Montant couvert" value={formatCurrency(policy.coverage_amount)} icon={Shield} />
                  <InfoRow label="Date début" value={formatDate(policy.start_date)} icon={Calendar} />
                  <InfoRow label="Date fin" value={formatDate(policy.end_date)} icon={Calendar} />
                  <InfoRow label="Statut" value={getPolicyStatusLabel(policy.status)} icon={AlertTriangle} />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <PolicyAIAnalysisWidget policyId={policyId} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ia">
          <PolicyAIAnalysisWidget policyId={policyId} />
        </TabsContent>

        <TabsContent value="clauses">
          <Card>
            <CardContent className="p-6">
              <PolicyClauseExtractor policyId={policyId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}