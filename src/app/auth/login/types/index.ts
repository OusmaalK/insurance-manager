// src/app/auth/login/types/index.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  role?: 'admin' | 'broker';
}

export interface DemoAccount {
  role: string;
  email: string;
  password: string;
}