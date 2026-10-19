import { Router } from 'express';
import { ServiceRequestController } from '../controllers/serviceRequest.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireHomeAccess } from '../middleware/homeAccess.middleware';

const router = Router();

router.get('/home/:homeId', authenticate, requireHomeAccess(), ServiceRequestController.getHomeRequests);
router.post('/home/:homeId', authenticate, requireHomeAccess(), ServiceRequestController.createRequest);

router.get('/:id', authenticate, ServiceRequestController.getRequestById);
router.get('/:id/offers', authenticate, ServiceRequestController.getOffers);
router.post('/:id/select-offer', authenticate, ServiceRequestController.selectOffer);

export default router;
