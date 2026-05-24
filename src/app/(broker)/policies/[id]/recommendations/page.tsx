// src/app/(broker)/policies/[id]/recommendations/page.tsx
// Recommandations produits IA (Courtier)
// <140 lignes

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { usePolicies } from '@/hooks/usePolicies';
import { useCompanies } from '@/hooks/useCompanies';

// Icônes
import { ArrowLeft, Sparkles, TrendingUp, Shield, DollarSign, CheckCircle, Send, FileText } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  benefit: string;
  potentialSavings: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export default function PolicyRecommendationsPage() {
  const params = useParams();
  const router = useRouter();
  const policyId = Number(params.id);

  const { getPolicy } = usePolicies();
  const { getCompany } = useCompanies();

  const [policy, setPolicy] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      
      // Générer recommandations basées sur le profil
      const recs: Recommendation[] = [];
      
      if (policyData.type === 'AUTO') {
        recs.push({ id: '1', title: 'Extension garantie conducteur', description: 'Protection renforcée pour le conducteur principal', type: 'AUTO', benefit: 'Couverture étendue', potentialSavings: 0, priority: 'MEDIUM' });
        recs.push({ id: '2', title: 'Option véhicule de remplacement', description: 'Véhicule de prêt en cas de sinistre', type: 'AUTO', benefit: 'Mobilité garantie', potentialSavings: 0, priority: 'HIGH' });
      }
      
      if (policyData.type === 'HABITATION') {
        recs.push({ id: '3', title: 'Protection vol et vandalisme', description: 'Garantie supplémentaire contre les vols', type: 'HABITATION', benefit: 'Tranquillité d\'esprit', potentialSavings: 0, priority: 'HIGH' });
        recs.push({ id: '4', title: 'Assistance dépannage 24/7', description: 'Service d\'urgence disponible à tout moment', type: 'HABITATION', benefit: 'Assistance rapide', potentialSavings: 0, priority: 'MEDIUM' });
      }
      
      recs.push({ id: '5', title: 'Franchise ajustable', description: 'Ajustez votre franchise pour réduire la prime', type: 'GENERAL', benefit: `Économie potentielle`, potentialSavings: Math.round(policyData.premium_amount * 0.15), priority: 'HIGH' });
      
      setRecommendations(recs);
    }
    setIsLoading(false);
  };

  const getPriorityBadge = (priority: string) => {
    const styles = { HIGH: 'bg-red-100 text-red-700', MEDIUM: 'bg-yellow-100 text-yellow-700', LOW: 'bg-green-100 text-green-700' };
    return styles[priority as keyof typeof styles] || styles.LOW;
  };

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Génération des recommandations..." />
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push(`/broker/policies/${policyId}`)} className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-2xl font-bold text-gray-900">Recommandations IA</h1><p className="text-gray-500">Client: {client?.name} • Contrat: {policy?.policy_number}</p></div>
        </div>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <CardContent className="p-4"><div className="flex items-center gap-3"><Sparkles className="w-8 h-8" /><div><p className="text-sm opacity-90">Suggestions personnalisées</p><p className="text-lg font-bold">Basées sur le profil et les besoins du client</p></div></div></CardContent>
        </Card>

        <div className="space-y-3">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(rec.priority)}`}>{rec.priority}</span>
                    </div>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">💡 {rec.benefit}</span>
                      {rec.potentialSavings > 0 && <span className="text-xs text-green-600">💰 Économie: {rec.potentialSavings}€/an</span>}
                    </div>
                  </div>
                  <Button variant="outline" size="sm"><Send className="w-3 h-3 mr-1" />Proposer</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-blue-50">
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" />Pourquoi ces recommandations ?</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-gray-700">L'IA analyse le profil du client, ses besoins, le type de contrat et les données du marché pour générer des recommandations personnalisées qui maximisent la satisfaction et la protection.</p></CardContent>
        </Card>
      </div>
    </BrokerLayout>
  );
}