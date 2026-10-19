import { Router } from 'express';
import { SupportController } from '../controllers/support.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/tickets', authenticate, SupportController.getUserTickets);
router.post('/tickets', authenticate, SupportController.createTicket);
router.post('/tickets/:id/messages', authenticate, SupportController.replyTicket);

export default router;
