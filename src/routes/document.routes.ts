import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireHomeAccess } from '../middleware/homeAccess.middleware';
import { uploadSingle } from '../middleware/upload.middleware';
import { HomeMemberRole } from '../types/enums';

const router = Router();

// Document routes scoped to home
router.get('/home/:homeId', authenticate, requireHomeAccess(), DocumentController.getHomeDocuments);
router.post('/home/:homeId', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), uploadSingle('file'), DocumentController.uploadDocument);

// Individual document routes
router.get('/:id', authenticate, requireHomeAccess(), DocumentController.getDocumentById);
router.put('/:id/confirm-extraction', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), DocumentController.confirmExtraction);
router.delete('/:id', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), DocumentController.deleteDocument);

export default router;
