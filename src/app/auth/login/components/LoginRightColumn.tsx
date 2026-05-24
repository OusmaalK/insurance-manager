// src/app/auth/login/components/LoginRightColumn.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Fingerprint } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { DemoAccounts } from './DemoAccounts';
import { SecurityBadges } from './SecurityBadges';

export function LoginRightColumn() {
  return (
    <div className="h-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-5 lg:p-6 flex flex-col overflow-y-auto hover:bg-white/15 transition-all duration-500">
      
      {/* Badge sécurisé */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 rounded-full backdrop-blur-sm border border-green-500/30">
          <Fingerprint className="w-3 h-3 text-green-400" />
          <span className="text-[10px] text-green-400">Connexion sécurisée</span>
        </div>
      </div>
      
      {/* En-tête */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-3 py-1 mb-3">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span className="text-xs text-white/70">Accès privilégié</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Connexion</h2>
        <p className="text-xs text-gray-300">Accédez à votre espace professionnel</p>
      </div>

      {/* Formulaire */}
      <LoginForm />

      {/* Lien création compte */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-300">
          Vous n'avez pas de compte ?{' '}
          <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 group transition-all duration-300">
            Créer un compte
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </p>
      </div>

      {/* Séparateur */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-transparent text-gray-400">Accès rapide</span>
        </div>
      </div>

      {/* Comptes démo */}
      <DemoAccounts />

      {/* Badges sécurité */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <SecurityBadges />
      </div>
    </div>
  );
}