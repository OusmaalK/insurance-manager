// src/app/auth/login/components/LoginLeftColumn.tsx
'use client';

import { 
  Building2, 
  CheckCircle, 
  TrendingUp, 
  Shield, 
  Zap, 
  Award, 
  Users, 
  Rocket, 
  Sparkles, 
  Brain, 
  Network, 
  Cpu 
} from 'lucide-react';

export function LoginLeftColumn() {
  const features = [
    { icon: Brain, title: 'Assistant IA Vocal', desc: 'Commandes vocales, analyses instantanées', color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, title: 'Prédictions IA', desc: 'Renouvellements, sinistres, résiliations', color: 'from-green-500 to-teal-500' },
    { icon: Shield, title: 'Anti-Fraude IA', desc: 'Détection automatique des fraudes', color: 'from-red-500 to-orange-500' },
    { icon: Zap, title: 'Planning Intelligent', desc: 'Optimisation automatique', color: 'from-blue-500 to-cyan-500' },
    { icon: Network, title: 'Analyse de contrats', desc: 'Extraction automatique des clauses', color: 'from-orange-500 to-yellow-500' },
    { icon: Cpu, title: 'Rapports narratifs', desc: 'Génération par IA', color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-sm rounded-2xl shadow-2xl p-5 lg:p-6 flex flex-col overflow-y-auto border border-white/20">
      
      {/* Badge IA */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm animate-float">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span className="text-[10px] text-white/80">IA Transversale Active</span>
        </div>
      </div>
      
      <div className="space-y-5">
        
        {/* Bannière IA Transversale */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <Brain className="w-5 h-5 text-purple-300" />
            IA Transversale
          </h2>
          <p className="text-sm text-white/80 max-w-md mx-auto">
            Une intelligence artificielle qui traverse tous vos modules pour des décisions plus justes et rapides
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">Corrélation automatique</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">Prédictions croisées</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">Détection globale</span>
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Fonctionnalités exclusives */}
        <div>
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Fonctionnalités exclusives
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group bg-white/10 rounded-xl p-3 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-default"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-semibold text-white">{feature.title}</p>
                <p className="text-[10px] text-white/60 mt-0.5">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="group bg-white/10 rounded-xl p-3 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-default">
            <Building2 className="w-6 h-6 text-green-300 mx-auto mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-xl font-bold text-white">100+</p>
            <p className="text-[10px] text-white/60">Courtiers partenaires</p>
          </div>
          <div className="group bg-white/10 rounded-xl p-3 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-default">
            <CheckCircle className="w-6 h-6 text-green-300 mx-auto mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-xl font-bold text-white">98%</p>
            <p className="text-[10px] text-white/60">Satisfaction client</p>
          </div>
          <div className="group bg-white/10 rounded-xl p-3 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-default">
            <TrendingUp className="w-6 h-6 text-green-300 mx-auto mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-xl font-bold text-white">+156%</p>
            <p className="text-[10px] text-white/60">Croissance annuelle</p>
          </div>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 pb-1">
          <div className="flex items-center gap-1.5 text-[10px] text-white/50">
            <Shield className="w-3 h-3" /> ISO 27001
          </div>
          <div className="w-0.5 h-3 bg-white/20 rounded-full" />
          <div className="flex items-center gap-1.5 text-[10px] text-white/50">
            <Zap className="w-3 h-3" /> 99.9% Uptime
          </div>
          <div className="w-0.5 h-3 bg-white/20 rounded-full" />
          <div className="flex items-center gap-1.5 text-[10px] text-white/50">
            <CheckCircle className="w-3 h-3" /> RGPD compliant
          </div>
        </div>
      </div>
    </div>
  );
}