// src/shared/utils/formatCurrency.ts
// Formatage de la monnaie
// <50 lignes

// ============================================
// CONFIGURATION
// ============================================

const DEFAULT_CURRENCY = 'EUR';
const DEFAULT_LOCALE = 'fr-FR';

// ============================================
// FONCTIONS PRINCIPALES
// ============================================

export const formatCurrency = (
  amount: number | null | undefined,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE
): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 €';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatCurrencySimple = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 €';
  }
  return `${amount.toLocaleString('fr-FR')} €`;
};

export const formatCurrencyWithoutSymbol = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  return amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return value.toLocaleString('fr-FR');
};

export const formatCompactCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 €';
  }

  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)} M€`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)} k€`;
  }
  return `${amount} €`;
};

export default {
  formatCurrency,
  formatCurrencySimple,
  formatCurrencyWithoutSymbol,
  formatPercentage,
  formatNumber,
  formatCompactCurrency
};