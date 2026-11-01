/**
 * Formatting utilities for SkillForge LMS
 */

export const formatCurrency = (amount: number | null | undefined, currency: string = 'INR'): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Free';
  if (amount === 0) return 'Free';

  const num = Math.round(amount);
  if (currency.toUpperCase() === 'INR') {
    return `₹${num.toLocaleString('en-IN')}`;
  }
  return `$${num.toLocaleString('en-US')}`;
};

export const formatDuration = (hours?: number | null): string => {
  if (!hours || hours <= 0) return 'Self-paced';
  if (hours === 1) return '1 hour';
  return `${hours} hours`;
};

export const formatLessonDuration = (seconds?: number | null): string => {
  if (!seconds || seconds <= 0) return '';
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) return '< 1 min';
  return `${minutes} min`;
};

