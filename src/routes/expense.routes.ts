import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireHomeAccess } from '../middleware/homeAccess.middleware';
import { HomeMemberRole } from '../types/enums';

const router = Router();

router.get('/home/:homeId', authenticate, requireHomeAccess(), ExpenseController.getHomeExpenses);
router.post('/home/:homeId', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), ExpenseController.createExpense);
router.get('/home/:homeId/analytics', authenticate, requireHomeAccess(), ExpenseController.getAnalytics);
router.delete('/:id', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), ExpenseController.deleteExpense);

export default router;
