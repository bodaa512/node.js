import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireHomeAccess } from '../middleware/homeAccess.middleware';

const router = Router();

router.post('/chat', authenticate, AIController.sendMessage);
router.get('/health-score/home/:homeId', authenticate, requireHomeAccess(), AIController.getHealthScore);
router.get('/memory/home/:homeId', authenticate, requireHomeAccess(), AIController.getHomeMemory);
router.get('/weekly-report/home/:homeId', authenticate, requireHomeAccess(), AIController.getWeeklyReport);

export default router;
