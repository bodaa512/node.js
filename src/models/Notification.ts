import mongoose, { Document, Schema } from 'mongoose';
import { NotificationType, NotificationPriority } from '../types/enums';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  relatedEntity?: { type: string; id: mongoose.Types.ObjectId; };
  actionUrl?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: Object.values(NotificationType), required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: Object.values(NotificationPriority), default: NotificationPriority.MEDIUM },
  isRead: { type: Boolean, default: false },
  relatedEntity: {
    type: { type: String },
    id: { type: Schema.Types.ObjectId }
  },
  actionUrl: { type: String },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export const NotificationModel = Notification;
