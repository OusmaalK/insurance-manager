// src/components/auth/FeatureShowcase.tsx
'use client';

import React from 'react';
import { Bot, Shield, TrendingUp, Calendar, FileText, BarChart3, Sparkles } from 'lucide-react';

const features = [
  { icon: <Bot className="w-5 h-5" />, title: 'Assistant IA Vocal', desc: 'Commandes vocales, analyses instantanées', gradient: 'from-purple-500 to-pink-500' },
  { icon: <Shield className="w-5 h-5" />, title: 'Anti-Fraude IA', desc: 'Détection automatique des fraudes', gradient: 'from-red-500 to-orange-500' },
  { icon: <TrendingUp className="w-5 h-5" />, title: 'Prédictions IA', desc: 'Renouvellements, sinistres, résiliations', gradient: 'from-green-500 to-teal-500' },
  { icon: <Calendar className="w-5 h-5" />, title: 'Planning Intelligent', desc: 'Optimisation automatique', gradient: 'from-blue-500 to-cyan-500' },
  { icon: <FileText className="w-5 h-5" />, title: 'Analyse de contrats', desc: 'Extraction automatique des clauses', gradient: 'from-orange-500 to-yellow-500' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'Rapports narratifs', desc: 'Génération par IA', gradient: 'from-cyan-500 to-blue-500' },
];

export default function FeatureShowcase() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">Fonctionnalités exclusives</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {features.map((f, i) => (
          <div key={i} className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${f.gradient} shadow-md`}>
                <div className="text-white">{f.icon}</div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="text-xs text-white/60 mt-0.5">{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}