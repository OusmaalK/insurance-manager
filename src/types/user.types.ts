// src/types/user.types.ts
// Types pour le module Users
// <200 lignes

// ============================================
// TYPES POUR L'AUTHENTIFICATION
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
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

// ============================================
// USER - Types principaux
// ============================================

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'ADMIN' | 'BROKER' | 'USER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
  metadata?: UserMetadata;
  activityScore?: number;
  performanceScore?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
}

export interface UserMetadata {
  avatar?: string;
  department?: string;
  position?: string;
  managerId?: number;
  managerName?: string;
}

// ============================================
// FORMULAIRE
// ============================================

export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: User['role'];
  password?: string;
  department?: string;
  position?: string;
}

// ============================================
// ANALYSE IA
// ============================================

export interface UserActivityAnalysis {
  userId: number;
  activityScore: number;
  engagementLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  mostActiveModule: string;
  averageSessionDuration: number;
  lastActivityDate: string;
  recommendations: string[];
}

export interface UserPerformanceMetrics {
  userId: number;
  tasksCompleted: number;
  responseTime: number;
  clientSatisfaction: number;
  policiesManaged: number;
  claimsProcessed: number;
  efficiencyScore: number;
  trend: 'up' | 'down' | 'stable';
}

export interface UserPrediction {
  userId: number;
  churnProbability: number;
  productivityForecast: number;
  recommendedActions: string[];
}

// ============================================
// STATISTIQUES
// ============================================

export interface UserStats {
  total: number;
  activeCount: number;
  inactiveCount: number;
  suspendedCount: number;
  byRole: {
    role: string;
    count: number;
  }[];
  recentActivations: number;
  recentLogins: number;
}

// ============================================
// FILTRES & PAGINATION
// ============================================

export interface UserFilters {
  role?: User['role'];
  status?: User['status'];
  search?: string;
  department?: string;
  minActivity?: number;
}

// ============================================
// ACTIVITÉS
// ============================================

export interface UserActivity {
  id: number;
  userId: number;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

// ============================================
// CONSTANTES & UTILITAIRES
// ============================================

export const USER_ROLES = {
  ADMIN: { label: 'Administrateur', color: 'bg-purple-100 text-purple-700', icon: '👑' },
  BROKER: { label: 'Courtier', color: 'bg-blue-100 text-blue-700', icon: '🤝' },
  USER: { label: 'Utilisateur', color: 'bg-gray-100 text-gray-700', icon: '👤' },
} as const;

export const USER_STATUS = {
  ACTIVE: { label: 'Actif', color: 'bg-green-100 text-green-700', icon: '✅' },
  INACTIVE: { label: 'Inactif', color: 'bg-gray-100 text-gray-700', icon: '⭕' },
  SUSPENDED: { label: 'Suspendu', color: 'bg-red-100 text-red-700', icon: '⚠️' },
} as const;

// ============================================
// HELPERS SÉCURISÉS POUR RÔLES
// ============================================

export const getRoleLabel = (role: string): string => {
  const validRole = role as keyof typeof USER_ROLES;
  return USER_ROLES[validRole]?.label || role;
};

export const getRoleColor = (role: string): string => {
  const validRole = role as keyof typeof USER_ROLES;
  return USER_ROLES[validRole]?.color || 'bg-gray-100 text-gray-700';
};

export const getRoleIcon = (role: string): string => {
  const validRole = role as keyof typeof USER_ROLES;
  return USER_ROLES[validRole]?.icon || '👤';
};

// ============================================
// HELPERS SÉCURISÉS POUR STATUTS
// ============================================

export const getStatusLabel = (status: string): string => {
  const validStatus = status as keyof typeof USER_STATUS;
  return USER_STATUS[validStatus]?.label || status;
};

export const getStatusColor = (status: string): string => {
  const validStatus = status as keyof typeof USER_STATUS;
  return USER_STATUS[validStatus]?.color || 'bg-gray-100 text-gray-700';
};

export const getStatusIcon = (status: string): string => {
  const validStatus = status as keyof typeof USER_STATUS;
  return USER_STATUS[validStatus]?.icon || '❓';
};

// ============================================
// HELPERS DE FORMATAGE
// ============================================

export const formatDate = (date: string): string => {
  if (!date) return 'Non définie';
  return new Date(date).toLocaleDateString('fr-FR');
};

export const formatDateTime = (date: string): string => {
  if (!date) return 'Non définie';
  return new Date(date).toLocaleString('fr-FR');
};

export const formatTimeAgo = (date: string): string => {
  if (!date) return 'Jamais';
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return `il y a ${seconds} secondes`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  return formatDate(date);
};

// ============================================
// HELPERS DE VALIDATION
// ============================================

export const isValidRole = (role: string): role is keyof typeof USER_ROLES => {
  return Object.keys(USER_ROLES).includes(role);
};

export const isValidStatus = (status: string): status is keyof typeof USER_STATUS => {
  return Object.keys(USER_STATUS).includes(status);
};

// ============================================
// TYPES POUR LES RÉPONSES API
// ============================================

export interface UsersApiResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserApiResponse {
  data: User;
}

export interface UserStatsApiResponse {
  data: UserStats;
}

export interface UserActivityApiResponse {
  data: UserActivity[];
}

export interface UserActivityAnalysisApiResponse {
  data: UserActivityAnalysis;
}

export interface UserPerformanceMetricsApiResponse {
  data: UserPerformanceMetrics;
}

export interface UserPredictionApiResponse {
  data: UserPrediction;
}