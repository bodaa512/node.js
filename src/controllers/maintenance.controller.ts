import { Request, Response, NextFunction } from 'express';
import { MaintenanceService, WarrantyService } from '../services/maintenance.service';
import { MaintenanceStatus } from '../types/enums';

export class MaintenanceController {
  static async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const userId = req.user?.userId || '';
      const task = await MaintenanceService.createTask(homeId, userId, req.body);
      res.status(201).json({ success: true, message: 'Maintenance task created', data: task });
    } catch (error) {
      next(error);
    }
  }

  static async getHomeTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const filters = {
        status: req.query.status as string,
        assetId: req.query.assetId as string,
        priority: req.query.priority as string,
      };
      const tasks = await MaintenanceService.getHomeTasks(homeId, filters);
      res.status(200).json({ success: true, message: 'Tasks retrieved', data: tasks });
    } catch (error) {
      next(error);
    }
  }

  static async updateTaskStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.homeAccess?.homeId || '';
      const userId = req.user?.userId || '';
      const { status, actualCost, notes } = req.body;

      const task = await MaintenanceService.updateTaskStatus(taskId, homeId, userId, status as MaintenanceStatus, actualCost, notes);
      res.status(200).json({ success: true, message: 'Task status updated', data: task });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.homeAccess?.homeId || '';
      await MaintenanceService.deleteTask(taskId, homeId);
      res.status(200).json({ success: true, message: 'Task deleted', data: null });
    } catch (error) {
      next(error);
    }
  }

  static async getWarrantySummary(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const summary = await WarrantyService.getWarrantySummary(homeId);
      res.status(200).json({ success: true, message: 'Warranty summary retrieved', data: summary });
    } catch (error) {
      next(error);
    }
  }
}
