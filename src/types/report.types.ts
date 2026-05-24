// src/types/report.types.ts
// Types pour le module Reports
// <250 lignes

// ============================================
// REPORT - Types principaux
// ============================================

export interface Report {
  id: number;
  title: string;
  description: string;
  type: 'STANDARD' | 'AI';
  format: 'PDF' | 'EXCEL' | 'CSV';
  status: 'GENERATING' | 'COMPLETED' | 'FAILED';
  data: any;
  generatedAt: string;
  createdBy: number;
  createdByName?: string;
  schedule?: ReportSchedule;
  metadata?: ReportMetadata;
}

export interface ReportSchedule {
  enabled: boolean;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  lastSent?: string;
  nextSend?: string;
}

export interface ReportMetadata {
  source: string;
  dateRange: {
    start: string;
    end: string;
  };
  filters: Record<string, any>;
  size: number;
}

// ============================================
// RAPPORTS IA
// ============================================

export interface AIReport {
  id: number;
  title: string;
  summary: string;
  insights: AIInsight[];
  recommendations: AIRecommendation[];
  metrics: AIMetrics;
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
}

export interface AIInsight {
  id: number;
  title: string;
  description: string;
  impact: string;
  confidence: number;
  type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  module: 'COMPANIES' | 'POLICIES' | 'CLAIMS' | 'USERS' | 'CALENDAR';
}

export interface AIRecommendation {
  id: number;
  action: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  expectedImpact: string;
  module: string;
}

export interface AIMetrics {
  fraudScore: number;
  riskScore: number;
  renewalRate: number;
  satisfactionScore: number;
  performanceIndex: number;
  trends: {
    label: string;
    value: number;
    change: number;
  }[];
}

// ============================================
// STATISTIQUES
// ============================================

export interface ReportStats {
  total: number;
  standardCount: number;
  aiCount: number;
  scheduledCount: number;
  recentGenerations: number;
  byType: {
    type: string;
    count: number;
  }[];
}

// ============================================
// FORMULAIRE
// ============================================

export interface ReportFormData {
  title: string;
  description: string;
  type: Report['type'];
  format: Report['format'];
  dateRange: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
  schedule?: {
    enabled: boolean;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    time: string;
    recipients: string[];
  };
}

// ============================================
// FILTRES & PAGINATION
// ============================================

export interface ReportFilters {
  type?: Report['type'];
  status?: Report['status'];
  format?: Report['format'];
  startDate?: string;
  endDate?: string;
  search?: string;
  scheduled?: boolean;
}

// ============================================
// CONSTANTES
// ============================================

export const REPORT_TYPES = {
  STANDARD: { label: 'Standard', color: 'bg-blue-100 text-blue-700', icon: '📄' },
  AI: { label: 'IA Intelligente', color: 'bg-purple-100 text-purple-700', icon: '🧠' },
} as const;

