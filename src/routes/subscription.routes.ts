import { Router } from 'express';
import { SubscriptionController } from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireHomeAccess } from '../middleware/homeAccess.middleware';
import { HomeMemberRole } from '../types/enums';

const router = Router();

router.get('/home/:homeId', authenticate, requireHomeAccess(), SubscriptionController.getHomeSubscriptions);
router.post('/home/:homeId', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), SubscriptionController.createSubscription);
router.get('/home/:homeId/insights', authenticate, requireHomeAccess(), SubscriptionController.getInsights);
router.delete('/:id', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), SubscriptionController.deleteSubscription);

export default router;
