// src/types/roles.ts
// Types pour les Rôles et Permissions
// <35 lignes

export type UserRole = 'ADMIN' | 'BROKER' | 'USER';

export interface Role {
  id: string;
  name: UserRole;
  permissions: Permission[];
  description: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';
}

export const ROLES: Record<UserRole, Role> = {
  ADMIN: {
    id: 'admin',
    name: 'ADMIN',
    permissions: [],
    description: 'Administrateur système - accès complet'
  },
  BROKER: {
    id: 'broker',
    name: 'BROKER',
    permissions: [],
    description: 'Courtier - gestion des clients et contrats'
  },
  USER: {
    id: 'user',
    name: 'USER',
    permissions: [],
    description: 'Utilisateur standard'
  }
};

export const PERMISSIONS = {
  VIEW_COMPANIES: 'view_companies',
  MANAGE_COMPANIES: 'manage_companies',
  VIEW_POLICIES: 'view_policies',
  MANAGE_POLICIES: 'manage_policies',
  VIEW_CLAIMS: 'view_claims',
  MANAGE_CLAIMS: 'manage_claims',
  VIEW_REPORTS: 'view_reports',
  GENERATE_REPORTS: 'generate_reports',
  MANAGE_USERS: 'manage_users',
  VIEW_IA_ANALYSIS: 'view_ia_analysis',
  MANAGE_IA_SETTINGS: 'manage_ia_settings'
};