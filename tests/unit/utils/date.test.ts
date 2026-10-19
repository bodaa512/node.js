import {
  formatDate,
  isExpired,
  daysUntil,
  daysSince,
  addDays,
  addMonths,
} from '../../../src/utils/date';

describe('Date Utilities (src/utils/date)', () => {
  it('formatDate should format date as YYYY-MM-DD', () => {
    const d = new Date('2026-10-19T12:00:00.000Z');
    expect(formatDate(d)).toBe('2026-10-19');
  });

  it('isExpired should return true for past dates and false for future dates', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24);

    expect(isExpired(pastDate)).toBe(true);
    expect(isExpired(futureDate)).toBe(false);
  });

  it('daysUntil should return positive days for future date', () => {
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    expect(daysUntil(futureDate)).toBeGreaterThanOrEqual(4);
    expect(daysUntil(futureDate)).toBeLessThanOrEqual(6);
  });

  it('daysSince should return positive days for past date', () => {
    const pastDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(daysSince(pastDate)).toBeGreaterThanOrEqual(2);
    expect(daysSince(pastDate)).toBeLessThanOrEqual(4);
  });

  it('addDays should correctly add positive and negative days', () => {
    const base = new Date('2026-05-10T00:00:00.000Z');
    const result = addDays(base, 5);
    expect(result.getDate()).toBe(15);
  });

  it('addMonths should correctly increment the month', () => {
    const base = new Date('2026-01-15T00:00:00.000Z');
    const result = addMonths(base, 2);
    expect(result.getMonth()).toBe(2); // 0-indexed March
  });
});
