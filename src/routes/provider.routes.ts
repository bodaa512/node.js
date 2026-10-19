import { Router } from 'express';
import { ProviderController } from '../controllers/serviceRequest.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { UserRole } from '../types/enums';

const router = Router();

router.get('/', ProviderController.getProviders);
router.get('/:id', ProviderController.getProviderById);
router.post('/profile', authenticate, ProviderController.updateProfile);
router.post('/offers', authenticate, authorize(UserRole.PROVIDER, UserRole.ADMIN), ProviderController.submitOffer);

export default router;
