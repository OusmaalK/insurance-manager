// src/components/admin/policies/PolicyIADashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, DollarSign, Calendar, Bell } from 'lucide-react';
import { usePolicies } from '@/hooks/usePolicies';
import { Card, CardContent } from '@/shared/ui/Card';

export function PolicyIADashboard() {
  const { policies, fetchStats } = usePolicies({ autoFetch: true });
  const [stats, setStats] = useState<any>(null);
  const [renewalData, setRenewalData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchStats();
      setStats(data);
      
      // Simuler données pour graphique
      setRenewalData([
        { month: 'Jan', renewal: 72, atRisk: 12 },
        { month: 'Fév', renewal: 75, atRisk: 10 },
        { month: 'Mar', renewal: 78, atRisk: 8 },
        { month: 'Avr', renewal: 82, atRisk: 7 },
        { month: 'Mai', renewal: 85, atRisk: 5 },
        { month: 'Juin', renewal: 88, atRisk: 4 },
      ]);
    };
    load();
  }, []);

  const metrics = [
    { title: 'Contrats analysés', value: stats?.total || 0, icon: Brain, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Renouvellement prévu', value: `${stats?.avgRenewalScore || 0}%`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Contrats à risque', value: stats?.expiringCount || 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { title: 'Prime totale', value: `${(stats?.totalPremium || 0) / 1000}k€`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Métriques IA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-full ${metric.bg}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphique d'évolution */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">📈 Évolution des prédictions IA</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={renewalData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="renewal" stroke="#10b981" name="Taux renouvellement (%)" strokeWidth={2} />
              <Line type="monotone" dataKey="atRisk" stroke="#ef4444" name="Contrats à risque (%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alertes IA */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg"><Bell className="w-5 h-5 text-yellow-600" /></div>
            <div>
              <p className="font-medium text-yellow-800">Alertes IA prédictives</p>
              <p className="text-sm text-yellow-700 mt-1">
                {stats?.expiringCount || 0} contrats arrivent à échéance dans les 30 jours.
                {stats?.expiringCount > 10 && " Une action est recommandée pour sécuriser ces renouvellements."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}