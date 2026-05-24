// src/modules/api/client/client.ts
// Version avec URL forcée

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';

// ============================================
// TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

// ============================================
// CONFIGURATION - URL FORCÉE
// ============================================

// ✅ FORCER L'URL DU BACKEND (port 3001)
const API_BASE_URL = 'http://localhost:3001/api';

// ============================================
// CLASSE PRINCIPALE
// ============================================

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.setupInterceptors();
  }

  // Récupération token depuis localStorage
  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
    }
  }

  // Sauvegarde token
  setToken(token: string | null): void {
    this.accessToken = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  // Intercepteurs
  private setupInterceptors(): void {
    // Request: ajout token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.loadToken();
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(this.normalizeError(error))
    );

    // Response: gestion erreurs
    this.client.interceptors.response.use(
      (response) => {
        if (response.config.responseType === 'blob') {
          return response.data;
        }
        return response.data;
      },
      (error: AxiosError) => Promise.reject(this.normalizeError(error))
    );
  }

  // Normalisation des erreurs
  private normalizeError(error: AxiosError): ApiError {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      
      if (status === 401) {
        this.setToken(null);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
      }
      
      return {
        status,
        message: data?.message || data?.error || error.message,
        code: data?.code,
      };
    }
    
    if (error.request) {
      return { status: 0, message: 'No response from server' };
    }
    
    return { status: 0, message: error.message };
  }

  // ============================================
  // MÉTHODES HTTP
  // ============================================

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response as T;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response as T;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response as T;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response as T;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response as T;
  }

  async upload<T = any>(url: string, file: File, fieldName: string = 'file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    const response = await this.client.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response as T;
  }

  // ============================================
  // MÉTHODES AVEC FORMAT API RESPONSE
  // ============================================

  async getApi<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async postApi<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async putApi<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patchApi<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async deleteApi<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;