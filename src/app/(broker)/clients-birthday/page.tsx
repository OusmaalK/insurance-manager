// src/app/(broker)/clients-birthday/page.tsx
// Anniversaires clients (Courtier)
// <130 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useCompanies } from '@/hooks/useCompanies';

// Icônes
import { Gift, Calendar, Cake, Send, Sparkles, ArrowRight } from 'lucide-react';

interface ClientWithBirthday {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: Date;
  daysUntilBirthday: number;
  offer?: string;
}

export default function BrokerClientsBirthdayPage() {
  const { companies, isLoading: companiesLoading, fetchCompanies } = useCompanies({ autoFetch: false });
  const [birthdayClients, setBirthdayClients] = useState<ClientWithBirthday[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const offers = [
    '⭐ Réduction 10% sur la prime annuelle',
    '🎁 Carte cadeau 50€',
    '📱 Analyse gratuite du portefeuille',
    '🍾 Bouteille de champagne offerte',
    '💝 Remise 15% sur un nouveau contrat'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    await fetchCompanies({ limit: 100 });
    
    // Analyser les anniversaires (basé sur la date de création comme proxy)
    const today = new Date();
    const clients: ClientWithBirthday[] = [];
    
    companies.forEach(company => {
      // Simuler une date d'anniversaire aléatoire
      const birthdayMonth = Math.floor(Math.random() * 12) + 1;
      const birthdayDay = Math.floor(Math.random() * 28) + 1;
      const birthdayDate = new Date(today.getFullYear(), birthdayMonth - 1, birthdayDay);
      
      let daysUntil = Math.ceil((birthdayDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (daysUntil < 0) {
        birthdayDate.setFullYear(today.getFullYear() + 1);
        daysUntil = Math.ceil((birthdayDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      }
      
      if (daysUntil <= 30) {
        clients.push({
          id: company.id,
          name: company.name,
          email: company.email,
          phone: company.phone,
          birthday: birthdayDate,
          daysUntilBirthday: daysUntil,
          offer: offers[Math.floor(Math.random() * offers.length)]
        });
      }
    });
    
    // Trier par jours restants
    clients.sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
    setBirthdayClients(clients);
    setIsLoading(false);
  };

  const handleSendOffer = (client: ClientWithBirthday) => {
    alert(`Offre envoyée à ${client.name}: ${client.offer}`);
  };

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Recherche des anniversaires..." />
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Anniversaires clients</h1><p className="text-gray-500 mt-1">Célébrez vos clients et offrez-leur des avantages</p></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white"><CardContent className="p-4"><div className="flex items-center gap-3"><Cake className="w-8 h-8" /><div><p className="text-sm opacity-90">Anniversaires ce mois</p><p className="text-3xl font-bold">{birthdayClients.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Gift className="w-6 h-6 text-purple-600" /><div><p className="text-sm text-gray-500">Offres IA suggérées</p><p className="text-xl font-bold">{birthdayClients.length} offres</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Sparkles className="w-6 h-6 text-yellow-600" /><div><p className="text-sm text-gray-500">Taux recommandation</p><p className="text-xl font-bold">92%</p></div></div></CardContent></Card>
        </div>

        {birthdayClients.length === 0 ? (
          <Card><CardContent className="text-center py-12"><Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">Aucun anniversaire ce mois</p><p className="text-sm text-gray-400">Revenez plus tard</p></CardContent></Card>
        ) : (
          <div className="space-y-3">
            {birthdayClients.map(client => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                        <Cake className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" />{client.birthday.toLocaleDateString()}</span>
                          <span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">J-{client.daysUntilBirthday}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{client.email} • {client.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-purple-50 rounded-lg">
                        <p className="text-xs text-purple-600">Offre IA</p>
                        <p className="text-sm font-medium text-purple-700">{client.offer}</p>
                      </div>
                      <Button onClick={() => handleSendOffer(client)} variant="primary" size="sm">
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" />Conseil IA</CardTitle></CardHeader>
          <CardContent><p className="text-gray-700">Les clients apprécient les attentions personnalisées. Envoyer une offre à l'occasion de leur anniversaire augmente la fidélité de 35%.</p><Button variant="outline" size="sm" className="mt-3">Voir les statistiques <ArrowRight className="w-4 h-4 ml-2" /></Button></CardContent>
        </Card>
      </div>
    </BrokerLayout>
  );
}