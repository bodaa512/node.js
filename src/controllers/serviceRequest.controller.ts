import { Request, Response, NextFunction } from 'express';
import { ServiceRequestService, ProviderService } from '../services/serviceRequest.service';

export class ServiceRequestController {
  static async createRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const userId = req.user?.userId || '';
      const request = await ServiceRequestService.createRequest(homeId, userId, req.body);
      res.status(201).json({ success: true, message: 'Service request submitted', data: request });
    } catch (error) {
      next(error);
    }
  }

  static async getHomeRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const requests = await ServiceRequestService.getHomeRequests(homeId);
      res.status(200).json({ success: true, message: 'Requests retrieved', data: requests });
    } catch (error) {
      next(error);
    }
  }

  static async getRequestById(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const request = await ServiceRequestService.getRequestById(requestId);
      res.status(200).json({ success: true, message: 'Request details', data: request });
    } catch (error) {
      next(error);
    }
  }

  static async getOffers(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const offers = await ServiceRequestService.getRequestOffers(requestId);
      res.status(200).json({ success: true, message: 'Offers retrieved', data: offers });
    } catch (error) {
      next(error);
    }
  }

  static async selectOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const requestId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { offerId } = req.body;
      const userId = req.user?.userId || '';
      const result = await ServiceRequestService.selectOffer(requestId, offerId, userId);
      res.status(200).json({ success: true, message: 'Provider offer accepted and appointment scheduled', data: result });
    } catch (error) {
      next(error);
    }
  }
}

export class ProviderController {
  static async getProviders(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string;
      const city = req.query.city as string;
      const providers = await ProviderService.getProviders(category, city);
      res.status(200).json({ success: true, message: 'Providers retrieved', data: providers });
    } catch (error) {
      next(error);
    }
  }

  static async getProviderById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const provider = await ProviderService.getProviderById(id);
      res.status(200).json({ success: true, message: 'Provider details', data: provider });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const profile = await ProviderService.createOrUpdateProfile(userId, req.body);
      res.status(200).json({ success: true, message: 'Provider profile updated', data: profile });
    } catch (error) {
      next(error);
    }
  }

  static async submitOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const provider = await ProviderService.getProviders(undefined, undefined);
      const myProfile = provider.find((p) => p.user._id.toString() === userId);

      if (!myProfile) {
        return res.status(403).json({ success: false, message: 'Provider profile required to submit offers' });
      }

      const { requestId, ...offerData } = req.body;
      const offer = await ServiceRequestService.submitOffer(myProfile._id.toString(), requestId, offerData);
      res.status(201).json({ success: true, message: 'Offer submitted successfully', data: offer });
    } catch (error) {
      next(error);
    }
  }
}
