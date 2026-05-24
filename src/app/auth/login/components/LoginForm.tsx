// src/app/auth/login/components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useLoginStore } from '../store/loginStore';

export function LoginForm() {
  const { onSubmit, isLoading, error, clearError } = useLoginStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (onSubmit) {
      await onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-xs text-red-200 text-center">{error}</p>
        </div>
      )}

      <div>
        <label className={`block text-xs font-medium mb-1 transition-all duration-300 ${isFocusedEmail ? 'text-blue-400' : 'text-gray-300'}`}>
          Email professionnel
        </label>
        <div className={`relative transition-all duration-300 ${isFocusedEmail ? 'transform scale-[1.01]' : ''}`}>
          <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-all duration-300 ${isFocusedEmail ? 'text-blue-400' : 'text-gray-400'}`} />
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsFocusedEmail(true)}
            onBlur={() => setIsFocusedEmail(false)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300 text-sm"
            placeholder="nom@courtier.fr"
            required
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <label className={`text-xs font-medium transition-all duration-300 ${isFocusedPassword ? 'text-blue-400' : 'text-gray-300'}`}>
            Mot de passe
          </label>
          <button type="button" className="text-[10px] text-blue-400 hover:text-blue-300">
            Mot de passe oublié ?
          </button>
        </div>
        <div className={`relative transition-all duration-300 ${isFocusedPassword ? 'transform scale-[1.01]' : ''}`}>
          <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-all duration-300 ${isFocusedPassword ? 'text-blue-400' : 'text-gray-400'}`} />
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsFocusedPassword(true)}
            onBlur={() => setIsFocusedPassword(false)}
            className="w-full pl-9 pr-8 py-2 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300 text-sm"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5 text-gray-400" /> : <Eye className="w-3.5 h-3.5 text-gray-400" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-3 h-3 accent-blue-500" />
          <span className="text-[10px] text-gray-400">Se souvenir de moi</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg text-white text-sm font-medium transition-all duration-300 disabled:opacity-50 overflow-hidden"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Connexion...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
            Se connecter
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        )}
      </button>
    </form>
  );
}