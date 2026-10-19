import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service';

export class SearchController {
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const q = (req.query.q as string) || '';
      const homeId = (req.query.homeId as string) || req.homeAccess?.homeId || '';
      const results = await SearchService.globalSearch(homeId, q);
      res.status(200).json({ success: true, message: 'Search completed', data: results });
    } catch (error) {
      next(error);
    }
  }
}
