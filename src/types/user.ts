// src/types/user.ts
// Types pour l'Utilisateur
// <50 lignes

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: 'ADMIN' | 'BROKER' | 'USER';
    is_active: boolean;
    phone?: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
    last_login?: string;
  }
  
  export interface UserProfile {
    id: number;
    user_id: number;
    company_id?: number;
    department?: string;
    position?: string;
    preferences: UserPreferences;
  }
  
  export interface UserPreferences {
    language: 'fr' | 'en';
    theme: 'light' | 'dark' | 'system';
    notifications_enabled: boolean;
    email_digest: boolean;
    dashboard_layout?: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
    remember_me?: boolean;
  }
  
  export interface LoginResponse {
    access_token: string;
    refresh_token?: string;
    user: User;
    expires_in: number;
  }
  
  export interface RegisterData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role?: 'BROKER' | 'USER';
  }
  
  export interface ChangePasswordData {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }
  
  export interface ResetPasswordData {
    token: string;
    new_password: string;
    confirm_password: string;
  }
  
  export interface SessionUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'BROKER' | 'USER';
    isActive: boolean;
  }
  
  export interface AuthState {
    user: SessionUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }