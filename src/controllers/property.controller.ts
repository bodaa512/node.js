import { Request, Response, NextFunction } from 'express';
import { PropertyService } from '../services/property.service';

export class PropertyController {
  static async createProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const managerId = req.user?.userId || '';
      const property = await PropertyService.createProperty(managerId, req.body);
      res.status(201).json({ success: true, message: 'Property created', data: property });
    } catch (error) {
      next(error);
    }
  }

  static async getManagerProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const managerId = req.user?.userId || '';
      const properties = await PropertyService.getManagerProperties(managerId);
      res.status(200).json({ success: true, message: 'Properties retrieved', data: properties });
    } catch (error) {
      next(error);
    }
  }

  static async getPropertyById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const managerId = req.user?.userId || '';
      const property = await PropertyService.getPropertyById(id, managerId);
      res.status(200).json({ success: true, message: 'Property details', data: property });
    } catch (error) {
      next(error);
    }
  }

  static async addTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const propertyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { unitNumber, userId, ...tenantData } = req.body;
      const tenant = await PropertyService.addTenant(propertyId, unitNumber, userId, tenantData);
      res.status(201).json({ success: true, message: 'Tenant assigned to unit', data: tenant });
    } catch (error) {
      next(error);
    }
  }
}
