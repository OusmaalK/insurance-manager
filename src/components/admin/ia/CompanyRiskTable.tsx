// src/components/admin/ia/CompanyRiskTable.tsx
'use client';

import { useState } from 'react';
import { Building2, Shield, AlertTriangle, TrendingUp, Eye, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

interface CompanyRisk {
  id: number;
  name: string;
  industry: string;
  riskScore: number;
  trend: 'up' | 'down' | 'stable';
  fraudScore: number;
  status: 'critical' | 'high' | 'medium' | 'low';
}

export const CompanyRiskTable = () => {
  const [companies] = useState<CompanyRisk[]>([
    { id: 1, name: 'AXA France', industry: 'Assurance', riskScore: 85, trend: 'up', fraudScore: 78, status: 'critical' },
    { id: 2, name: 'Allianz', industry: 'Assurance', riskScore: 72, trend: 'up', fraudScore: 65, status: 'high' },
    { id: 3, name: 'Generali', industry: 'Assurance', riskScore: 45, trend: 'down', fraudScore: 38, status: 'medium' },
    { id: 4, name: 'Groupama', industry: 'Mutuelle', riskScore: 28, trend: 'down', fraudScore: 22, status: 'low' },
    { id: 5, name: 'MAAF', industry: 'Assurance', riskScore: 55, trend: 'stable', fraudScore: 48, status: 'medium' },
  ]);

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 50) return 'bg-orange-500';
    if (score >= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">Critique</span>;
      case 'high': return <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">Élevé</span>;
      case 'medium': return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">Modéré</span>;
      default: return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Faible</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            Entreprises à risque
          </CardTitle>
          <button className="text-sm text-blue-600 hover:text-blue-700">Voir tout →</button>
        </div>
        <p className="text-xs text-gray-500">Analyse IA des risques par entreprise</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-500">
                <th className="px-3 py-2">Entreprise</th>
                <th className="px-3 py-2">Secteur</th>
                <th className="px-3 py-2">Score risque</th>
                <th className="px-3 py-2">Score fraude</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm">{company.industry}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${getRiskColor(company.riskScore)}`} style={{ width: `${company.riskScore}%` }} />
                      </div>
                      <span className="text-sm">{company.riskScore}%</span>
                      {company.trend === 'up' && <TrendingUp className="w-3 h-3 text-red-500" />}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm">{company.fraudScore}%</td>
                  <td className="px-3 py-3">{getStatusBadge(company.status)}</td>
                  <td className="px-3 py-3">
                    <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};