// src/middleware.ts
// Middleware principal Next.js pour la protection des routes

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================
// CONFIGURATION
// ============================================

const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/health',
  '/api/health',
];

const ADMIN_PATHS = ['/admin'];
const BROKER_PATHS = ['/broker'];

// ============================================
// MIDDLEWARE PRINCIPAL
// ============================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ✅ Redirection de /admin/audit-logs vers /admin/audit
  if (pathname === '/admin/audit-logs') {
    return NextResponse.redirect(new URL('/admin/audit', request.url));
  }
  
  // Vérifier si le chemin est public
  const isPublicPath = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Récupérer le token depuis les cookies
  const token = request.cookies.get('access_token')?.value;
  
  // Pas de token → redirection vers login
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Vérifier le rôle via l'API (optionnel - validation rapide)
  const userRole = request.cookies.get('user_role')?.value;
  
  // Protection des routes admin
  if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  // Protection des routes broker
  if (BROKER_PATHS.some(path => pathname.startsWith(path))) {
    if (userRole !== 'BROKER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Ajouter le token aux headers pour les appels API
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Authorization', `Bearer ${token}`);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// ============================================
// CONFIGURATION DU MATCHER
// ============================================

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};