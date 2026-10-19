import { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/room.service';

export class RoomController {
  static async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const room = await RoomService.createRoom(homeId, req.body);
      res.status(201).json({ success: true, message: 'Room created successfully', data: room });
    } catch (error) {
      next(error);
    }
  }

  static async getRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const rooms = await RoomService.getRooms(homeId);
      res.status(200).json({ success: true, message: 'Rooms retrieved', data: rooms });
    } catch (error) {
      next(error);
    }
  }

  static async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.body.homeId || req.homeAccess?.homeId || '';
      
      const room = await RoomService.updateRoom(roomId, homeId, req.body);
      res.status(200).json({ success: true, message: 'Room updated', data: room });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.body.homeId || req.homeAccess?.homeId || '';
      
      await RoomService.deleteRoom(roomId, homeId);
      res.status(200).json({ success: true, message: 'Room deleted', data: null });
    } catch (error) {
      next(error);
    }
  }
}
