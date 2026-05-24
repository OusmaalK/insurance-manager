// src/components/admin/SplashScreen.tsx
'use client';

import { useState, useEffect } from 'react';
import { Shield, Brain, Zap, Network, Cpu, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  duration?: number;
}

export function SplashScreen({ duration = 10000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const messages = [
    'Initialisation de la plateforme...',
    'Chargement des modules IA...',
    'Connexion aux serveurs sécurisés...',
    'Préparation de votre espace...',
    'Presque prêt...',
  ];

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      const messageIndex = Math.min(Math.floor(elapsed / 2000), messages.length - 1);
      setCurrentMessage(messageIndex);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          // Déclencher un événement personnalisé
          window.dispatchEvent(new CustomEvent('splashComplete'));
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, messages.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo animé */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-500/20 rounded-full animate-ping" />
          </div>
          <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Shield className="w-12 h-12 text-white animate-pulse" />
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
          Insurance Broker Platform
        </h1>
        <p className="text-gray-400 text-sm mb-8">Plateforme nouvelle génération avec IA intégrée</p>

        {/* Message dynamique */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <p className="text-gray-300 text-sm">{messages[currentMessage]}</p>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Pourcentage */}
        <p className="text-gray-500 text-xs mb-6">{Math.round(progress)}%</p>

        {/* Badges IA */}
        <div className="flex flex-wrap justify-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full">
            <Brain className="w-3 h-3 text-purple-400" />
            <span className="text-xs text-gray-300">IA Transversale</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full">
            <Network className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-gray-300">Multi-modules</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full">
            <Cpu className="w-3 h-3 text-green-400" />
            <span className="text-xs text-gray-300">Haute performance</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-gray-300">Temps réel</span>
          </div>
        </div>

        {/* Version */}
        <p className="text-gray-600 text-xs mt-8">Version 3.0.0 • © 2026</p>
      </div>
    </div>
  );
}

export default SplashScreen;