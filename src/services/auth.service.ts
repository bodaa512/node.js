import { User, IUser } from '../models/User';
import { AuthenticationError, NotFoundError, ValidationError, AuthorizationError } from '../errors';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { generateRandomToken } from '../utils/helpers';
import { EmailService } from './email.service';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: any): Promise<IUser> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ValidationError('Email already in use');
    }

    const verificationToken = generateRandomToken(32);
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      ...data,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    await EmailService.sendVerificationEmail(user, verificationToken);

    return user;
  }

  /**
   * Login user and generate tokens
   */
  static async login(email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AuthenticationError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is disabled');
    }

    const accessToken = generateAccessToken({ userId: user._id.toString(), email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    user.refreshTokens.push(refreshToken);
    user.lastLogin = new Date();
    await user.save();

    return { user, accessToken, refreshToken };
  }

  /**
   * Logout user by removing the specific refresh token
   */
  static async logout(userId: string, refreshToken: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.refreshTokens = user.refreshTokens.filter((token: string) => token !== refreshToken);
    await user.save();
  }

  /**
   * Refresh access token
   */
  static async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = verifyRefreshToken(token) as { userId: string };
      const user = await User.findById(payload.userId);

      if (!user || !user.refreshTokens.includes(token)) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Rotate refresh token
      const newAccessToken = generateAccessToken({ userId: user._id.toString(), email: user.email, role: user.role });
      const newRefreshToken = generateRefreshToken({ userId: user._id.toString() });

      user.refreshTokens = user.refreshTokens.filter((t: string) => t !== token);
      user.refreshTokens.push(newRefreshToken);
      await user.save();

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  /**
   * Verify email
   */
  static async verifyEmail(token: string): Promise<void> {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new ValidationError('Invalid or expired verification token');
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    await EmailService.sendWelcomeEmail(user);
  }

  /**
   * Forgot password request
   */
  static async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) return; // Silent return for security

    const resetToken = generateRandomToken(32);
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    await EmailService.sendPasswordResetEmail(user, resetToken);
  }

  /**
   * Reset password
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new ValidationError('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }

  /**
   * Change password (authenticated)
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AuthenticationError('Incorrect current password');
    }

    user.password = newPassword;
    await user.save();
  }

  /**
   * Get user profile
   */
  static async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, data: any): Promise<IUser> {
    const user = await User.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
