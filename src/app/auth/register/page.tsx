// src/app/auth/register/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { Shield, User, Mail, Lock, Eye, EyeOff, ArrowRight, Key, Crown, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'BROKER' as 'ADMIN' | 'BROKER',
    invitationCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [invitationError, setInvitationError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const ADMIN_INVITATION_CODE = 'ADMIN2024';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'invitationCode') setInvitationError('');
    
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setPasswordError('Les mots de passe ne correspondent pas');
      } else if (name === 'confirmPassword' && formData.password && value !== formData.password) {
        setPasswordError('Les mots de passe ne correspondent pas');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleRoleChange = (role: 'ADMIN' | 'BROKER') => {
    setFormData(prev => ({ ...prev, role }));
    if (role === 'ADMIN') setInvitationError('');
  };

  const validateInvitationCode = (): boolean => {
    if (formData.role === 'ADMIN') {
      if (formData.invitationCode !== ADMIN_INVITATION_CODE) {
        setInvitationError('Code d\'invitation invalide');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    if (!validateInvitationCode()) return;
    
    const response = await register({
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
    });
    
    if (response.success) {
      router.push(formData.role === 'ADMIN' ? '/admin/dashboard' : '/broker/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Inscrivez-vous pour commencer</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sélection du rôle */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Type de compte</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('BROKER')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.role === 'BROKER'
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Briefcase className={`w-6 h-6 mx-auto mb-1 ${formData.role === 'BROKER' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${formData.role === 'BROKER' ? 'text-blue-700' : 'text-gray-600'}`}>Courtier</p>
                    <p className="text-[10px] text-gray-400">Gestion clients</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('ADMIN')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.role === 'ADMIN'
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Crown className={`w-6 h-6 mx-auto mb-1 ${formData.role === 'ADMIN' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${formData.role === 'ADMIN' ? 'text-purple-700' : 'text-gray-600'}`}>Administrateur</p>
                    <p className="text-[10px] text-gray-400">Accès complet</p>
                  </button>
                </div>
              </div>

              {/* Code d'invitation */}
              {formData.role === 'ADMIN' && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Code d'invitation *</label>
                  <div className={`relative transition-all duration-200 ${focusedField === 'invitationCode' ? 'scale-[1.02]' : ''}`}>
                    <Key className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'invitationCode' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      name="invitationCode"
                      autoComplete="off"
                      value={formData.invitationCode}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('invitationCode')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-3 py-2 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                        invitationError
                          ? 'border-red-500 focus:ring-red-100 focus:border-red-500'
                          : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
                      }`}
                      placeholder="Entrez le code d'invitation"
                      required
                    />
                  </div>
                  {invitationError && <p className="text-xs text-red-500">{invitationError}</p>}
                  <p className="text-[10px] text-gray-400">Contactez l'administrateur pour obtenir le code</p>
                </div>
              )}

              {/* Prénom et Nom */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Prénom *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Jean"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Nom *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Dupont"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="nom@exemple.fr"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Mot de passe *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Confirmation */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    autoComplete="off"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
              </div>

              {/* Submit */}
              <Button type="submit" fullWidth disabled={isLoading || !!passwordError} className="py-3 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {isLoading ? <LoadingSpinner size="sm" /> : <><User className="w-4 h-4 mr-2" />S'inscrire <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Déjà inscrit ?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Se connecter
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}