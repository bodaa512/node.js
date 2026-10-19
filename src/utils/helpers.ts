import crypto from 'crypto';

export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\\s_]+/g, '-')     // Replace spaces and underscores with -
    .replace(/[^\\w\\-]+/g, '')    // Remove all non-word chars
    .replace(/\\-\\-+/g, '-');     // Replace multiple - with single -
};

export const generateRandomToken = (bytes: number = 32): string => {
  return crypto.randomBytes(bytes).toString('hex');
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/<[^>]*>?/gm, ''); // Simple HTML tag removal
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
