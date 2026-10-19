import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { VerificationStatus } from '../types/enums';

export class AdminController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await AdminService.getDashboardMetrics();
      res.status(200).json({ success: true, message: 'Admin dashboard metrics retrieved', data: metrics });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const result = await AdminService.getUsers(page, limit);
      res.status(200).json({ success: true, message: 'Users retrieved', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async verifyProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const providerId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { status } = req.body;
      const provider = await AdminService.verifyProvider(providerId, status as VerificationStatus);
      res.status(200).json({ success: true, message: 'Provider status updated', data: provider });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const logs = await AdminService.getAuditLogs(page, limit);
      res.status(200).json({ success: true, message: 'Audit logs retrieved', data: logs });
    } catch (error) {
      next(error);
    }
  }
}
