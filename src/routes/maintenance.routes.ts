import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenance.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireHomeAccess } from '../middleware/homeAccess.middleware';
import { HomeMemberRole } from '../types/enums';

const router = Router();

// Tasks scoped to home
router.get('/home/:homeId', authenticate, requireHomeAccess(), MaintenanceController.getHomeTasks);
router.post('/home/:homeId', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN, HomeMemberRole.MEMBER), MaintenanceController.createTask);

// Warranty summary scoped to home
router.get('/warranties/home/:homeId', authenticate, requireHomeAccess(), MaintenanceController.getWarrantySummary);

// Individual task updates
router.put('/:id/status', authenticate, requireHomeAccess(), MaintenanceController.updateTaskStatus);
router.delete('/:id', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), MaintenanceController.deleteTask);

export default router;
