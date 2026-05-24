// src/components/admin/ia/FraudScoreCard.tsx
'use client';

import { Shield, AlertTriangle, TrendingUp, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

interface FraudScoreCardProps {
  score: number;
  claimId?: number;
  factors?: string[];
  recommendation?: string;
  className?: string;
}

export const FraudScoreCard = ({ 
  score, 
  claimId, 
  factors = ['Documentation suspecte', 'Incohérence dates', 'Montant anormal'], 
  recommendation = 'Analyse approfondie recommandée',
  className = '' 
}: FraudScoreCardProps) => {
  const getScoreColor = () => {
    if (score >= 80) return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50', label: 'Critique' };
    if (score >= 60) return { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50', label: 'Élevé' };
    if (score >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-700', light: 'bg-yellow-50', label: 'Modéré' };
    return { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50', label: 'Faible' };
  };

  const scoreColor = getScoreColor();

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Score de fraude IA
          </CardTitle>
          {claimId && (
            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Voir sinistre <Eye className="w-3 h-3" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Score circle */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle 
                cx="64" cy="64" r="56" fill="none" 
                stroke={scoreColor.bg}
                strokeWidth="8"
                strokeDasharray={`${score * 3.52} 352`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{score}%</span>
              <span className="text-xs text-gray-500">score fraude</span>
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="text-center mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${scoreColor.light} ${scoreColor.text}`}>
            Niveau {scoreColor.label}
          </span>
        </div>

        {/* Factors */}
        {factors.length > 0 && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Facteurs de suspicion
            </p>
            <ul className="space-y-1">
              {factors.map((factor, idx) => (
                <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-red-400" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendation */}
        <div className="p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Recommandation IA: {recommendation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};