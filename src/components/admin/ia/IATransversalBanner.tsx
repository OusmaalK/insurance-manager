// src/components/admin/ia/IATransversalBanner.tsx
'use client';

import Link from 'next/link';
import { Brain, Zap, Target, Award, BarChart3, Sparkles, Shield, TrendingUp, Clock } from 'lucide-react';

interface IATransversalBannerProps {
  className?: string;
  showMetrics?: boolean;
}

export const IATransversalBanner = ({ className = '', showMetrics = true }: IATransversalBannerProps) => {
  const metrics = [
    { label: 'Précision', value: '94%', icon: Target, color: 'text-green-300' },
    { label: 'Temps réponse', value: '<1s', icon: Zap, color: 'text-yellow-300' },
    { label: 'Analyses', value: '1.2K', icon: BarChart3, color: 'text-blue-300' },
    { label: 'Fraudes détectées', value: '+23%', icon: Shield, color: 'text-red-300' },
  ];

  return (
    <div className={`bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-5 text-white shadow-xl ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left section - Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold">IA Transversale Active</h3>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full animate-pulse">
                Temps réel
              </span>
              <span className="text-xs bg-green-500/30 px-2 py-0.5 rounded-full">
                Gemini 2.0 Flash
              </span>
            </div>
            <p className="text-purple-100 text-sm mt-1 max-w-2xl">
              L'IA analyse chaque sinistre en corrélation avec les contrats et entreprises concernés.
              Détection de fraude, prédiction de montant et recommandations automatiques.
            </p>
            
            {/* Metrics */}
            {showMetrics && (
              <div className="flex flex-wrap gap-4 mt-3">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-purple-200">
                    <metric.icon className={`w-3 h-3 ${metric.color}`} />
                    <span className="font-medium">{metric.value}</span>
                    <span className="text-purple-300">{metric.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-3">
          <Link href="/admin/ia/dashboard">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Tableau de bord IA
            </button>
          </Link>
          <Link href="/admin/ia/audit">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm font-medium backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              Audit IA
            </button>
          </Link>
        </div>
      </div>

      {/* Progress bar animation */}
      <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-300 to-blue-300 rounded-full animate-pulse" style={{ width: '70%' }} />
      </div>
    </div>
  );
};

export default IATransversalBanner;