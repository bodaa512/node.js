import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';
import { requireHomeAccess } from '../middleware/homeAccess.middleware';
// Mock auth and validate
const authenticate = (req: any, res: any, next: any) => next();
const validate = (schema: any) => (req: any, res: any, next: any) => next();
import { updateRoomSchema } from '../validators/home.validator';

const router = Router();

// Room routes (direct access, assumes homeId is provided in body for auth check)
// In a real app, you might want a middleware that extracts homeId from the room record first
router.put('/:id', authenticate, validate(updateRoomSchema), RoomController.updateRoom);
router.delete('/:id', authenticate, RoomController.deleteRoom);

export default router;
