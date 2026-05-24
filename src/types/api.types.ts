// src/types/api.types.ts
// Types génériques pour les réponses API backend
// <80 lignes

// ============================================
// RÉPONSE STANDARD BACKEND
// ============================================

export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
    timestamp?: string;
  }
  
  export interface ApiErrorResponse {
    success: false;
    error: string;
    code?: string;
    timestamp?: string;
  }
  
  export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
  
  // ============================================
  // PAGINATION
  // ============================================
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }
  
  // ============================================
  // FILTRES
  // ============================================
  
  export interface DateRangeFilter {
    startDate: string;
    endDate: string;
  }
  
  export interface SearchFilter {
    search?: string;
    status?: string;
    dateRange?: DateRangeFilter;
  }
  
  // ============================================
  // ÉNUMÉRATIONS (basées sur backend)
  // ============================================
  
  export enum CompanyStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
  }
  
  export enum PolicyStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING',
  }
  
  export enum ClaimStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    IN_REVIEW = 'IN_REVIEW',
  }
  
  export enum CalendarEventType {
    RENEWAL = 'RENEWAL',
    CLAIM = 'CLAIM',
    MEETING = 'MEETING',
    TASK = 'TASK',
    OTHER = 'OTHER',
  }
  
  export enum UserRole {
    ADMIN = 'ADMIN',
    BROKER = 'BROKER',
    USER = 'USER',
  }
  
  // ============================================
  // MÉTRIQUES IA
  // ============================================
  
  export interface IAMetrics {
    fraud_score: number;
    risk_score: number;
    confidence: number;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    analyzed_at: string;
  }