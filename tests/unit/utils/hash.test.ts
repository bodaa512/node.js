import { hashPassword, comparePassword } from '../../../src/utils/hash';

describe('Hash Utilities (src/utils/hash)', () => {
  it('hashPassword should generate a valid bcrypt hash', async () => {
    const password = 'SecretPassword123!';
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.startsWith('$2')).toBe(true);
  });

  it('comparePassword should return true for correct password', async () => {
    const password = 'MySecurePassword!';
    const hash = await hashPassword(password);
    const isValid = await comparePassword(password, hash);

    expect(isValid).toBe(true);
  });

  it('comparePassword should return false for incorrect password', async () => {
    const password = 'MySecurePassword!';
    const hash = await hashPassword(password);
    const isValid = await comparePassword('WrongPassword', hash);

    expect(isValid).toBe(false);
  });
});
