import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/plans', PaymentController.getPlans);
router.post('/create-checkout', authenticate, PaymentController.createCheckoutSession);
router.post('/webhook', PaymentController.handleWebhook);
router.get('/history', authenticate, PaymentController.getUserPayments);

export default router;
