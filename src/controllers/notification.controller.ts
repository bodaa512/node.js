import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification';

export class NotificationController {
  static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
      const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });
      res.status(200).json({ success: true, message: 'Notifications retrieved', data: { notifications, unreadCount } });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const userId = req.user?.userId || '';
      await Notification.findOneAndUpdate({ _id: id, user: userId }, { isRead: true });
      res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
      res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
}
