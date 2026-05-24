// src/shared/utils/api.ts
// Utilitaires pour les appels API - Version corrigée
// <90 lignes

import { apiClient } from '@/modules/api/client/client';

// ============================================
// TYPES
// ============================================

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || error.response.data?.error || 'Erreur serveur',
      code: error.response.data?.code
    };
  }
  if (error.request) {
    return {
      status: 0,
      message: 'Impossible de contacter le serveur'
    };
  }
  return {
    status: 0,
    message: error.message || 'Une erreur est survenue'
  };
};

export const isSuccess = <T>(response: ApiResponse<T>): response is { success: true; data: T } => {
  return response.success === true && 'data' in response;
};

export const hasError = (response: ApiResponse<any>): response is { success: false; error: string } => {
  return response.success === false && 'error' in response;
};

export const getErrorMessage = (response: ApiResponse<any>): string => {
  if (hasError(response)) {
    return response.error;
  }
  return 'Une erreur est survenue';
};

export const extractData = <T>(response: ApiResponse<T>): T | null => {
  if (isSuccess(response)) {
    return response.data;
  }
  return null;
};

// ============================================
// REQUÊTES SIMPLIFIÉES (Corrigées)
// ============================================

// ✅ Correction : get retourne directement le type T (pas ApiResponse<T>)
export const get = async <T>(url: string, params?: Record<string, any>): Promise<T> => {
  const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient.get<T>(url + queryString);
};

// ✅ Correction : post retourne directement le type T
export const post = async <T>(url: string, data?: any): Promise<T> => {
  return apiClient.post<T>(url, data);
};

// ✅ Correction : put retourne directement le type T
export const put = async <T>(url: string, data?: any): Promise<T> => {
  return apiClient.put<T>(url, data);
};

// ✅ Correction : patch retourne directement le type T
export const patch = async <T>(url: string, data?: any): Promise<T> => {
  return apiClient.patch<T>(url, data);
};

// ✅ Correction : del retourne directement le type T
export const del = async <T>(url: string): Promise<T> => {
  return apiClient.delete<T>(url);
};

// ✅ Correction : upload retourne directement le type T
export const upload = async <T>(url: string, file: File, fieldName: string = 'file'): Promise<T> => {
  return apiClient.upload<T>(url, file, fieldName);
};

// ============================================
// VERSIONS AVEC ApiResponse (si nécessaire)
// ============================================

// Version avec retour ApiResponse pour compatibilité
export const getApi = async <T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
  try {
    const data = await get<T>(url, params);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Une erreur est survenue' };
  }
};

export const postApi = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    const result = await post<T>(url, data);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Une erreur est survenue' };
  }
};

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  upload,
  getApi,
  postApi,
  handleApiError,
  isSuccess,
  hasError,
  getErrorMessage,
  extractData
};