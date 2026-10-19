import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  static async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await PaymentService.getPlans();
      res.status(200).json({ success: true, message: 'Plans retrieved', data: plans });
    } catch (error) {
      next(error);
    }
  }

  static async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const { planSlug } = req.body;
      const session = await PaymentService.createCheckoutSession(userId, planSlug);
      res.status(200).json({ success: true, message: 'Checkout session created', data: session });
    } catch (error) {
      next(error);
    }
  }

  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PaymentService.handleWebhook(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getUserPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const payments = await PaymentService.getUserPayments(userId);
      res.status(200).json({ success: true, message: 'Payment history retrieved', data: payments });
    } catch (error) {
      next(error);
    }
  }
}
