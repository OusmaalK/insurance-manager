// src/middleware/rate-limiter.ts
// Rate limiting pour les appels API
// <120 lignes

import { NextRequest, NextResponse } from 'next/server';

// ============================================
// TYPES
// ============================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

// ============================================
// STOCKAGE EN MÉMOIRE
// ============================================

const store = new Map<string, RateLimitEntry>();

// Nettoyage périodique (toutes les heures)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, 60 * 60 * 1000);

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

const getKey = (request: NextRequest): string => {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const path = request.nextUrl.pathname;
  return `${ip}:${path}`;
};

// ============================================
// MIDDLEWARE PRINCIPAL
// ============================================

export const rateLimiter = (config: RateLimitConfig) => {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const key = getKey(request);
    const now = Date.now();
    const entry = store.get(key);

    // Première requête ou entrée expirée
    if (!entry || now > entry.resetTime) {
      store.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return null; // Continuer
    }

    // Incrémenter le compteur
    if (entry.count < config.maxRequests) {
      entry.count++;
      store.set(key, entry);
      return null; // Continuer
    }

    // Limite atteinte
    const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);
    
    return NextResponse.json(
      {
        error: config.message || 'Too many requests, please try again later.',
        retryAfter: resetInSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': resetInSeconds.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString(),
        },
      }
    );
  };
};

// ============================================
// CONFIGURATIONS PRÉDÉFINIES
// ============================================

export const strictRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: 'Too many requests. Please wait a moment.',
});

export const mediumRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
  message: 'Rate limit exceeded. Please slow down.',
});

export const relaxedRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  message: 'Too many requests. Please try again later.',
});

export const iaRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20,
  message: 'IA rate limit exceeded. Please wait before making more requests.',
});

// ============================================
// MIDDLEWARE D'APPLICATION
// ============================================

export async function applyRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;
  
  // Routes IA → limite stricte
  if (pathname.includes('/ai/') || pathname.includes('/claims/ai/')) {
    return await iaRateLimiter(request);
  }
  
  // Routes API sensibles
  if (pathname.includes('/api/auth/login') || pathname.includes('/api/auth/register')) {
    return await strictRateLimiter(request);
  }
  
  // Routes API standard
  if (pathname.startsWith('/api/')) {
    return await mediumRateLimiter(request);
  }
  
  // Routes publiques
  return null;
}

export default rateLimiter;