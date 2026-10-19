import { Router } from 'express';
import { BlogController } from '../controllers/support.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { UserRole } from '../types/enums';

const router = Router();

router.get('/', BlogController.getPosts);
router.get('/:slug', BlogController.getPostBySlug);
router.post('/', authenticate, authorize(UserRole.ADMIN), BlogController.createPost);

export default router;
