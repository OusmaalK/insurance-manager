// src/middleware/iaPalierGuard.ts
// Guard pour les fonctionnalités IA (palier Standard vs IA)
// <100 lignes

import { NextRequest, NextResponse } from 'next/server';

// ============================================
// TYPES
// ============================================

interface IAUsage {
  userId: number;
  callsCount: number;
  period: string;
  tier: 'STANDARD' | 'IA';
}

// ============================================
// CONFIGURATION
// ============================================

const IA_PATHS = [
  '/api/claims/ai/',
  '/api/companies/ai/',
  '/api/policies/ai/',
  '/api/ai/assistant',
  '/api/insights',
  '/api/reports/ia',
  '/api/calendar/ai',
];

const FREE_TIER_LIMITS = {
  callsPerMonth: 10,
  features: ['basic_prediction'],
};

const PAID_TIER_LIMITS = {
  callsPerMonth: 1000,
  features: ['fraud_detection', 'risk_analysis', 'predictions', 'assistant', 'reports'],
};

// ============================================
// VÉRIFICATION DU PALIER
// ============================================

const getUserTier = async (userId: number): Promise<'STANDARD' | 'IA'> => {
  // En production, récupérer depuis la base de données
  // Pour la démo, retourner STANDARD
  return 'STANDARD';
};

const getMonthlyUsage = async (userId: number): Promise<number> => {
  // En production, compter les appels IA du mois
  // Pour la démo, retourner un nombre aléatoire
  return Math.floor(Math.random() * 20);
};

// ============================================
// MIDDLEWARE PRINCIPAL
// ============================================

export const iaPalierGuard = async (request: NextRequest): Promise<NextResponse | null> => {
  const pathname = request.nextUrl.pathname;
  
  // Vérifier si c'est une route IA
  const isIAPath = IA_PATHS.some(path => pathname.startsWith(path));
  if (!isIAPath) {
    return null; // Continuer
  }

  // Récupérer l'utilisateur depuis le token
  const token = request.cookies.get('access_token')?.value;
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Pour la démo, on utilise un userId fictif
  const userId = 1;
  
  // Vérifier le palier
  const tier = await getUserTier(userId);
  
  // Palier IA → autorisé
  if (tier === 'IA') {
    return null;
  }
  
  // Palier Standard → vérifier les limites
  const monthlyUsage = await getMonthlyUsage(userId);
  
  if (monthlyUsage >= FREE_TIER_LIMITS.callsPerMonth) {
    return NextResponse.json(
      {
        error: 'Free tier limit reached. Upgrade to IA tier for unlimited access.',
        limit: FREE_TIER_LIMITS.callsPerMonth,
        usage: monthlyUsage,
        upgradeUrl: '/settings/ia-pricing',
      },
      { status: 403 }
    );
  }
  
  // Ajouter un header pour indiquer le tier
  const response = NextResponse.next();
  response.headers.set('X-IA-Tier', 'STANDARD');
  response.headers.set('X-IA-Remaining', (FREE_TIER_LIMITS.callsPerMonth - monthlyUsage).toString());
  
  return response;
};

// ============================================
// HOOK CLIENT
// ============================================

export const checkIAAccess = async (): Promise<{
  hasAccess: boolean;
  tier: string;
  remaining?: number;
}> => {
  try {
    const response = await fetch('/api/ia/check-access');
    const data = await response.json();
    return {
      hasAccess: data.hasAccess,
      tier: data.tier,
      remaining: data.remaining,
    };
  } catch {
    return { hasAccess: false, tier: 'STANDARD' };
  }
};

export default iaPalierGuard;