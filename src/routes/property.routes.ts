import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { UserRole } from '../types/enums';

const router = Router();

router.get('/', authenticate, authorize(UserRole.PROPERTY_MANAGER, UserRole.ADMIN), PropertyController.getManagerProperties);
router.post('/', authenticate, authorize(UserRole.PROPERTY_MANAGER, UserRole.ADMIN), PropertyController.createProperty);
router.get('/:id', authenticate, authorize(UserRole.PROPERTY_MANAGER, UserRole.ADMIN), PropertyController.getPropertyById);
router.post('/:id/tenants', authenticate, authorize(UserRole.PROPERTY_MANAGER, UserRole.ADMIN), PropertyController.addTenant);

export default router;
