// src/app/auth/login/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { LoginLeftColumn } from './components/LoginLeftColumn';
import { LoginRightColumn } from './components/LoginRightColumn';
import { useLoginHandler } from './hooks/useLoginHandler';
import { useLoginStore } from './store/loginStore';

function LoginInitializer() {
  const { setActions } = useLoginStore();
  const { handleLogin, handleDemoSelect } = useLoginHandler();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      setActions({
        onSubmit: handleLogin,
        onDemoSelect: handleDemoSelect,
      });
    }
  }, [setActions, handleLogin, handleDemoSelect]);

  return null;
}

export default function LoginPage() {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
      <LoginInitializer />
      
      {/* Container flex qui centre parfaitement le contenu */}
      <div className="w-full h-full flex items-center justify-center p-6 sm:p-8 lg:p-10">
        
        {/* Conteneur principal avec marges automatiques */}
        <div className="w-full max-w-[1400px] mx-auto">
          
          {/* Header centré */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg mb-4">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs sm:text-sm font-medium text-white">Plateforme Certifiée</span>
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Insurance Broker Platform
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-2">
              La plateforme nouvelle génération avec IA intégrée
            </p>
          </div>

          {/* Grille 2 colonnes centrée */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Colonne gauche */}
            <div className="h-full">
              <LoginLeftColumn />
            </div>
            
            {/* Colonne droite */}
            <div className="h-full">
              <LoginRightColumn />
            </div>
            
          </div>

          {/* Footer centré */}
          <footer className="text-center mt-6 lg:mt-8 pt-4 border-t border-white/10">
            <p className="text-[10px] sm:text-xs text-gray-400">
              © 2026 Insurance Broker Platform. Tous droits réservés.
            </p>
          </footer>
          
        </div>
      </div>
    </div>
  );
}