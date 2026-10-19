import { Request, Response, NextFunction } from 'express';
import { CalendarEvent } from '../models/CalendarEvent';
import { MaintenanceTask } from '../models/MaintenanceTask';
import { Appointment } from '../models/Appointment';
import { Asset } from '../models/Asset';
import { CalendarEventType } from '../types/enums';

export class CalendarController {
  /**
   * Aggregates maintenance tasks, appointments, warranty expiries, and custom calendar events
   * into a unified interactive calendar feed.
   */
  static async getHomeCalendar(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const { start, end } = req.query;

      const startDate = start ? new Date(start as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = end ? new Date(end as string) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

      const [customEvents, tasks, appointments, assets] = await Promise.all([
        CalendarEvent.find({ home: homeId, startDate: { $gte: startDate, $lte: endDate } }),
        MaintenanceTask.find({ home: homeId, dueDate: { $gte: startDate, $lte: endDate } }).populate('asset', 'name'),
        Appointment.find({ home: homeId, date: { $gte: startDate, $lte: endDate } }).populate('provider', 'businessName'),
        Asset.find({ home: homeId, isActive: true, 'warranty.hasWarranty': true, 'warranty.endDate': { $gte: startDate, $lte: endDate } }),
      ]);

      const events: any[] = [];

      // Custom events
      customEvents.forEach((e) => {
        events.push({
          id: e._id,
          title: e.title,
          start: e.startDate,
          end: e.endDate,
          type: e.type,
          color: e.color || '#3b82f6',
        });
      });

      // Maintenance events
      tasks.forEach((t) => {
        events.push({
          id: `task_${t._id}`,
          title: `Maintenance: ${t.title}`,
          start: t.dueDate,
          type: CalendarEventType.MAINTENANCE,
          color: t.status === 'overdue' ? '#ef4444' : '#f59e0b',
          metadata: { taskId: t._id, status: t.status },
        });
      });

      // Appointment events
      appointments.forEach((a) => {
        events.push({
          id: `apt_${a._id}`,
          title: `Service Appointment: ${a.notes || 'Provider Visit'}`,
          start: a.date,
          type: CalendarEventType.APPOINTMENT,
          color: '#10b981',
          metadata: { appointmentId: a._id, provider: (a.provider as any)?.businessName },
        });
      });

      // Warranty Expiries
      assets.forEach((a) => {
        if (a.warranty?.endDate) {
          events.push({
            id: `war_${a._id}`,
            title: `Warranty Expiry: ${a.name}`,
            start: a.warranty.endDate,
            type: CalendarEventType.WARRANTY_EXPIRY,
            color: '#8b5cf6',
            metadata: { assetId: a._id },
          });
        }
      });

      res.status(200).json({ success: true, message: 'Calendar feed retrieved', data: events });
    } catch (error) {
      next(error);
    }
  }

  static async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const userId = req.user?.userId || '';
      const event = await CalendarEvent.create({
        ...req.body,
        home: homeId,
        user: userId,
        startDate: new Date(req.body.startDate),
        endDate: req.body.endDate ? new Date(req.body.endDate) : new Date(req.body.startDate),
      });
      res.status(201).json({ success: true, message: 'Calendar event created', data: event });
    } catch (error) {
      next(error);
    }
  }
}
