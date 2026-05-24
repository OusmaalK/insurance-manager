// src/types/ai-assistant.types.ts
// Types pour l'Assistant IA
// <55 lignes

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    metadata?: ChatMetadata;
  }
  
  export interface ChatMetadata {
    confidence?: number;
    suggestions?: string[];
    actions?: QuickAction[];
    tokens_used?: number;
  }
  
  export interface QuickAction {
    type: 'CREATE_REPORT' | 'ANALYZE_RISK' | 'SCHEDULE_MEETING' | 'SEND_EMAIL' | 'ANALYZE_CLAIM' | 'PREDICT_RENEWAL';
    label: string;
    params: Record<string, any>;
  }
  
  export interface ChatRequest {
    message: string;
    context?: ChatContext;
    history?: ChatMessage[];
  }
  
  export interface ChatContext {
    company_id?: number;
    policy_id?: number;
    claim_id?: number;
    user_id?: number;
  }
  
  export interface ChatResponse {
    message: string;
    suggestions?: string[];
    actions?: QuickAction[];
    confidence: number;
    tokens_used?: number;
  }
  
  export interface SearchRequest {
    query: string;
    type?: 'companies' | 'policies' | 'claims' | 'all';
    limit?: number;
    filters?: Record<string, any>;
  }
  
  export interface SearchResult {
    id: number;
    type: string;
    title: string;
    description: string;
    url: string;
    score: number;
    metadata?: Record<string, any>;
  }
  
  export interface ReportGenerationRequest {
    type: 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
    format?: 'pdf' | 'excel' | 'json';
    company_id?: number;
    send_email?: boolean;
    recipients?: string[];
  }
  
  export interface ConversationHistory {
    id: string;
    user_id: number;
    messages: ChatMessage[];
    created_at: string;
    updated_at: string;
    is_active: boolean;
  }