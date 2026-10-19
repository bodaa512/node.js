import cron from 'node-cron';
import { MaintenanceTask } from '../models/MaintenanceTask';
import { Asset } from '../models/Asset';
import { SubscriptionTracker } from '../models/SubscriptionTracker';
import { Notification } from '../models/Notification';
import { MaintenanceStatus, NotificationType, NotificationPriority } from '../types/enums';

export class Scheduler {
  static initJobs() {
    console.log('⏰ Initializing HomePilot Automated Cron Job Scheduler...');

    // Run every day at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
      console.log('🔄 Running daily maintenance & warranty automated check...');
      try {
        const now = new Date();

        // 1. Mark overdue tasks
        const overdueTasks = await MaintenanceTask.find({
          status: MaintenanceStatus.PENDING,
          dueDate: { $lt: now },
        });

        for (const task of overdueTasks) {
          task.status = MaintenanceStatus.OVERDUE;
          await task.save();

          // Create notification for home members
          await Notification.create({
            user: task.createdBy,
            type: NotificationType.MAINTENANCE,
            title: 'Maintenance Overdue',
            message: `Task "${task.title}" is now overdue. Please complete or reschedule.`,
            priority: NotificationPriority.HIGH,
            actionUrl: `/maintenance`,
          });
        }

        // 2. Warranty Expiry Alerts (30 days & 7 days out)
        const thirtyDaysAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const assetsExpiring = await Asset.find({
          isActive: true,
          'warranty.hasWarranty': true,
          'warranty.endDate': { $gte: now, $lte: thirtyDaysAhead },
        });

        for (const asset of assetsExpiring) {
          await Notification.create({
            user: asset.home,
            type: NotificationType.WARRANTY,
            title: 'Warranty Expiring Soon',
            message: `Warranty for "${asset.name}" will expire on ${asset.warranty.endDate?.toLocaleDateString()}.`,
            priority: NotificationPriority.MEDIUM,
            actionUrl: `/assets/${asset._id}`,
          });
        }

        // 3. Subscription renewal alerts
        const sevenDaysAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const upcomingSubs = await SubscriptionTracker.find({
          isActive: true,
          nextBillingDate: { $gte: now, $lte: sevenDaysAhead },
        });

        for (const sub of upcomingSubs) {
          await Notification.create({
            user: sub.createdBy,
            type: NotificationType.SUBSCRIPTION,
            title: 'Subscription Renewal Alert',
            message: `Subscription "${sub.name}" (${sub.amount} ${sub.currency}) renews on ${sub.nextBillingDate.toLocaleDateString()}.`,
            priority: NotificationPriority.MEDIUM,
            actionUrl: `/subscriptions`,
          });
        }

        console.log(`✅ Daily check complete: ${overdueTasks.length} tasks marked overdue, ${assetsExpiring.length} warranty alerts sent.`);
      } catch (error) {
        console.error('❌ Error during cron execution:', error);
      }
    });
  }
}
