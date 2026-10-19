import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../../src/utils/token';

describe('Token Utilities (src/utils/token)', () => {
  const mockPayload = {
    userId: '65f1234567890abcdef12345',
    email: 'user@example.com',
    role: 'home_owner' as any,
  };

  it('generateAccessToken and verifyAccessToken should encode and decode payload', () => {
    const token = generateAccessToken(mockPayload);
    expect(typeof token).toBe('string');

    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(mockPayload.userId);
    expect(decoded.email).toBe(mockPayload.email);
    expect(decoded.role).toBe(mockPayload.role);
  });

  it('generateRefreshToken and verifyRefreshToken should encode and decode userId', () => {
    const refreshToken = generateRefreshToken({ userId: mockPayload.userId });
    expect(typeof refreshToken).toBe('string');

    const decoded = verifyRefreshToken(refreshToken);
    expect(decoded.userId).toBe(mockPayload.userId);
  });

  it('verifyAccessToken should throw on invalid token string', () => {
    expect(() => {
      verifyAccessToken('invalid.token.string');
    }).toThrow();
  });
});
