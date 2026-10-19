export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isExpired = (date: Date): boolean => {
  return new Date() > date;
};

export const daysUntil = (date: Date): number => {
  const diffTime = date.getTime() - new Date().getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const daysSince = (date: Date): number => {
  const diffTime = new Date().getTime() - date.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};
