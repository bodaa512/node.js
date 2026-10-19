import { IUser } from '../models/User';
import { env } from '../config/env';
// Note: Normally you would import nodemailer here.
// import * as nodemailer from 'nodemailer';

export class EmailService {
  // private static transporter = nodemailer.createTransport({ ... });

  /**
   * Log email details to console since actual sending is mocked
   */
  private static mockSend(subject: string, to: string, body: string) {
    console.log(`\n--- MOCK EMAIL ---`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body snippet: ${body.substring(0, 50)}...`);
    console.log(`------------------\n`);
  }

  static async sendVerificationEmail(user: IUser, token: string): Promise<void> {
    try {
      const url = `${env.CLIENT_URL}/verify-email?token=${token}`;
      const html = `<p>Hi ${user.firstName},</p><p>Please verify your email: <a href="${url}">${url}</a></p>`;
      this.mockSend('Verify your email', user.email, html);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  }

  static async sendPasswordResetEmail(user: IUser, token: string): Promise<void> {
    try {
      const url = `${env.CLIENT_URL}/reset-password?token=${token}`;
      const html = `<p>Hi ${user.firstName},</p><p>Reset your password here: <a href="${url}">${url}</a></p>`;
      this.mockSend('Password Reset', user.email, html);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }

  static async sendWelcomeEmail(user: IUser): Promise<void> {
    try {
      const html = `<p>Welcome to HomePilot, ${user.firstName}!</p><p>Get started by adding your first home.</p>`;
      this.mockSend('Welcome to HomePilot', user.email, html);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  static async sendWarrantyReminder(user: IUser, asset: any, warranty: any): Promise<void> {
    try {
      const html = `<p>Hi ${user.firstName},</p><p>The warranty for your ${asset.name} is expiring soon.</p>`;
      this.mockSend('Warranty Expiration Reminder', user.email, html);
    } catch (error) {
      console.error('Failed to send warranty reminder:', error);
    }
  }

  static async sendMaintenanceReminder(user: IUser, task: any): Promise<void> {
    try {
      const html = `<p>Hi ${user.firstName},</p><p>Reminder for maintenance task: ${task.title}</p>`;
      this.mockSend('Maintenance Reminder', user.email, html);
    } catch (error) {
      console.error('Failed to send maintenance reminder:', error);
    }
  }

  static async sendAppointmentConfirmation(user: IUser, appointment: any): Promise<void> {
    try {
      const html = `<p>Hi ${user.firstName},</p><p>Your appointment is confirmed for ${appointment.date}</p>`;
      this.mockSend('Appointment Confirmation', user.email, html);
    } catch (error) {
      console.error('Failed to send appointment confirmation:', error);
    }
  }

  static async sendWeeklyReport(user: IUser, report: any): Promise<void> {
    try {
      const html = `<p>Hi ${user.firstName},</p><p>Here is your weekly home management report.</p>`;
      this.mockSend('Weekly Report', user.email, html);
    } catch (error) {
      console.error('Failed to send weekly report:', error);
    }
  }
}
