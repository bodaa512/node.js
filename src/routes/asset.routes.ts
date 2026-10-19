import { Router } from 'express';
import { AssetController } from '../controllers/asset.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireHomeAccess } from '../middleware/homeAccess.middleware';
import { validate } from '../middleware/validate.middleware';
import { createAssetSchema, updateAssetSchema, repairReplaceSchema } from '../validators/asset.validator';
import { HomeMemberRole } from '../types/enums';

const router = Router();

// Global category listing
router.get('/categories', authenticate, AssetController.getCategories);

// Asset routes scoped to a home (nested under /api/homes/:homeId/assets or mounted at /api/assets)
router.get('/home/:homeId', authenticate, requireHomeAccess(), AssetController.getHomeAssets);
router.post('/home/:homeId', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), validate(createAssetSchema), AssetController.createAsset);

// Individual asset direct routes
router.get('/:id', authenticate, requireHomeAccess(), AssetController.getAssetById);
router.put('/:id', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), validate(updateAssetSchema), AssetController.updateAsset);
router.delete('/:id', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), AssetController.deleteAsset);

// Repair vs Replace engine
router.post('/:id/repair-replace', authenticate, validate(repairReplaceSchema), AssetController.calculateRepairReplace);

export default router;
