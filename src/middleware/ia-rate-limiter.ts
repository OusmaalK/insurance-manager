// src/middleware/ia-rate-limiter.ts
// Rate limiter pour les appels IA
// <110 lignes

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

class IARateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Nettoyage périodique toutes les heures
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (now > entry.resetTime) {
          this.store.delete(key);
        }
      }
    }, 60 * 60 * 1000);
  }

  private getKey(request: NextRequest, userId?: number): string {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const path = request.nextUrl.pathname;
    const userPart = userId ? `user:${userId}` : ip;
    return `${userPart}:${path}`;
  }

  async checkLimit(
    request: NextRequest,
    config: RateLimitConfig,
    userId?: number
  ): Promise<{ allowed: boolean; retryAfter?: number }> {
    const key = this.getKey(request, userId);
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return { allowed: true };
    }

    if (entry.count < config.maxRequests) {
      entry.count++;
      this.store.set(key, entry);
      return { allowed: true };
    }

    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  createMiddleware(config: RateLimitConfig) {
    return async (request: NextRequest, userId?: number): Promise<NextResponse | null> => {
      const result = await this.checkLimit(request, config, userId);
      
      if (!result.allowed) {
        return NextResponse.json(
          {
            error: config.message || 'Trop de requêtes, veuillez réessayer plus tard.',
            retryAfter: result.retryAfter,
          },
          {
            status: 429,
            headers: {
              'Retry-After': result.retryAfter!.toString(),
              'X-RateLimit-Limit': config.maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
            },
          }
        );
      }
      
      return null;
    };
  }
}

export const iaRateLimiter = new IARateLimiter();

// Configurations prédéfinies
export const strictRateLimiter = iaRateLimiter.createMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: 'Limite de requêtes atteinte. Veuillez patienter.',
});

export const mediumRateLimiter = iaRateLimiter.createMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
  message: 'Trop de requêtes. Ralentissez votre cadence.',
});

export const relaxedRateLimiter = iaRateLimiter.createMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  message: 'Limite de requêtes atteinte.',
});

export const iaRateLimitMiddleware = iaRateLimiter.createMiddleware({
  windowMs: 60 * 1000,
  maxRequests: 20,
  message: 'Limite d\'appels IA atteinte. Veuillez patienter.',
});

export default iaRateLimiter;