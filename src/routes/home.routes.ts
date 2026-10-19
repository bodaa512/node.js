import { Router } from 'express';
import { HomeController } from '../controllers/home.controller';
import { RoomController } from '../controllers/room.controller';
import { requireHomeAccess, requireHomeOwner } from '../middleware/homeAccess.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createHomeSchema, updateHomeSchema, createRoomSchema } from '../validators/home.validator';
import { HomeMemberRole } from '../types/enums';

const router = Router();

// Home routes
router.get('/', authenticate, HomeController.getUserHomes);
router.post('/', authenticate, validate(createHomeSchema), HomeController.createHome);

router.get('/:id', authenticate, requireHomeAccess(), HomeController.getHomeById);
router.put('/:id', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), validate(updateHomeSchema), HomeController.updateHome);
router.delete('/:id', authenticate, requireHomeOwner, HomeController.deleteHome);

router.get('/:id/dashboard', authenticate, requireHomeAccess(), HomeController.getDashboard);
router.get('/:id/timeline', authenticate, requireHomeAccess(), HomeController.getTimeline);

// Nested Room routes
router.get('/:homeId/rooms', authenticate, requireHomeAccess(), RoomController.getRooms);
router.post('/:homeId/rooms', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), validate(createRoomSchema), RoomController.createRoom);

export default router;
