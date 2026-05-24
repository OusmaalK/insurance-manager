// src/components/auth/IATransversalBanner.tsx
'use client';

import React from 'react';
import { Brain, Zap, TrendingUp, Shield, Network, Cpu } from 'lucide-react';

export default function IATransversalBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-4 shadow-lg">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-yellow-300" />
          <span className="text-xs font-bold text-yellow-200 uppercase tracking-wider">IA Transversale</span>
          <Network className="w-4 h-4 text-yellow-300" />
          <div className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-green-500/30 rounded-full">
            <Cpu className="w-3 h-3 text-green-300" />
            <span className="text-[10px] text-green-300">Multi-modules</span>
          </div>
        </div>
        
        <h3 className="text-base font-bold text-white mb-1">L'IA au cœur de votre activité</h3>
        <p className="text-sm text-white/80 mb-3 leading-relaxed">
          Une intelligence artificielle qui traverse tous vos modules pour des décisions plus justes et rapides.
        </p>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-xs text-white/90">Corrélation automatique</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
            <TrendingUp className="w-3.5 h-3.5 text-green-300" />
            <span className="text-xs text-white/90">Prédictions croisées</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5 text-red-300" />
            <span className="text-xs text-white/90">Détection globale</span>
          </div>
        </div>

        {/* Badge IA Active */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 rounded-full backdrop-blur-sm border border-green-400/30">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-green-300 font-medium">IA Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}