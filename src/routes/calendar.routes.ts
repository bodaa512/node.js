import { Router } from 'express';
import { CalendarController } from '../controllers/calendar.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireHomeAccess } from '../middleware/homeAccess.middleware';

const router = Router();

router.get('/home/:homeId', authenticate, requireHomeAccess(), CalendarController.getHomeCalendar);
router.post('/home/:homeId', authenticate, requireHomeAccess(), CalendarController.createEvent);

export default router;
