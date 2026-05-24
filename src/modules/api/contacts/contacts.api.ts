// src/modules/api/contacts/contacts.api.ts
// API Client pour le module Contacts
// <70 lignes

import { apiClient } from '../client/client';

// ============================================
// TYPES
// ============================================

export interface Contact {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  company_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position?: string;
  is_primary?: boolean;
}

// ============================================
// ENDPOINTS
// ============================================

const BASE_URL = '/contacts';

export const contactsApi = {
  // Liste des contacts
  async getAll(params?: { company_id?: number; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.company_id) searchParams.append('company_id', params.company_id.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    return apiClient.get<{ data: Contact[]; total: number }>(url);
  },

  // Récupérer un contact par ID
  async getById(id: number) {
    return apiClient.get<Contact>(`${BASE_URL}/${id}`);
  },

  // Contacts par entreprise
  async getByCompanyId(companyId: number) {
    return apiClient.get<Contact[]>(`${BASE_URL}/company/${companyId}`);
  },

  // Créer un contact
  async create(data: ContactFormData) {
    return apiClient.post<Contact>(BASE_URL, data);
  },

  // Mettre à jour un contact
  async update(id: number, data: Partial<ContactFormData>) {
    return apiClient.put<Contact>(`${BASE_URL}/${id}`, data);
  },

  // Supprimer un contact
  async delete(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
};

export default contactsApi;