import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { UserRole } from '../types/enums';

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/dashboard', AdminController.getDashboard);
router.get('/users', AdminController.getUsers);
router.put('/providers/:id/verify', AdminController.verifyProvider);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
