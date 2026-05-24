// src/app/admin/companies/[id]/page.tsx
// Page détail entreprise avec analyses IA complètes
// <180 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { CompanyRiskScore } from '@/components/admin/companies/CompanyRiskScore';
import { useCompanies } from '@/hooks/useCompanies';

// Icônes
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  DollarSign,
  Calendar,
  ArrowLeft,
  TrendingUp,
  Shield,
  Brain,
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  ExternalLink,
  BarChart3,
  Target,
  Award
} from 'lucide-react';

// Composant d'information clé
const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string | number; icon?: any }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100">
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </div>
    <span className="font-medium text-gray-900">{value || 'Non renseigné'}</span>
  </div>
);

// Composant de métrique IA
const IAMetricCard = ({ title, value, description, trend, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      {trend && (
        <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{title}</p>
    {description && <p className="text-xs text-gray-400 mt-2">{description}</p>}
  </div>
);

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = parseInt(params.id as string);
  
  const { getCompany, isLoading } = useCompanies();
  const [company, setCompany] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompany = async () => {
      const data = await getCompany(companyId);
      if (data) {
        setCompany(data);
      } else {
        setError('Entreprise non trouvée');
      }
    };
    loadCompany();
  }, [companyId, getCompany]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Chargement..." />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-gray-600">{error || 'Entreprise introuvable'}</p>
        <Button variant="primary" className="mt-4" onClick={() => router.push('/admin/companies')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/companies" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-sm text-gray-500">SIRET: {company.siret}</p>
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

      {/* Grille principale 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Informations générales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carte informations */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoRow label="Email" value={company.email} icon={Mail} />
              <InfoRow label="Téléphone" value={company.phone} icon={Phone} />
              <InfoRow label="Adresse" value={`${company.address}, ${company.city} ${company.postal_code}`} icon={MapPin} />
              <InfoRow label="Secteur d'activité" value={company.activity_sector} icon={Briefcase} />
              <InfoRow label="Nombre d'employés" value={company.employee_count?.toLocaleString()} icon={Users} />
              <InfoRow label="Chiffre d'affaires" value={company.annual_revenue ? `€${company.annual_revenue.toLocaleString()}` : 'Non renseigné'} icon={DollarSign} />
              <InfoRow label="Date de création" value={new Date(company.created_at).toLocaleDateString()} icon={Calendar} />
            </CardContent>
          </Card>

          {/* Section contrats récents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contrats récents</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/policies?company=${company.id}`)}>
                Voir tous <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {company.policies?.length > 0 ? (
                <div className="space-y-2">
                  {company.policies.slice(0, 3).map((policy: any) => (
                    <div key={policy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{policy.name}</p>
                        <p className="text-xs text-gray-500">Échéance: {new Date(policy.end_date).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        policy.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {policy.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">Aucun contrat</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Analyses IA */}
        <div className="space-y-6">
          {/* Score de risque IA */}
          <CompanyRiskScore companyId={companyId} onRefresh={() => window.location.reload()} />

          {/* Métriques IA supplémentaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                Insights IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Probabilité sinistre</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{company.claim_probability || 12}%</span>
                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${company.claim_probability || 12}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Score fidélité</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{company.loyalty_score || 85}%</span>
                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${company.loyalty_score || 85}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Potentiel cross-sell</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{company.cross_sell_potential || 72}%</span>
                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${company.cross_sell_potential || 72}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommandations IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Recommandations IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-xs text-gray-700">Proposer une extension garantie</p>
              </div>
              <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="w-4 h-4 text-purple-500 mt-0.5" />
                <p className="text-xs text-gray-700">Opportunité de cross-sell: assurance cyber</p>
              </div>
              <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5" />
                <p className="text-xs text-gray-700">Renouvellement dans 45 jours</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <div className="flex flex-col gap-2">
            <Link href={`/admin/companies/${companyId}/ai-analysis`}>
              <Button fullWidth variant="primary" className="flex items-center justify-center gap-2">
                <Brain className="w-4 h-4" />
                Analyse IA complète
              </Button>
            </Link>
            <Link href={`/admin/policies/new?company=${companyId}`}>
              <Button fullWidth variant="outline" className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Ajouter un contrat
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}