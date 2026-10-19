import { Request, Response, NextFunction } from 'express';
import { AssetService, RepairReplaceService } from '../services/asset.service';

export class AssetController {
  static async createAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const asset = await AssetService.createAsset(homeId, req.body);
      res.status(201).json({ success: true, message: 'Asset created successfully', data: asset });
    } catch (error) {
      next(error);
    }
  }

  static async getHomeAssets(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const filters = {
        room: req.query.room as string,
        category: req.query.category as string,
        condition: req.query.condition as string,
      };
      const assets = await AssetService.getHomeAssets(homeId, filters);
      res.status(200).json({ success: true, message: 'Assets retrieved', data: assets });
    } catch (error) {
      next(error);
    }
  }

  static async getAssetById(req: Request, res: Response, next: NextFunction) {
    try {
      const assetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.homeAccess?.homeId || '';
      const asset = await AssetService.getAssetById(assetId, homeId);
      res.status(200).json({ success: true, message: 'Asset retrieved', data: asset });
    } catch (error) {
      next(error);
    }
  }

  static async updateAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const assetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.homeAccess?.homeId || '';
      const asset = await AssetService.updateAsset(assetId, homeId, req.body);
      res.status(200).json({ success: true, message: 'Asset updated', data: asset });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const assetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.homeAccess?.homeId || '';
      await AssetService.deleteAsset(assetId, homeId);
      res.status(200).json({ success: true, message: 'Asset deleted', data: null });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await AssetService.getAssetCategories();
      res.status(200).json({ success: true, message: 'Categories retrieved', data: categories });
    } catch (error) {
      next(error);
    }
  }

  static async calculateRepairReplace(req: Request, res: Response, next: NextFunction) {
    try {
      const recommendation = RepairReplaceService.calculateRecommendation(req.body);
      res.status(200).json({ success: true, message: 'Repair vs Replace analysis completed', data: recommendation });
    } catch (error) {
      next(error);
    }
  }
}
