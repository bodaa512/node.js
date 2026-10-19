import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, ChatController.getConversations);
router.get('/:id/messages', authenticate, ChatController.getMessages);
router.post('/:id/messages', authenticate, ChatController.sendMessage);

export default router;
