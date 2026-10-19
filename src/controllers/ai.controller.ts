import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';
import { HomeHealthService } from '../services/homeHealth.service';
import { HomeMemoryService } from '../services/homeMemory.service';

export class AIController {
  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const { homeId, conversationId, message } = req.body;

      if (!homeId || !message) {
        return res.status(400).json({ success: false, message: 'Home ID and message are required' });
      }

      const result = await AIService.sendMessage(userId, homeId, conversationId, message);
      res.status(200).json({ success: true, message: 'Response generated', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getHealthScore(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const health = await HomeHealthService.calculateHealthScore(homeId);
      res.status(200).json({ success: true, message: 'Home Health Score calculated', data: health });
    } catch (error) {
      next(error);
    }
  }

  static async getHomeMemory(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const memories = await HomeMemoryService.getHomeMemories(homeId);
      res.status(200).json({ success: true, message: 'Home Memories retrieved', data: memories });
    } catch (error) {
      next(error);
    }
  }

  static async getWeeklyReport(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const report = await AIService.getWeeklyReport(homeId);
      res.status(200).json({ success: true, message: 'Weekly report generated', data: report });
    } catch (error) {
      next(error);
    }
  }
}
