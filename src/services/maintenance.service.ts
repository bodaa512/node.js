import { MaintenanceTask, IMaintenanceTask } from '../models/MaintenanceTask';
import { MaintenanceHistory } from '../models/MaintenanceHistory';
import { Asset } from '../models/Asset';
import { NotFoundError, ValidationError } from '../errors';
import { MaintenanceStatus, MaintenancePriority, MaintenanceType } from '../types/enums';

export class MaintenanceService {
  static async createTask(homeId: string, userId: string, data: Partial<IMaintenanceTask>): Promise<IMaintenanceTask> {
    const task = await MaintenanceTask.create({
      ...data,
      home: homeId,
      createdBy: userId,
      status: data.status || MaintenanceStatus.PENDING,
      priority: data.priority || MaintenancePriority.MEDIUM,
      type: data.type || MaintenanceType.ONE_TIME,
    });

    await MaintenanceHistory.create({
      task: task._id,
      home: homeId,
      asset: task.asset || null,
      action: 'created',
      performedBy: userId,
      notes: `Task "${task.title}" created.`,
      date: new Date(),
    });

    return task;
  }

  static async getHomeTasks(homeId: string, filters: { status?: string; assetId?: string; priority?: string } = {}): Promise<IMaintenanceTask[]> {
    const query: any = { home: homeId };
    if (filters.status) query.status = filters.status;
    if (filters.assetId) query.asset = filters.assetId;
    if (filters.priority) query.priority = filters.priority;

    return MaintenanceTask.find(query)
      .populate('asset', 'name brand model image')
      .populate('room', 'name')
      .sort({ dueDate: 1 });
  }

  static async updateTaskStatus(
    taskId: string,
    homeId: string,
    userId: string,
    status: MaintenanceStatus,
    actualCost?: number,
    notes?: string
  ): Promise<IMaintenanceTask> {
    const task = await MaintenanceTask.findOne({ _id: taskId, home: homeId });
    if (!task) {
      throw new NotFoundError('Maintenance task not found');
    }

    const previousStatus = task.status;
    task.status = status;

    if (status === MaintenanceStatus.COMPLETED) {
      task.completedDate = new Date();
      task.completedBy = userId as any;
      if (actualCost !== undefined) {
        task.actualCost = actualCost;
      }

      // Update asset maintenance history & cost if attached
      if (task.asset) {
        const costToAdd = actualCost || task.estimatedCost || 0;
        await Asset.findByIdAndUpdate(task.asset, {
          $set: { 'maintenance.lastDate': new Date() },
          $inc: {
            'maintenance.totalCost': costToAdd,
            'maintenance.totalRepairs': 1,
          },
        });
      }

      // Handle recurring logic
      if (task.recurring && task.recurring.enabled && task.recurring.intervalDays) {
        const nextDue = new Date(Date.now() + task.recurring.intervalDays * 24 * 60 * 60 * 1000);
        task.recurring.lastCompleted = new Date();
        task.recurring.nextDue = nextDue;

        // Create the next recurring instance automatically
        await MaintenanceTask.create({
          home: task.home,
          asset: task.asset,
          room: task.room,
          title: task.title,
          description: task.description,
          type: task.type,
          priority: task.priority,
          status: MaintenanceStatus.PENDING,
          recurring: task.recurring,
          dueDate: nextDue,
          estimatedCost: task.estimatedCost,
          createdBy: userId,
        });
      }
    }

    await task.save();

    // Record in history log
    await MaintenanceHistory.create({
      task: task._id,
      home: homeId,
      asset: task.asset || null,
      action: status === MaintenanceStatus.COMPLETED ? 'completed' : status === MaintenanceStatus.SKIPPED ? 'skipped' : 'rescheduled',
      performedBy: userId,
      cost: actualCost || 0,
      notes: notes || `Status changed from ${previousStatus} to ${status}.`,
      date: new Date(),
    });

    return task;
  }

  static async deleteTask(taskId: string, homeId: string): Promise<void> {
    const task = await MaintenanceTask.findOneAndDelete({ _id: taskId, home: homeId });
    if (!task) {
      throw new NotFoundError('Maintenance task not found');
    }
  }

  static async getOverdueTasks(homeId: string): Promise<IMaintenanceTask[]> {
    const now = new Date();
    return MaintenanceTask.find({
      home: homeId,
      status: { $in: [MaintenanceStatus.PENDING, MaintenanceStatus.IN_PROGRESS] },
      dueDate: { $lt: now },
    }).populate('asset', 'name brand model');
  }
}

export class WarrantyService {
  static async getWarrantySummary(homeId: string) {
    const assets = await Asset.find({ home: homeId, isActive: true, 'warranty.hasWarranty': true }).populate('documents');
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const active = assets.filter((a) => a.warranty.endDate && new Date(a.warranty.endDate) > thirtyDays);
    const expiringSoon = assets.filter((a) => a.warranty.endDate && new Date(a.warranty.endDate) >= now && new Date(a.warranty.endDate) <= thirtyDays);
    const expired = assets.filter((a) => a.warranty.endDate && new Date(a.warranty.endDate) < now);

    return {
      total: assets.length,
      activeCount: active.length,
      expiringSoonCount: expiringSoon.length,
      expiredCount: expired.length,
      active,
      expiringSoon,
      expired,
    };
  }
}