export const REPORT_STATUS = {
  GENERATING: { label: 'Génération...', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  COMPLETED: { label: 'Complété', color: 'bg-green-100 text-green-700', icon: '✅' },
  FAILED: { label: 'Échoué', color: 'bg-red-100 text-red-700', icon: '❌' },
} as const;

export const REPORT_FORMATS = {
  PDF: { label: 'PDF', color: 'bg-red-100 text-red-700', icon: '📕' },
  EXCEL: { label: 'Excel', color: 'bg-green-100 text-green-700', icon: '📗' },
  CSV: { label: 'CSV', color: 'bg-blue-100 text-blue-700', icon: '📘' },
} as const;

// ============================================
// HELPERS SÉCURISÉS POUR LES TYPES
// ============================================

// Helper pour obtenir un type valide (avec fallback)
export const getSafeReportType = (type: string | undefined): 'STANDARD' | 'AI' => {
  if (type === 'AI') return 'AI';
  return 'STANDARD';
};

// Helper pour obtenir un statut valide (avec fallback)
export const getSafeReportStatus = (status: string | undefined): 'GENERATING' | 'COMPLETED' | 'FAILED' => {
  if (status === 'COMPLETED') return 'COMPLETED';
  if (status === 'FAILED') return 'FAILED';
  return 'GENERATING';
};

// Helper pour obtenir un format valide (avec fallback)
export const getSafeReportFormat = (format: string | undefined): 'PDF' | 'EXCEL' | 'CSV' => {
  if (format === 'EXCEL') return 'EXCEL';
  if (format === 'CSV') return 'CSV';
  return 'PDF';
};

// ============================================
// HELPERS POUR LES AFFICHAGES
// ============================================

export const getReportTypeLabel = (type: string): string => {
  const safeType = getSafeReportType(type);
  return REPORT_TYPES[safeType]?.label || type;
};

export const getReportTypeColor = (type: string): string => {
  const safeType = getSafeReportType(type);
  return REPORT_TYPES[safeType]?.color || 'bg-gray-100 text-gray-700';
};

export const getReportTypeIcon = (type: string): string => {
  const safeType = getSafeReportType(type);
  return REPORT_TYPES[safeType]?.icon || '📄';
};

export const getReportStatusLabel = (status: string): string => {
  const safeStatus = getSafeReportStatus(status);
  return REPORT_STATUS[safeStatus]?.label || status;
};

export const getReportStatusColor = (status: string): string => {
  const safeStatus = getSafeReportStatus(status);
  return REPORT_STATUS[safeStatus]?.color || 'bg-gray-100 text-gray-700';
};

export const getReportStatusIcon = (status: string): string => {
  const safeStatus = getSafeReportStatus(status);
  return REPORT_STATUS[safeStatus]?.icon || '⏳';
};

export const getReportFormatLabel = (format: string): string => {
  const safeFormat = getSafeReportFormat(format);
  return REPORT_FORMATS[safeFormat]?.label || format;
};

export const getReportFormatColor = (format: string): string => {
  const safeFormat = getSafeReportFormat(format);
  return REPORT_FORMATS[safeFormat]?.color || 'bg-gray-100 text-gray-700';
};

export const getReportFormatIcon = (format: string): string => {
  const safeFormat = getSafeReportFormat(format);
  return REPORT_FORMATS[safeFormat]?.icon || '📄';
};

// ============================================
// HELPERS DE VALIDATION
// ============================================

export const isValidReportType = (type: string): type is keyof typeof REPORT_TYPES => {
  return Object.keys(REPORT_TYPES).includes(type);
};

export const isValidReportStatus = (status: string): status is keyof typeof REPORT_STATUS => {
  return Object.keys(REPORT_STATUS).includes(status);
};

export const isValidReportFormat = (format: string): format is keyof typeof REPORT_FORMATS => {
  return Object.keys(REPORT_FORMATS).includes(format);
};

// ============================================
// HELPERS DE FORMATAGE
// ============================================

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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
// TYPES POUR LES RÉPONSES API
// ============================================

export interface ReportsApiResponse {
  data: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportApiResponse {
  data: Report;
}

export interface ReportStatsApiResponse {
  data: ReportStats;
}

export interface AIReportApiResponse {
  data: AIReport;
}

// ============================================
// TYPES POUR LES ACTIONS API
// ============================================

export interface CreateReportParams {
  title: string;
  description?: string;
  type: Report['type'];
  format: Report['format'];
  dateRange: {
    start: string;
    end: string;
  };
  schedule?: ReportSchedule;
}

export interface UpdateReportParams {
  title?: string;
  description?: string;
  schedule?: ReportSchedule;
}

export interface DeleteReportResponse {
  success: boolean;
  message: string;
}

// ============================================
// TYPES POUR LES FILTRES AVANCÉS
// ============================================

export interface AdvancedReportFilters extends ReportFilters {
  sortBy?: 'title' | 'generatedAt' | 'type' | 'status';
  sortOrder?: 'asc' | 'desc';
  createdBy?: number;
  dateFrom?: string;
  dateTo?: string;
}