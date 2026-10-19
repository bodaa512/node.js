import { Request, Response, NextFunction } from 'express';
import { ExpenseService, SubscriptionService } from '../services/expense.service';

export class ExpenseController {
  static async createExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const userId = req.user?.userId || '';
      const expense = await ExpenseService.createExpense(homeId, userId, req.body);
      res.status(201).json({ success: true, message: 'Expense recorded', data: expense });
    } catch (error) {
      next(error);
    }
  }

  static async getHomeExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const filters = {
        category: req.query.category as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };
      const expenses = await ExpenseService.getHomeExpenses(homeId, filters);
      res.status(200).json({ success: true, message: 'Expenses retrieved', data: expenses });
    } catch (error) {
      next(error);
    }
  }

  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const year = req.query.year ? parseInt(req.query.year as string, 10) : new Date().getFullYear();
      const analytics = await ExpenseService.getExpenseAnalytics(homeId, year);
      res.status(200).json({ success: true, message: 'Analytics calculated', data: analytics });
    } catch (error) {
      next(error);
    }
  }

  static async deleteExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const expenseId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.homeAccess?.homeId || '';
      await ExpenseService.deleteExpense(expenseId, homeId);
      res.status(200).json({ success: true, message: 'Expense deleted', data: null });
    } catch (error) {
      next(error);
    }
  }
}

export class SubscriptionController {
  static async createSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const userId = req.user?.userId || '';
      const subscription = await SubscriptionService.createSubscription(homeId, userId, req.body);
      res.status(201).json({ success: true, message: 'Subscription added', data: subscription });
    } catch (error) {
      next(error);
    }
  }

  static async getHomeSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const subscriptions = await SubscriptionService.getHomeSubscriptions(homeId);
      res.status(200).json({ success: true, message: 'Subscriptions retrieved', data: subscriptions });
    } catch (error) {
      next(error);
    }
  }

  static async getInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const insights = await SubscriptionService.getSubscriptionInsights(homeId);
      res.status(200).json({ success: true, message: 'Subscription insights generated', data: insights });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const subId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.homeAccess?.homeId || '';
      await SubscriptionService.deleteSubscription(subId, homeId);
      res.status(200).json({ success: true, message: 'Subscription deleted', data: null });
    } catch (error) {
      next(error);
    }
  }
}
