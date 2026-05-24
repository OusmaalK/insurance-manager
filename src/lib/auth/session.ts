// src/lib/auth/session.ts
// Gestion de session
// <90 lignes

'use client';

import { authConfig } from './auth.config';

interface SessionUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'BROKER' | 'USER';
  isActive: boolean;
}

interface Session {
  user: SessionUser | null;
  token: string | null;
  expiresAt: number | null;
}

class SessionManager {
  private static instance: SessionManager;
  private session: Session = {
    user: null,
    token: null,
    expiresAt: null,
  };

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem(authConfig.storage.tokenKey);
    const userStr = localStorage.getItem(authConfig.storage.userKey);
    const expiresAt = localStorage.getItem('expires_at');
    
    if (token && userStr) {
      try {
        this.session.token = token;
        this.session.user = JSON.parse(userStr);
        this.session.expiresAt = expiresAt ? parseInt(expiresAt) : null;
      } catch (error) {
        console.error('Failed to load session from storage:', error);
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    if (this.session.token && this.session.user) {
      localStorage.setItem(authConfig.storage.tokenKey, this.session.token);
      localStorage.setItem(authConfig.storage.userKey, JSON.stringify(this.session.user));
      if (this.session.expiresAt) {
        localStorage.setItem('expires_at', this.session.expiresAt.toString());
      }
    } else {
      localStorage.removeItem(authConfig.storage.tokenKey);
      localStorage.removeItem(authConfig.storage.userKey);
      localStorage.removeItem('expires_at');
    }
  }

  setSession(user: SessionUser, token: string, expiresInMinutes: number = authConfig.durations.tokenExpiry): void {
    this.session = {
      user,
      token,
      expiresAt: Date.now() + expiresInMinutes * 60 * 1000,
    };
    this.saveToStorage();
  }

  getSession(): Session {
    return { ...this.session };
  }

  getUser(): SessionUser | null {
    return this.session.user;
  }

  getToken(): string | null {
    return this.session.token;
  }

  isAuthenticated(): boolean {
    if (!this.session.token || !this.session.user) return false;
    if (this.session.expiresAt && Date.now() > this.session.expiresAt) {
      this.clearSession();
      return false;
    }
    return true;
  }

  isTokenExpired(): boolean {
    return this.session.expiresAt ? Date.now() > this.session.expiresAt : true;
  }

  clearSession(): void {
    this.session = {
      user: null,
      token: null,
      expiresAt: null,
    };
    this.saveToStorage();
  }

  updateUser(user: Partial<SessionUser>): void {
    if (this.session.user) {
      this.session.user = { ...this.session.user, ...user };
      this.saveToStorage();
    }
  }
}

export const session = SessionManager.getInstance();
export default session;