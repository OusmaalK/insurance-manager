// src/modules/api/auth/auth.api.ts
// Version corrigée - Gère correctement la réponse du backend

import { apiClient } from '../client/client';
import { 
  LoginCredentials, 
  LoginResponse, 
  RegisterData, 
  User, 
  ChangePasswordData 
} from '@/types/user.types';

const BASE_URL = '/auth';

export const authApi = {
  // Connexion
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<LoginResponse>(`${BASE_URL}/login`, credentials);
    
    // La réponse du backend a la structure: { success: true, data: { access_token, user } }
    if (response && typeof response === 'object') {
      const responseAny = response as any;
      
      // Structure standard: { success: true, data: { access_token, user } }
      if (responseAny.success === true && responseAny.data) {
        const token = responseAny.data.access_token;
        if (token) {
          apiClient.setToken(token);
        }
        return responseAny;
      }
      
      // Structure alternative: { access_token, user }
      if (responseAny.access_token) {
        apiClient.setToken(responseAny.access_token);
        return { success: true, data: responseAny };
      }
    }
    
    return response;
  },

  async register(data: RegisterData) {
    return apiClient.post<User>(`${BASE_URL}/register`, data);
  },

  async logout() {
    apiClient.setToken(null);
    try {
      await apiClient.post(`${BASE_URL}/logout`);
    } catch (error) {
      // Ignorer
    }
  },

  async getCurrentUser() {
    const response = await apiClient.get<User>(`${BASE_URL}/me`);
    
    // La réponse a la structure: { success: true, data: user }
    if (response && typeof response === 'object') {
      const responseAny = response as any;
      if (responseAny.success === true && responseAny.data) {
        return responseAny.data;
      }
      return responseAny;
    }
    
    return response;
  },

  async updateProfile(data: Partial<User>) {
    return apiClient.put<User>(`${BASE_URL}/profile`, data);
  },

  async changePassword(data: ChangePasswordData) {
    return apiClient.post<{ message: string }>(`${BASE_URL}/change-password`, data);
  },

  async forgotPassword(email: string) {
    return apiClient.post<{ message: string }>(`${BASE_URL}/forgot-password`, { email });
  },

  async resetPassword(token: string, newPassword: string) {
    return apiClient.post<{ message: string }>(`${BASE_URL}/reset-password`, { 
      token, 
      new_password: newPassword 
    });
  },

  async refreshToken() {
    const response = await apiClient.post<{ access_token: string }>(`${BASE_URL}/refresh`);
    
    if (response && typeof response === 'object') {
      const responseAny = response as any;
      if (responseAny.success === true && responseAny.data?.access_token) {
        apiClient.setToken(responseAny.data.access_token);
        return responseAny;
      }
      if (responseAny.access_token) {
        apiClient.setToken(responseAny.access_token);
        return { success: true, data: responseAny };
      }
    }
    
    return response;
  },
};

export default authApi;