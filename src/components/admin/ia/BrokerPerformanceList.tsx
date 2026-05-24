// src/components/admin/ia/BrokerPerformanceList.tsx
'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Award, Star, Users, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

interface BrokerPerformance {
  id: number;
  name: string;
  email: string;
  totalPolicies: number;
  totalCommission: number;
  growthRate: number;
  clientSatisfaction: number;
  activeClients: number;
  rank: number;
}

export const BrokerPerformanceList = () => {
  const [brokers, setBrokers] = useState<BrokerPerformance[]>([
    { id: 1, name: 'Sophie Martin', email: 'sophie.martin@courtier.fr', totalPolicies: 245, totalCommission: 89450, growthRate: 15.2, clientSatisfaction: 96, activeClients: 187, rank: 1 },
    { id: 2, name: 'Thomas Bernard', email: 'thomas.bernard@courtier.fr', totalPolicies: 198, totalCommission: 72340, growthRate: 8.7, clientSatisfaction: 92, activeClients: 156, rank: 2 },
    { id: 3, name: 'Marie Lambert', email: 'marie.lambert@courtier.fr', totalPolicies: 167, totalCommission: 61200, growthRate: 12.3, clientSatisfaction: 94, activeClients: 134, rank: 3 },
    { id: 4, name: 'Nicolas Dubois', email: 'nicolas.dubois@courtier.fr', totalPolicies: 134, totalCommission: 48900, growthRate: 5.1, clientSatisfaction: 88, activeClients: 98, rank: 4 },
    { id: 5, name: 'Julie Petit', email: 'julie.petit@courtier.fr', totalPolicies: 112, totalCommission: 41200, growthRate: 18.4, clientSatisfaction: 91, activeClients: 87, rank: 5 },
  ]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Award className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Award className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 text-center text-gray-500">{rank}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Performance des courtiers
          </CardTitle>
          <button className="text-sm text-blue-600 hover:text-blue-700">Voir classement →</button>
        </div>
        <p className="text-xs text-gray-500">Classement basé sur les performances IA</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {brokers.map((broker) => (
            <div key={broker.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 text-center">{getRankIcon(broker.rank)}</div>
                <div>
                  <p className="font-medium text-gray-900">{broker.name}</p>
                  <p className="text-xs text-gray-500">{broker.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold">{broker.totalPolicies}</p>
                  <p className="text-xs text-gray-500">Contrats</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{broker.totalCommission.toLocaleString()}€</p>
                  <p className="text-xs text-gray-500">Commissions</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <p className="text-sm font-semibold text-green-600">{broker.growthRate}%</p>
                  </div>
                  <p className="text-xs text-gray-500">Croissance</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <p className="text-sm font-semibold">{broker.clientSatisfaction}%</p>
                  </div>
                  <p className="text-xs text-gray-500">Satisfaction</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};