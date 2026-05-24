// src/shared/utils/formatDate.ts
// Formatage des dates
// <65 lignes

// ============================================
// CONFIGURATION
// ============================================

const DEFAULT_LOCALE = 'fr-FR';

// ============================================
// FONCTIONS PRINCIPALES
// ============================================

export const formatDate = (
  date: string | Date | null | undefined,
  locale: string = DEFAULT_LOCALE
): string => {
  if (!date) return '-';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  
  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (
  date: string | Date | null | undefined,
  locale: string = DEFAULT_LOCALE
): string => {
  if (!date) return '-';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  
  return d.toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (
  date: string | Date | null | undefined,
  locale: string = DEFAULT_LOCALE
): string => {
  if (!date) return '-';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'à l\'instant';
  if (diffMins < 60) return `il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  
  return formatDate(date);
};

export const formatDateShort = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  
  return d.toLocaleDateString(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'short'
  });
};

export const getDaysLeft = (date: string | Date | null | undefined): number => {
  if (!date) return 0;
  
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  
  const diffTime = d.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isExpired = (date: string | Date | null | undefined): boolean => {
  return getDaysLeft(date) < 0;
};

export const isExpiringSoon = (date: string | Date | null | undefined, daysThreshold: number = 30): boolean => {
  const daysLeft = getDaysLeft(date);
  return daysLeft >= 0 && daysLeft <= daysThreshold;
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatDateShort,
  getDaysLeft,
  isExpired,
  isExpiringSoon
};