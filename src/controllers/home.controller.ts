import { Request, Response, NextFunction } from 'express';
import { HomeService } from '../services/home.service';

export class HomeController {
  static async createHome(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const home = await HomeService.createHome(userId, req.body);
      res.status(201).json({ success: true, message: 'Home created successfully', data: home });
    } catch (error) {
      next(error);
    }
  }

  static async getUserHomes(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const homes = await HomeService.getUserHomes(userId);
      res.status(200).json({ success: true, message: 'Homes retrieved', data: homes });
    } catch (error) {
      next(error);
    }
  }

  static async getHomeById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const homeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const home = await HomeService.getHomeById(homeId, userId);
      res.status(200).json({ success: true, message: 'Home retrieved', data: home });
    } catch (error) {
      next(error);
    }
  }

  static async updateHome(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const homeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const home = await HomeService.updateHome(homeId, userId, req.body);
      res.status(200).json({ success: true, message: 'Home updated', data: home });
    } catch (error) {
      next(error);
    }
  }

  static async deleteHome(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const homeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await HomeService.deleteHome(homeId, userId);
      res.status(200).json({ success: true, message: 'Home deleted', data: null });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const dashboard = await HomeService.getDashboard(homeId);
      res.status(200).json({ success: true, message: 'Dashboard retrieved', data: dashboard });
    } catch (error) {
      next(error);
    }
  }

  static async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const pagination = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        skip: ((parseInt(req.query.page as string) || 1) - 1) * (parseInt(req.query.limit as string) || 10),
      };
      const timeline = await HomeService.getTimeline(homeId, pagination);
      res.status(200).json({ success: true, message: 'Timeline retrieved', data: timeline });
    } catch (error) {
      next(error);
    }
  }
}
